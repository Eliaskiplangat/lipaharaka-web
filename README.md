# LipaHaraka Web

This is the React + Vite frontend for the LipaHaraka SME invoice financing platform. It is built for a workflow-heavy finance app where SME owners manage invoices, request cash advances, and complete KYC, while admin staff review businesses and disbursement risk.

## Stack

- React 19.1.0
- Vite 5.4.6
- React Router DOM 6.26.2
- Tailwind CSS 3.4.10
- Axios 1.7.7
- ESLint 9 + React hooks plugin
- No Redux, no external UI kit, and no icon library; shared icons are custom inline SVGs and the design system is kept intentionally lightweight.

## What this app does

- Authenticated SME flows: dashboard, invoices, businesses, cash advances, settings
- Public buyer payment flow: `/pay/:token` for invoice settlement via M-Pesa STK
- Admin flows: overview KPIs, KYC review, business management
- Mobile-first ledger styling tuned for low-end Android devices and an SME audience

## Local development

```bash
cd lipaharaka-web
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8080` via `vite.config.js`, so the Spring Boot API must be running locally before the frontend is used in dev mode.

For a deployed API, set the production origin in `.env` or `.env.local`:

```bash
VITE_API_BASE_URL=https://api.your-domain.com
```

## App structure

```text
src/
├── api/          API wrappers: auth, business, invoices, payments, advances, admin
├── components/   Shared UI: Layout, ProtectedRoute, Spinner, ErrorBanner, Money, icons
├── context/      AuthContext for JWT/session handling and role-based access
├── pages/        Login, Register, Dashboard, Business, Settings, Invoice flows, advance flows, admin screens
├── styles/       Tailwind entry and app-wide design tokens
├── App.jsx       Route tree and access guards
├── main.jsx      BrowserRouter bootstrap
└── ...
```

## Security and UX expectations

- JWTs are stored in sessionStorage instead of localStorage to reduce exposure to long-lived browser persistence.
- Protected routes block unauthenticated access and enforce the admin role when required.
- Axios centrally unwraps backend error payloads and clears the session when a 401 is returned.
- The UI is mobile-first, built around narrow screens, large tap targets, and minimal dependency weight for smoother performance on modest devices.

## Design system

- Color palette: deep teal brand (`ink`), gold accent for financial emphasis, warm paper background, danger/success states for risk and payment outcomes
- Typography: serif for ledger numbers and KPI values; sans-serif for general UI copy
- Layout: flat cards, thin borders, and minimal ornament to keep the app readable and calm on small screens

## Related backend contract notes

The frontend is designed around the following backend endpoints:

- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `GET /api/v1/businesses/me`
- `POST /api/v1/businesses/me/kyc-documents`
- `GET /api/v1/invoices`
- `POST /api/v1/invoices`
- `GET /api/v1/invoices/public/{token}`
- `POST /api/v1/payments/mpesa/invoices/{token}/initiate`
- `GET /api/v1/advances/quote`
- `POST /api/v1/advances`
- `GET /api/v1/admin/kpis`
- `GET /api/v1/admin/kyc/pending`
- `POST /api/v1/admin/kyc/{id}/review`

## Notes

- KYC document submission currently uses a URL field because the backend accepts `fileUrl` rather than a direct upload object, which keeps the app simple without an object storage layer.
- Errors are surfaced inline next to the action that triggered them instead of using a global toast system, keeping the UI lightweight and focused.
