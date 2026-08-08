# MedCare — Hospital Management System (MERN)

Full-stack hospital management platform. Frontend and backend are fully separated.

```
Hospital-Management-System/
  client/                 # React 18 + Vite + JavaScript (JSX only)
    public/
    src/
      assets/
      components/
      config/
      context/
      hooks/
      layouts/
      pages/
      redux/              # Redux Toolkit store (auth + ui slices)
      routes/             # AppRoutes.jsx — full react-router-dom route table
      services/           # axios apiClient, mockApi, socket.io client
      utils/
      App.jsx
      main.jsx
    package.json
  server/                 # Node.js + Express + MongoDB (Mongoose)
    config/               # MongoDB Atlas connection
    controllers/
    middleware/           # auth (JWT), validate, rate limiter, upload, errors
    models/
    routes/
    services/             # seed, email (nodemailer), cloudinary, socket.io
    utils/                # jwt (access + refresh)
    uploads/
    server.js
    package.json
  .env.example
  README.md
```

## Tech stack

**Frontend:** React, JavaScript (.js/.jsx only), Vite, React Router DOM, Redux Toolkit,
Axios, Tailwind CSS, Framer Motion, React Hook Form, React Hot Toast, Recharts,
socket.io-client, lucide-react (icon set used by the existing UI).

**Backend:** Node.js, Express.js, MongoDB Atlas + Mongoose, JWT access + refresh tokens,
bcryptjs, Cloudinary, Nodemailer, Socket.io, Express Validator, Helmet, CORS, Rate Limiting.

No TypeScript, no serverless, no managed BaaS.

## Running locally

Copy `.env.example` to `server/.env` (and, if you want to point the UI at the API,
to `client/.env`) and fill in your MongoDB Atlas URI and secrets.

Backend:

```bash
cd server
npm install
npm run dev          # http://localhost:5000
```

Frontend:

```bash
cd client
npm install
npm run dev          # http://localhost:5173
```

## Data layer switch

`client/src/services/api.js` is the single data entry point:

- `VITE_USE_MOCK_API=true` (default) — the app runs entirely on the bundled
  localStorage mock, so the UI works with no backend running.
- `VITE_USE_MOCK_API=false` — every call goes through Axios to the Express API at
  `VITE_API_URL`, with automatic JWT refresh on 401.

## Seeded accounts (server seed / mock data)

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | admin@medcare.health | Admin@123 |
| Hospital Admin | hadmin@medcare.health | Hospital@123 |
| Doctor | ananya@medcare.health | Doctor@123 |
| Receptionist | reception@medcare.health | Reception@123 |
| Nurse | nurse@medcare.health | Nurse@123 |
| Lab Technician | lab@medcare.health | Lab@123 |
| Pharmacist | pharmacy@medcare.health | Pharmacy@123 |
| Accountant | accounts@medcare.health | Accounts@123 |
| Patient | rahul@example.com | Patient@123 |

## Security

Helmet, CORS allow-list, global + auth-specific rate limiting, express-validator on
auth routes, bcryptjs password hashing, rotating refresh tokens stored per user.
