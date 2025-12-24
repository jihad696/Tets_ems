EMS Frontend (React + Vite)

Quick start

1. Copy `.env.example` to `.env` and set `VITE_API_BASE` to your backend root (e.g. `http://localhost:8000`).

2. Install dependencies and run dev server:

```bash
cd Frontend
npm install
npm run dev
```

Notes
- Login endpoint defaults to `VITE_LOGIN_ENDPOINT` or `/api/auth/login/`. Adjust to match your Django backend.
- API calls use the base URL from `VITE_API_BASE`. Endpoints used:
  - `/companies/`, `/companies/:id/`
  - `/departments/`, `/departments/:id/` (supports `?company=` for filtering)
  - `/employees/`, `/employees/:id/`
- Auth uses token-based header `Authorization: Token <token>` or other token key returned by login. Update `src/context/AuthContext.jsx` if your backend uses JWT (`Bearer`) or session cookies.

What's included
- Routing (Login, Dashboard, Companies, Departments, Employees)
- Auth context with token storage
- Forms with basic validation for employees
- Loading and error handling hooks

Next steps you might want me to do:
- Wire exact backend endpoints/formats if you provide them
- Add richer UI or component library (e.g., Tailwind, MUI)
- Add tests and CI
