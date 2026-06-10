import type { ScanResult } from "../types";

/** Whether to use mock data (true) or the real model backend (false). */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_AI !== "false";


function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



const MOCK_MENU_RESULTS: ScanResult[] = [
    {
        id: "scan-1",
        name: "Pad Thai",
        status: "danger",
        allergens: ["peanuts", "shellfish", "eggs"],
        description: "Rice noodles stir-fried with shrimp, bean sprouts, and peanut sauce",
        confidence: 96,
    },
    {
        id: "scan-2",
        name: "Tom Yum Soup",
        status: "caution",
        allergens: ["shellfish"],
        description: "Spicy Thai soup — shrimp variant detected",
        confidence: 88,
    },
    {
        id: "scan-3",
        name: "Mango Sticky Rice",
        status: "safe",
        allergens: [],
        description: "Sweet glutinous rice with fresh mango and coconut cream",
        confidence: 94,
    },
    {
        id: "scan-4",
        name: "Spring Rolls",
        status: "caution",
        allergens: ["gluten", "soy"],
        description: "Crispy rolls with vegetables and glass noodles in soy-based sauce",
        confidence: 82,
    },
    {
        id: "scan-5",
        name: "Jasmine Rice",
        status: "safe",
        allergens: [],
        description: "Plain steamed jasmine rice",
        confidence: 99,
    },
    {
        id: "scan-6",
        name: "Green Curry",
        status: "caution",
        allergens: ["fish"],
        description: "Contains fish sauce. Verify with restaurant.",
        confidence: 82,
    },
    {
        id: "scan-7",
        name: "Fresh Spring Rolls",
        status: "safe",
        allergens: [],
        description: "Rice paper with vegetables, no common allergens",
        confidence: 91,
    },
];


const SEARCH_DATABASE: Record<string, ScanResult> = {
    "pad thai":      { id: "sr1",  name: "Pad Thai",               status: "danger",  allergens: ["peanuts", "shellfish", "eggs"], description: "Traditional Thai stir-fried noodles with peanut sauce, shrimp, and egg. High risk for peanut and shellfish allergies.", confidence: 97 },
    "sushi":         { id: "sr2",  name: "Sushi (General)",         status: "caution", allergens: ["fish", "shellfish", "soy"],     description: "Raw fish over vinegared rice. May contain soy sauce. Verify specific roll ingredients with chef.", confidence: 85 },
    "pizza":         { id: "sr3",  name: "Pizza Margherita",        status: "caution", allergens: ["dairy", "gluten"],              description: "Contains wheat-based dough and mozzarella cheese. Verify crust ingredients for additional allergens.", confidence: 90 },
    "burger":        { id: "sr4",  name: "Classic Burger",          status: "caution", allergens: ["gluten", "dairy", "sesame"],    description: "Wheat bun, may contain dairy in sauce, sesame seeds on bun. Check for specific condiment allergens.", confidence: 88 },
    "salad":         { id: "sr5",  name: "Garden Salad",            status: "safe",    allergens: [],                               description: "Fresh mixed vegetables with olive oil dressing. Free from major allergens. Verify dressing ingredients separately.", confidence: 93 },
    "rice":          { id: "sr6",  name: "Steamed Rice",            status: "safe",    allergens: [],                               description: "Plain steamed rice without any added ingredients. Safe for all common allergen profiles.", confidence: 99 },
    "pasta":         { id: "sr7",  name: "Pasta",                   status: "danger",  allergens: ["gluten", "eggs", "dairy"],      description: "Wheat-based pasta, typically contains eggs. Cream sauces contain dairy. High risk for gluten sensitivity.", confidence: 92 },
    "thai food":     { id: "sr8",  name: "Thai Cuisine (General)",  status: "caution", allergens: ["peanuts", "fish", "shellfish"], description: "Thai cuisine commonly uses peanuts, fish sauce, and shrimp paste. Always verify specific dish ingredients.", confidence: 80 },
    "indian curry":  { id: "sr9",  name: "Indian Curry",            status: "caution", allergens: ["dairy"],                        description: "May contain ghee (clarified butter), cream, and ground nuts. Verify specific curry preparation.", confidence: 83 },
    "mexican tacos": { id: "sr10", name: "Mexican Tacos",           status: "caution", allergens: ["dairy", "gluten"],              description: "Corn or wheat tortillas with various fillings. Check for cheese, sour cream, and flour tortillas.", confidence: 86 },
    "italian menu":  { id: "sr11", name: "Italian Cuisine (General)", status: "caution", allergens: ["gluten", "dairy", "eggs"],    description: "Italian dishes commonly feature wheat pasta, cheese, and eggs. Verify specific dish ingredients.", confidence: 82 },
    "sushi bar":     { id: "sr12", name: "Sushi Bar Menu",          status: "caution", allergens: ["fish", "shellfish", "soy"],     description: "Raw and cooked seafood with soy sauce. Cross-contamination risk. Ask about specific roll ingredients.", confidence: 84 },
    "burger joint":  { id: "sr13", name: "Burger Joint Menu",       status: "caution", allergens: ["gluten", "dairy", "sesame", "eggs"], description: "Burgers with wheat buns, cheese, mayo, and sesame. Check for nut-based spreads.", confidence: 87 },
};


function findMockSearchResult(query: string): ScanResult | null {
    const q = query.trim().toLowerCase();
    // Exact match
    if (SEARCH_DATABASE[q]) return SEARCH_DATABASE[q];
    // Partial match
    for (const [key, result] of Object.entries(SEARCH_DATABASE)) {
        if (key.includes(q) || q.includes(key)) return result;
    }
    // Word-level match
    const qWords = q.split(/\s+/);
    for (const [key, result] of Object.entries(SEARCH_DATABASE)) {
        const kWords = key.split(/\s+/);
        if (qWords.some((w) => kWords.includes(w) && w.length > 2)) return result;
    }
    return null;
}

const MODEL_API_URL = (import.meta.env.VITE_MODEL_API_URL as string | undefined) || "/api";

interface ModelScanItem {
    food_name: string;
    description: string;
    detected_allergens: string[];
    status: "danger" | "caution" | "safe";
    confidence: number;
}

interface ModelScanResponse {
    status: "success" | "error";
    session_id: string;
    data: ModelScanItem[];
}

async function _callModelAPI(params: {
    profileId: string;
    file?: File;
    query?: string;
}): Promise<ModelScanResponse> {
    const form = new FormData();
    form.append("profile_id", params.profileId);
    if (params.file) {
        form.append("file", params.file, params.file.name);
    }
    if (params.query) {
        form.append("query", params.query);
    }

    const base = MODEL_API_URL.replace(/\/$/, "");
    const endpoint = base.endsWith("/api") ? `${base}/scan` : `${base}/api/scan`;

    const res = await fetch(endpoint, {
        method: "POST",
        body: form,
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(
            `[scanService] Model API error (${res.status}): ${errText || res.statusText}`
        );
    }

    return (await res.json()) as ModelScanResponse;
}



export interface ScanRequest {
    /** Image URI (file:// on native, base64 or URL on web) */
    imageUri: string;

    query?: string;

    userAllergies?: string[];

    profileId?: string;

    file?: File;
}

export const scanService = {
    async analyzeMenu(request: ScanRequest): Promise<ScanResult[]> {
        if (USE_MOCK) {
            await delay(1800);
            return MOCK_MENU_RESULTS;
        }

        if (!request.profileId) {
            throw new Error("[scanService] Missing profileId for model request.");
        }
        if (!request.file) {
            throw new Error("[scanService] Missing image file for model request.");
        }

        const modelResponse = await _callModelAPI({
            profileId: request.profileId,
            file: request.file,
        });

        return modelResponse.data.map((item, idx) => ({
            id: `ai-${Date.now()}-${idx}`,
            name: item.food_name,
            status: item.status,
            allergens: item.detected_allergens,
            description: item.description,
            confidence: item.confidence,
        }));
    },

    async searchFood(
        query: string,
        options: { userAllergies?: string[]; profileId?: string } = {}
    ): Promise<ScanResult | null> {
        if (USE_MOCK) {
            await delay(800);
            return findMockSearchResult(query);
        }

        if (!options.profileId) {
            throw new Error("[scanService] Missing profileId for model request.");
        }

        const modelResponse = await _callModelAPI({
            profileId: options.profileId,
            query,
        });
        const results = modelResponse.data.map((item, idx) => ({
            id: `ai-${Date.now()}-${idx}`,
            name: item.food_name,
            status: item.status,
            allergens: item.detected_allergens,
            description: item.description,
            confidence: item.confidence,
        }));
        return results[0] ?? null;
    },
};
