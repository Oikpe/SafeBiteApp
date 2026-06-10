# SafeBite — Food Allergy Scanner

SafeBite is a mobile-first web application that helps users with food allergies safely navigate restaurant menus. It uses AI-powered image analysis to scan menus, detect allergens, and provide personalized safety recommendations.

## Features

- **Menu Scanning** — Take a photo of a restaurant menu and get instant allergen analysis
- **Food Search** — Search any food item by name for allergen information
- **Personalized Profiles** — Set your specific allergies for tailored risk assessments
- **Family Mode** — Track allergies for multiple family members simultaneously
- **Scan History** — Review past scans with persistent cloud storage
- **Bilingual Support** — Full English and Indonesian (Bahasa Indonesia) localization
- **Dark Mode** — System-adaptive theme with manual toggle
- **Responsive UI** — Optimized for mobile with native-like page transitions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 · TypeScript · Vite |
| Styling | Tailwind CSS 4 · Vanilla CSS |
| Animation | motion/react (Framer Motion v12) |
| Backend | Supabase (Auth, PostgreSQL, RLS) |
| AI Backend | FastAPI · DocTR (OCR) · HuggingFace Inference API |
| AI Models | Qwen2.5-Coder-32B-Instruct (primary) · Llama-3.1-8B-Instruct (fallback) |
| State | React Context API (AppContext + AuthContext) |
| Routing | react-router v7 (code-split with lazy loading) |
| i18n | Custom translation module (EN/ID) |
| Mobile | Capacitor (Android/iOS) |

## Project Structure

```
SafeBiteApp/
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AppContext (state) + AuthContext (auth)
│   │   ├── pages/          # Route-level page components
│   │   ├── services/       # Supabase & API service modules
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Helpers, sanitization, theme tokens
│   │   ├── i18n/           # Translation strings (EN/ID)
│   │   ├── constants/      # Static data (allergy list, colors)
│   │   └── routes.tsx      # Route configuration
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── model/
│   ├── main.py             # FastAPI server (OCR + AI analysis)
│   └── requirements.txt    # Python dependencies
├── index.html              # HTML entry with CSP headers
├── vite.config.ts          # Vite build configuration
└── capacitor.config.ts     # Capacitor mobile config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Python 3.10+ (for AI backend)

### Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment template and fill in your keys
cp .env.example .env

# Start development server
npm run dev
```

### AI Backend Setup

```bash
cd model

# Create virtual environment
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example` for the template):

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `VITE_USE_MOCK_AI` | Set to `"false"` to use the real AI backend |
| `VITE_MODEL_API_URL` | AI backend URL (default: `/api` via Vite proxy) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (backend only) |
| `HF_TOKEN` | HuggingFace API token (backend only) |

> **Note:** Never commit the `.env` file. It contains sensitive API keys.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed breakdown of the system architecture, data flow, and AI pipeline.

## License

This project is developed as part of an academic capstone project.