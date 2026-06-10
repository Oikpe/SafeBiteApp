from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from openai import OpenAI
from typing import List
from functools import lru_cache
import os
import json
import io
import re
import asyncio
from datetime import datetime, timezone
from dotenv import load_dotenv


load_dotenv()

app = FastAPI(title="Menu Allergen Scanner API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.")
if not HF_TOKEN:
    raise RuntimeError("Missing HF_TOKEN in environment.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

ai_client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)

# Model configuration
PRIMARY_MODEL = "Qwen/Qwen2.5-Coder-32B-Instruct"
FALLBACK_MODEL = "meta-llama/Llama-3.1-8B-Instruct"

BATCH_SIZE = 12

AI_TIMEOUT = 30


@lru_cache(maxsize=1)
def _get_doctr_predictor():
    from doctr.models import ocr_predictor
    return ocr_predictor(pretrained=True)


def run_ocr(image_bytes: bytes) -> str:
    if not image_bytes:
        return ""

    try:
        from doctr.io import DocumentFile

        doc = DocumentFile.from_images([image_bytes])
        predictor = _get_doctr_predictor()
        result = predictor(doc)
        text = result.render()
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")


def extract_menu_items(text: str) -> List[str]:
    lines = [ln.strip() for ln in text.splitlines()]
    cleaned: List[str] = []

    for ln in lines:
        if not ln:
            continue
        if len(ln) < 2:
            continue
        if re.fullmatch(r"[\d\W]+", ln):
            continue
        if re.search(r"\b(?:rp|idr|usd|sgd|eur|gbp)\b", ln, re.IGNORECASE):
            continue
        if re.search(r"\$\s*\d", ln):
            continue
        if re.search(r"\d+\s*(?:k|rb)\b", ln, re.IGNORECASE):
            continue
        cleaned.append(ln)

    # Keep a manageable number of items
    return cleaned[:40]


def _build_prompt(menu_text: str, allergens: List[str]) -> List[dict]:
    """Build an optimized prompt with system + user messages for reliable JSON output."""
    system_msg = (
        "You are a food allergen detection API. You receive menu text and a list of user allergens. "
        "You MUST respond with ONLY a valid JSON array — no markdown, no explanation, no code fences. "
        "Each object in the array must have exactly these keys: "
        '"food_name" (string), "description" (string, brief ingredients/description), '
        '"detected_allergens" (array of strings from the user\'s allergen list only, or empty []), '
        '"status" ("danger" if allergens found, "caution" if uncertain, "safe" if none), '
        '"confidence" (integer 0-100).'
    )

    user_msg = (
        f"User allergens: {json.dumps(allergens)}\n\n"
        f"Menu text:\n{menu_text}\n\n"
        "Extract food/drink items, ignore prices, noise, and non-food text. "
        "Respond with ONLY a JSON array."
    )

    return [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_msg},
    ]


def _parse_ai_response(raw_output: str) -> List[dict]:
    """Parse AI response into a list of dicts, handling common LLM output issues."""
    if not raw_output:
        return []

    # Strip markdown code fences if present
    clean = raw_output.strip()
    clean = re.sub(r"^```(?:json)?\s*", "", clean)
    clean = re.sub(r"\s*```$", "", clean)
    clean = clean.strip()

    # Attempt 1: direct parse
    try:
        result = json.loads(clean)
        if isinstance(result, list):
            return result
        if isinstance(result, dict):
            return [result]
    except json.JSONDecodeError:
        pass

    # Attempt 2: extract JSON array from noisy output
    match = re.search(r"\[[\s\S]*\]", clean)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            # Attempt 3: repair truncated JSON — close at last complete object
            partial = match.group(0)
            last_brace = partial.rfind("}")
            if last_brace > 0:
                repaired = partial[:last_brace + 1] + "]"
                try:
                    return json.loads(repaired)
                except json.JSONDecodeError:
                    pass

    # Attempt 4: handle case where output starts with [ but is truncated
    if clean.lstrip().startswith("["):
        last_brace = clean.rfind("}")
        if last_brace > 0:
            repaired = clean[:last_brace + 1] + "]"
            try:
                return json.loads(repaired)
            except json.JSONDecodeError:
                pass

    return []


def _validate_results(results: List[dict]) -> List[dict]:
    """Validate and clean each result object to ensure consistent schema."""
    valid = []
    for item in results:
        if not isinstance(item, dict):
            continue
        food_name = item.get("food_name", "").strip()
        if not food_name or len(food_name) < 2:
            continue

        # Ensure all required fields with correct types
        validated = {
            "food_name": food_name,
            "description": str(item.get("description", "")).strip() or "No description available",
            "detected_allergens": item.get("detected_allergens", []) if isinstance(item.get("detected_allergens"), list) else [],
            "status": item.get("status", "caution") if item.get("status") in ("danger", "caution", "safe") else "caution",
            "confidence": min(100, max(0, int(item.get("confidence", 70)))) if isinstance(item.get("confidence"), (int, float)) else 70,
        }
        valid.append(validated)
    return valid


async def _call_ai(messages: List[dict], model: str, timeout: int = AI_TIMEOUT) -> List[dict]:
    """Call the AI model with timeout and return parsed results."""
    try:
        loop = asyncio.get_event_loop()
        completion = await asyncio.wait_for(
            loop.run_in_executor(
                None,
                lambda: ai_client.chat.completions.create(
                    model=model,
                    messages=messages,
                    max_tokens=4096,
                    temperature=0.1,
                ),
            ),
            timeout=timeout,
        )
        raw_output = completion.choices[0].message.content or ""
        results = _parse_ai_response(raw_output)
        return _validate_results(results)
    except asyncio.TimeoutError:
        return []
    except Exception:
        return []


async def _analyze_batch(menu_text: str, allergens: List[str]) -> List[dict]:
    """Analyze a batch of menu items with primary model + fallback retry."""
    messages = _build_prompt(menu_text, allergens)

    # Try primary model
    results = await _call_ai(messages, PRIMARY_MODEL)
    if results:
        return results

    # Fallback: retry with secondary model
    results = await _call_ai(messages, FALLBACK_MODEL)
    return results


@app.get("/")
def health_check():
    return {"status": "online", "message": "Menu Scanner API is active."}

@app.post("/api/scan")
async def scan_menu(
    profile_id: str = Form(...),
    file: UploadFile | None = File(None),
    query: str | None = Form(None),
):
    try:
        if not file and not query:
            raise HTTPException(status_code=400, detail="Either file or query is required.")

        if file:
            image_bytes = await file.read()
            extracted_text = run_ocr(image_bytes)
            source = "camera"
            query_text = ""
        else:
            extracted_text = query.strip() if query else ""
            source = "search"
            query_text = query or ""

        if not extracted_text:
            raise HTTPException(status_code=422, detail="No text extracted from image/query.")

        menu_items = extract_menu_items(extracted_text)
        if menu_items:
            extracted_text = "\n".join(menu_items)

        # Fetch active allergens
        allergy_response = supabase.table("user_allergies").select("allergy_id").eq("profile_id", profile_id).execute()
        active_list = [row["allergy_id"] for row in allergy_response.data]

        # Run AI analysis with batching for large menus
        if len(menu_items) > BATCH_SIZE:
            # Split into batches and process concurrently
            batches = [
                menu_items[i:i + BATCH_SIZE]
                for i in range(0, len(menu_items), BATCH_SIZE)
            ]
            tasks = [
                _analyze_batch("\n".join(batch), active_list)
                for batch in batches
            ]
            batch_results = await asyncio.gather(*tasks)
            ai_results = []
            for batch in batch_results:
                ai_results.extend(batch)
        else:
            ai_results = await _analyze_batch(extracted_text, active_list)

        if not ai_results:
            raise HTTPException(
                status_code=422,
                detail="No food or menu items detected in this image. Please scan a restaurant menu or food list."
            )

        # Create scan session after AI succeeds
        session_data = {
            "profile_id": profile_id,
            "source": source,
            "query": query_text,
            "image_url": "",
            "items_scanned": len(ai_results),
            "scanned_at": datetime.now(timezone.utc).isoformat()
        }
        session_response = supabase.table("scan_sessions").insert(session_data).execute()
        session_id = session_response.data[0]['id']

        # Save results to database
        for dish in ai_results:
            new_result_data = {
                "session_id": session_id,
                "food_name": dish.get("food_name", ""),
                "status": dish.get("status", "caution"),
                "detected_allergens": dish.get("detected_allergens", []),
                "description": dish.get("description", ""),
                "confidence": dish.get("confidence", 0),
                "raw_ai_response": dish
            }
            supabase.table("scan_results").insert(new_result_data).execute()

        return {"status": "success", "session_id": session_id, "data": ai_results}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))