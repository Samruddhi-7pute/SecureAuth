<!-- # SecureAuth

A minimal, production-style user authentication system. Node.js/Express/MongoDB
Atlas on the backend, plain HTML/CSS/JS on the frontend, styled after
real-world SaaS auth flows (GitHub, Notion, Clerk, Supabase) rather than a
typical tutorial project.

---

## Table of Contents

1. [Pages](#pages)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Security Features](#security-features)
5. [API Endpoints](#api-endpoints)
6. [Local Setup](#local-setup)
7. [Environment Variables](#environment-variables)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Known Limitations](#known-limitations)

---

## Pages

- **Landing** — a single hero section: what the product is, Log in / Sign up
- **Log in** — email, password, "Remember me", "Forgot password?" (UI only —
  see [Known Limitations](#known-limitations))
- **Sign up** — name, email, password, confirm password, live strength meter,
  show/hide toggle, full client + server-side validation
- **Dashboard** *(protected)* — welcome message, name/email, last login time,
  log out
- **Profile** *(protected)* — edit name and email
- **404** — custom not-found page

No extra marketing sections, stat widgets, or filler content — each page does
exactly one job.

## Tech Stack

**Frontend:** HTML5, CSS3 (custom properties, no framework), vanilla JavaScript (ES6+), Inter typeface

**Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit, cookie-parser, morgan, validator

---

## Folder Structure

```
secureauth-saas/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB Atlas connection
│   │   └── env.js              # Centralized, validated env access
│   ├── controllers/
│   │   ├── authController.js   # register / login / logout / me
│   │   └── userController.js   # get/update profile
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification (protect)
│   │   ├── asyncHandler.js     # async try/catch wrapper
│   │   ├── errorMiddleware.js  # centralized error handler + 404
│   │   └── validateMiddleware.js
│   ├── models/
│   │   └── User.js             # schema, bcrypt hashing hook
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validators.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── pages/
│   │   ├── index.html          # Landing
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── dashboard.html      # protected
│   │   ├── profile.html        # protected
│   │   └── 404.html
│   ├── styles/
│   │   ├── main.css            # design tokens, nav, buttons, layout
│   │   ├── auth.css            # forms, strength meter, toggle
│   │   └── dashboard.css       # dashboard / profile / landing / 404
│   ├── scripts/
│   │   ├── api.js              # fetch wrapper — API_BASE_URL lives here
│   │   ├── utils.js            # storage, validation, UI helpers
│   │   ├── main.js             # navbar state, guards, logout
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── dashboard.js
│   │   └── profile.js
│   ├── assets/
│   └── netlify.toml
│
├── .gitignore
└── README.md
```

---

## Security Features

| Feature | Implementation |
|---|---|
| Password hashing | `bcryptjs`, 12 salt rounds, applied in a Mongoose `pre('save')` hook — plaintext is never stored |
| Password policy | Min. 8 characters, uppercase, lowercase, number, symbol — enforced client-side (`utils.js`) **and** server-side (`utils/validators.js`) |
| Session tokens | Signed JWTs delivered via **httpOnly, secure, sameSite** cookies (mitigates XSS token theft), with a Bearer-token fallback |
| Route protection | `protect` middleware verifies the JWT on every request to `/api/users/*`; the frontend re-verifies via `/api/auth/me` before rendering Dashboard/Profile |
| Rate limiting | `express-rate-limit` throttles `/register` and `/login` per IP |
| Security headers | `helmet` sets standard HTTP security headers |
| CORS | Explicit origin allow-list via `CLIENT_ORIGIN`, credentials only for trusted origins |
| Input limits | Request bodies capped at 10kb; all input trimmed and re-validated server-side regardless of what the client sent |
| Generic auth errors | Login failures always return "Invalid email or password" — never reveal whether an email is registered |
| Secrets | Loaded from environment variables only, never hardcoded, `.env` is git-ignored |

---

## API Endpoints

Base URL: `http://localhost:5000/api` locally, or your Render URL in production.

### Auth (`/api/auth`)

| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password, confirmPassword }` |
| POST | `/login` | Public | `{ email, password, rememberMe }` |
| POST | `/logout` | Private | — |
| GET  | `/me` | Private | — |

### Users (`/api/users`)

| Method | Endpoint | Access | Body |
|---|---|---|---|
| GET | `/profile` | Private | — |
| PUT | `/profile` | Private | `{ name, email }` |

### Health

| Method | Endpoint |
|---|---|
| GET | `/api/health` |

**Response shape:**
```json
{ "success": true, "user": { "id": "...", "name": "...", "email": "..." } }
```
```json
{ "success": false, "message": "Human-readable error", "errors": ["..."] }
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A way to serve static files, e.g. the VS Code "Live Server" extension, or
  `npx serve frontend/pages`

**Important:** the frontend must be served over `http://` (not opened directly
as a `file://` path) — see [Troubleshooting](#troubleshooting) if you hit
connection errors.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — generate one with:
  `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `CLIENT_ORIGIN` — the URL your frontend runs on locally, e.g. `http://127.0.0.1:5500`

Start it:
```bash
npm run dev
```
The API runs at `http://localhost:5000`. Confirm it's up: open
`http://localhost:5000/api/health` in a browser — you should see a JSON
response with `"success": true`.

### 2. Frontend

No build step. Serve `frontend/pages` with any static server, for example:

```bash
cd frontend
npx serve pages
```

or use VS Code's Live Server on `frontend/pages/index.html`.

`frontend/scripts/api.js` auto-detects `localhost`/`127.0.0.1` and points at
`http://localhost:5000/api` automatically — no edits needed for local dev.

---

## Environment Variables

See `backend/.env.example` for the full list, including:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` / `JWT_REMEMBER_EXPIRES_IN` | Standard vs. "Remember me" session length |
| `CLIENT_ORIGIN` | Comma-separated allowed frontend origins |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor |
| `AUTH_RATE_LIMIT_WINDOW_MINUTES` / `AUTH_RATE_LIMIT_MAX` | Login/register rate limiting |

---

## Deployment

### Backend → Render

1. Push the repo to GitHub.
2. Create a **New Web Service** on [Render](https://render.com):
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add every variable from `.env.example` under Render's **Environment**
   tab, with real values. Set `NODE_ENV=production`.
4. Deploy and note the resulting URL, e.g. `https://secureauth-api.onrender.com`.

### Frontend → Netlify

1. Open `frontend/scripts/api.js` and set `PRODUCTION_API_URL` to your Render
   URL:
   ```js
   const PRODUCTION_API_URL = 'https://secureauth-api.onrender.com/api';
   ```
2. On [Netlify](https://app.netlify.com), create a **New site from Git**:
   - **Base directory:** `frontend`
   - **Publish directory:** `frontend/pages`
   - **Build command:** *(leave blank)*
3. Deploy and note your Netlify URL, e.g. `https://secureauth.netlify.app`.
4. Back on Render, update `CLIENT_ORIGIN` to include that Netlify URL and
   redeploy the backend so CORS accepts requests from it.

Because the frontend and backend live on different domains, the auth cookie
uses `sameSite: 'none'` and `secure: true` in production — both required for
cross-site cookies over HTTPS. Both URLs must be served over HTTPS.

---

## Troubleshooting

**"Could not reach the API..." / server not reachable**
This means the frontend is either not talking to a running backend, or it
guessed the wrong URL. Check, in order:
1. Is the backend actually running? (`npm run dev` in `/backend`, and
   `http://localhost:5000/api/health` loads in a browser)
2. Are you serving the frontend over `http://localhost` or `http://127.0.0.1`
   (via Live Server / `npx serve`) rather than double-clicking the HTML file?
   Opening a file directly is fine too — `api.js` detects `file://` as local —
   but a real static server is recommended and required once deployed.
3. In production, does `PRODUCTION_API_URL` in `frontend/scripts/api.js`
   exactly match your live Render URL (including `/api` at the end, no
   trailing slash)?
4. Does the backend's `CLIENT_ORIGIN` env var include your exact frontend URL?
   A mismatch here causes CORS to silently block requests.

**CORS errors in the browser console**
`CLIENT_ORIGIN` on the backend must list the frontend's exact origin
(protocol + domain + port). Update it on Render and redeploy.

**Cookies aren't persisting after login (production)**
Both frontend and backend must be served over HTTPS for `sameSite: 'none'`
cookies to work. Netlify and Render both provide HTTPS by default — don't
override it.

---

## Known Limitations

This build intentionally keeps scope tight. Not included:
- Password reset / email delivery (the "Forgot password?" link on the login
  page is UI only, by design per the project brief — clicking it shows a
  message rather than pretending to send an email)
- Email verification on sign-up
- Two-factor authentication
- Account lockout after repeated failed logins (only IP-based rate limiting)

These are reasonable next additions if this moves toward real production use. -->


# SecureAuth – Production-Style Authentication System

A production-inspired user authentication system built using **Node.js**, **Express.js**, **MongoDB Atlas**, and **Vanilla JavaScript**.

Unlike a typical tutorial project, SecureAuth focuses on implementing authentication the way modern web applications do—with secure password hashing, JWT authentication, protected routes, HTTP-only cookies, server-side validation, rate limiting, and security best practices.

---

## Features

- User Registration
- Secure Login & Logout
- JWT Authentication
- Protected Dashboard
- Profile Management
- Password Hashing (bcrypt)
- Password Strength Validation
- Client & Server-side Validation
- HTTP-only Authentication Cookies
- Rate Limiting
- Helmet Security Headers
- CORS Protection
- Responsive UI
- Custom 404 Page

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication & Security
- JWT (jsonwebtoken)
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- Cookie Parser

---

## Project Structure

```
secureauth-saas/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── assets/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   └── netlify.toml
│
├── README.md
└── .gitignore
```

---

## Pages

- Landing Page
- Login
- Sign Up
- Dashboard *(Protected)*
- Profile *(Protected)*
- Custom 404 Page

---

## Security Features

| Feature | Description |
|----------|-------------|
| Password Hashing | bcrypt with configurable salt rounds |
| JWT Authentication | Secure session handling using JSON Web Tokens |
| Protected Routes | Middleware-based route protection |
| HTTP-only Cookies | Prevents client-side access to authentication cookies |
| Password Validation | Strong password policy enforced on both client and server |
| Rate Limiting | Prevents brute-force login attempts |
| Helmet | Adds secure HTTP headers |
| CORS | Allows requests only from trusted frontend origins |
| Generic Authentication Errors | Prevents email enumeration |
| Environment Variables | Secrets stored outside the source code |

---

## API Endpoints

### Authentication

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |
| GET | `/api/auth/me` |

### User

| Method | Endpoint |
|---------|----------|
| GET | `/api/users/profile` |
| PUT | `/api/users/profile` |

### Health Check

| Method | Endpoint |
|---------|----------|
| GET | `/api/health` |

---

# Local Setup

## Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB Atlas Account

Clone the repository

```bash
git clone <repository-url>
cd secureauth-saas
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`.

Then start the backend:

```bash
npm run dev
```

The backend runs at:

```
http://localhost:5000
```

Verify the server:

```
http://localhost:5000/api/health
```

---

### Frontend

Serve the frontend using **VS Code Live Server** or any static HTTP server.

**Do NOT open the HTML files by double-clicking (`file://`).**

Authentication requests rely on HTTP and CORS, so the frontend must be served through a local web server.

---

## Environment Variables

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://127.0.0.1:5500
```

Refer to `.env.example` for the complete list.

---

## Known Limitations

This project intentionally keeps the authentication flow focused and production-inspired.

The following features are intentionally excluded:

- Password Reset
- Email Verification
- Two-Factor Authentication
- Social Login (Google/GitHub)
- Account Lockout

These can be added in future versions.

---

## License

This project is created for educational purposes.

---
