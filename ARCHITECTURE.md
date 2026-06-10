# SafeBite — Architecture Guide

Dokumen ini menjelaskan struktur project dan peta file untuk tim development.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4 · Vanilla CSS |
| Animation | motion/react (Framer Motion v12) |
| Backend | Supabase (Auth, Database) |
| AI Backend | FastAPI · DocTR (OCR) · HuggingFace Inference API |
| State | React Context (AppContext + AuthContext) |
| Routing | react-router v7 |
| i18n | Custom translations (ID/EN) |
| Mobile | Capacitor (Android/iOS) |

## Architecture Pattern: Layered Architecture

```
┌─────────────────────────────────────────────────┐
│                  Pages Layer                     │ ← UI / Views
│  (Scan, Results, Home, Profile, History, etc.)  │
├─────────────────────────────────────────────────┤
│              Components Layer                    │ ← Shared UI
│  (BottomNav, MobileLayout, RouteGuards, etc.)   │
├─────────────────────────────────────────────────┤
│              Context Layer                       │ ← State Management
│  (AppContext, AuthContext)                       │
├─────────────────────────────────────────────────┤
│              Service Layer                       │ ← Business Logic
│  (scanService, authService, historyService,     │
│   allergyService, familyService, profileService)│
├─────────────────────────────────────────────────┤
│              Infrastructure Layer                │ ← External I/O
│  (supabaseClient, storageService)               │
├─────────────────────────────────────────────────┤
│           Types / Constants / Utils              │ ← Shared
│  (types/, constants/, utils/, i18n/, hooks/)    │
├─────────────────────────────────────────────────┤
│         Model Backend (Python / FastAPI)          │ ← AI Processing
│  (model/main.py — deployed separately)           │
└─────────────────────────────────────────────────┘
```

## Folder Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Router setup
├── app/
│   ├── context/
│   │   ├── AppContext.tsx     # State utama (profile, allergies, family, history)
│   │   └── AuthContext.tsx    # Auth state (user, session)
│   │
│   ├── services/             # ★ Backend logic — semua Supabase calls ada di sini
│   │   ├── supabaseClient.ts  #   Singleton client
│   │   ├── authService.ts     #   Login, signup, logout, reset password
│   │   ├── scanService.ts     #   ★★ FILE AI — integrasi model ML
│   │   ├── allergyService.ts  #   CRUD user_allergies
│   │   ├── familyService.ts   #   CRUD family_members + member_allergies
│   │   ├── historyService.ts  #   CRUD scan_sessions + scan_results
│   │   ├── profileService.ts  #   CRUD profiles
│   │   └── storageService.ts  #   localStorage cache
│   │
│   ├── pages/                # UI pages (one per route)
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Onboarding.tsx
│   │   ├── Home.tsx
│   │   ├── Scan.tsx          # Scan page — calls scanService
│   │   ├── Results.tsx       # Displays scan results
│   │   ├── History.tsx
│   │   ├── Profile.tsx
│   │   ├── ProfileEdit.tsx
│   │   ├── SetupMode.tsx
│   │   ├── AllergySetup.tsx
│   │   ├── FamilyMemberDetail.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   │
│   ├── components/           # Shared UI components
│   │   ├── RootLayout.tsx     # Page transitions + BottomNav mount
│   │   ├── BottomNav.tsx      # Bottom navigation pill
│   │   ├── MobileLayout.tsx   # Responsive mobile wrapper
│   │   ├── RouteGuards.tsx    # Auth + onboarding guards
│   │   ├── AllergenIcons.tsx  # SVG allergen icons
│   │   └── OnboardingIcons.tsx
│   │
│   ├── types/
│   │   ├── index.ts          # Domain types (ScanResult, FamilyMember, etc.)
│   │   └── database.ts       # Supabase table types
│   │
│   ├── constants/
│   │   ├── allergies.ts      # Master allergen list
│   │   ├── memberColors.ts   # Avatar color palette
│   │   └── mockData.ts       # Dev seed data
│   │
│   ├── hooks/
│   │   └── useAllergyFilter.ts  # Derives active allergen list
│   │
│   ├── utils/
│   │   ├── sanitize.ts       # Input validation
│   │   ├── helpers.ts        # Misc utilities
│   │   └── theme.ts          # CSS variable toggling
│   │
│   ├── i18n/
│   │   └── translations.ts   # ID + EN strings
│   │
│   └── routes.tsx            # Route definitions
│
├── index.css                 # Global styles
└── assets/                   # Static assets

model/                        # AI Backend (deployed separately)
├── main.py                   # FastAPI server
├── requirements.txt          # Python dependencies
└── Dockerfile                # Container config for deployment
```

## Data Flow

### Frontend Flow (User Actions)
```
User Action (UI)
      │
      ▼
  AppContext  ←──── AuthContext (auth state)
      │
      ▼
  Service Layer (services/*.ts)
      │
      ▼
  Supabase (Database + Auth)
      │
      ▼
  localStorage (cache for fast render)
```

### AI Scan Flow (Camera / Search)
```
User uploads image or types search query
      │
      ▼
  Scan.tsx → scanService.ts
      │
      ├── Mock mode: returns hardcoded sample data
      │
      └── Real mode:
            │
            ▼
      Vite Dev Proxy (/api → localhost:7860)
            │
            ▼
      FastAPI Backend (model/main.py)
            │
            ├── If image: DocTR OCR → extract text
            ├── Extract menu items (filter noise, prices, non-food text)
            ├── Fetch user allergies from Supabase
            ├── Split into batches (max 12 items per batch)
            ├── Build prompt → Qwen2.5-Coder-32B (primary model)
            │   └── Fallback: retry with Llama-3.1-8B if primary fails
            ├── Parse & validate JSON response
            ├── Save results to Supabase (scan_sessions + scan_results)
            │
            ▼
      Return results to frontend → navigate to /results
```

## Integrasi Model AI

### Arsitektur Model

Model backend **bukan** model ML yang di-train sendiri. Arsitekturnya:

| Komponen | Teknologi | Fungsi |
|----------|-----------|--------|
| OCR | DocTR (Mindee) | Ekstraksi teks dari gambar menu |
| AI (Primary) | Qwen2.5-Coder-32B-Instruct | Analisis alergen — structured JSON output |
| AI (Fallback) | Llama-3.1-8B-Instruct | Fallback model jika primary gagal/timeout |
| API | FastAPI | HTTP endpoint untuk frontend |
| DB | Supabase Python SDK | Baca allergi user, simpan hasil scan |

### AI Processing Pipeline

1. **OCR** — DocTR mengekstrak teks dari gambar menu
2. **Text Cleaning** — Filter noise (harga, karakter non-food, baris pendek)
3. **Batching** — Menu items dibagi ke batch max 12 item untuk menghindari token overflow
4. **AI Analysis** — Setiap batch dikirim ke Qwen2.5 via HuggingFace Router API
   - Jika gagal atau timeout (30s), retry dengan Llama 3.1 8B sebagai fallback
5. **JSON Parsing** — Response di-parse dengan multi-layer parser (direct → regex extract → truncation repair)
6. **Validation** — Setiap result divalidasi: field types, value ranges, allergen names
7. **Persistence** — Hasil disimpan ke `scan_sessions` + `scan_results` tables

### Mode Operasi

**Mock Mode** (`VITE_USE_MOCK_AI=true`):
- Frontend mengembalikan data sample hardcoded
- Tidak memerlukan model backend
- Cocok untuk development dan demo

**Real Mode** (`VITE_USE_MOCK_AI=false`):
- Frontend mengirim FormData ke `/api/scan` via Vite proxy
- Model backend menjalankan OCR + AI analysis
- Hasil disimpan ke Supabase oleh backend secara otomatis
- Frontend hanya perlu update local state (tidak insert ulang ke DB)

### Yang TIDAK perlu diubah untuk switch mode:
- UI/pages — sudah handle kedua mode
- AppContext — sudah wire ke scanService
- Types — contract sudah defined

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_USE_MOCK_AI=true
VITE_MODEL_API_URL=/api
```

### Model Backend (model/.env)
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...   # ⚠️ Keep secret! Bypasses RLS
HF_TOKEN=hf_xxxxx                      # HuggingFace API token
```

## Supabase Tables

| Table | Deskripsi | RLS |
|---|---|---|
| `profiles` | User profile (auto-created on signup via trigger) | ✅ Enabled |
| `user_allergies` | User's personal allergen list | ✅ Enabled |
| `family_members` | Family member data | ✅ Enabled |
| `member_allergies` | Per-member allergen associations | ✅ Enabled |
| `scan_sessions` | Scan event log (camera/search/gallery) | ✅ Enabled |
| `scan_results` | Individual food items from each scan | ✅ Enabled |

### RLS Policy Pattern
- Frontend (anon key + user JWT): Users can only read/write their own data
- Model backend (service_role_key): Bypasses RLS for server-side operations

## Deployment

### Frontend
- **Development**: `npm run dev` (Vite dev server with proxy)
- **Production**: `npm run build` → deploy `dist/` to hosting
- **Mobile**: Capacitor (planned)

### Model Backend
- **Local**: `cd model && pip install -r requirements.txt && uvicorn main:app --port 7860`
- **Production**: Deploy Docker container (see `model/Dockerfile`)
- **Platform**: HuggingFace Spaces or similar (exposes port 7860)
