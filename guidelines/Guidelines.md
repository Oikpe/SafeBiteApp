# SafeBite Development Guidelines

## Project Structure

- **Pages**: One file per route in `src/app/pages/`
- **Components**: Reusable UI pieces in `src/app/components/`
- **Services**: All Supabase/API calls go through `src/app/services/`
- **Context**: Global state lives in `AppContext` and `AuthContext`
- **Types**: All TypeScript interfaces in `src/app/types/`

## Code Style

- Use TypeScript strict mode
- Components use functional style with hooks
- Services export plain objects with async methods
- Use `motion/react` for animations
- CSS uses Tailwind utility classes + custom vanilla CSS

## State Management

- `AppContext`: user profile, allergies, family members, scan history, theme, language
- `AuthContext`: authentication state (user, session, loading)
- Local cache via `storageService` for fast initial renders
- Supabase is the source of truth; local state hydrates on login

## Environment

- Mock mode (`VITE_USE_MOCK_AI=true`): returns sample data, no backend needed
- Real mode (`VITE_USE_MOCK_AI=false`): calls FastAPI backend via `/api` proxy

## Security

- All user inputs sanitized via `utils/sanitize.ts`
- CSP headers defined in `index.html`
- Console statements stripped in production builds
- `.env` must never be committed
