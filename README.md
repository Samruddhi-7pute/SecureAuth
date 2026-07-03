# 🔐 SecureAuth

A production-inspired authentication system built with **Node.js, Express.js, MongoDB Atlas, JWT, and Vanilla JavaScript**.

SecureAuth demonstrates the core components of a modern authentication workflow, including password hashing, JWT-based authentication, protected routes, HTTP-only cookies, input validation, rate limiting, and security middleware. The project is designed to reflect common backend security practices while maintaining a clean and modular architecture.

---

## 🚀 Live Demo

**Frontend**  
https://secureauth1.netlify.app

**Backend Health Check**  
https://secureauth-awip.onrender.com/api/health

> Authentication endpoints are intended to be accessed through the frontend application.

---

## ✨ Features

- User registration and authentication
- JWT-based session management
- Protected routes
- Secure password hashing with bcrypt
- Client-side and server-side validation
- HTTP-only authentication cookies
- Rate limiting for authentication endpoints
- Helmet security headers
- CORS configuration
- Responsive user interface
- Custom 404 page

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (ES6)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Security
- JWT
- bcryptjs
- Helmet
- CORS
- express-rate-limit
- Cookie Parser

---

## 📁 Project Structure

```text
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
│   ├── scripts/
│   ├── styles/
│   ├── pages/
│   └── netlify.toml
│
├── README.md
└── .gitignore
```

---

## 📄 Application Pages

- Landing Page
- Login
- Sign Up
- Dashboard *(Protected)*
- Profile *(Protected)*
- Custom 404 Page

---

## 🛡 Security Highlights

| Feature | Description |
|----------|-------------|
| Password Hashing | Passwords are hashed using bcrypt before storage |
| JWT Authentication | Stateless authentication using JSON Web Tokens |
| Protected Routes | Middleware-based route protection |
| HTTP-only Cookies | Authentication cookies are inaccessible to client-side JavaScript |
| Input Validation | Client-side and server-side validation |
| Rate Limiting | Protection against brute-force authentication attempts |
| Helmet | Adds security-related HTTP headers |
| CORS | Restricts API access to trusted frontend origins |
| Environment Variables | Sensitive configuration is stored outside the source code |

---

## 📡 API Reference

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

## 💻 Local Development

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB Atlas account

Clone the repository:

```bash
git clone <repository-url>
cd secureauth-saas
```

### Backend

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example`, then start the development server:

```bash
npm run dev
```

The backend runs at:

```
http://localhost:5000
```

Health Check:

```
http://localhost:5000/api/health
```

### Frontend

Serve the frontend using **VS Code Live Server** or any static HTTP server.

> Do **not** open HTML files directly (`file://`). Authentication requests require the frontend to be served over HTTP.

---

## ⚙ Environment Variables

Example configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://127.0.0.1:5500
```

Refer to **`.env.example`** for the complete configuration.

---

## 📌 Future Enhancements

- Password reset via email
- Email verification
- Two-factor authentication (2FA)
- Google/GitHub OAuth
- Account lockout after repeated failed login attempts

---

## 📄 License

This project is intended for educational and portfolio purposes.
