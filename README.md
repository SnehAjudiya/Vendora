# Vendora - Role-driven E-commerce Platform

A full-stack e-commerce platform with role-based access, realtime chat, orders, payments, and subscriptions.

## Tech Stack

- Frontend: React + TypeScript + Redux Toolkit + React Router
- Backend: Node.js + Express + MongoDB (Mongoose)
- Realtime: Socket.IO
- Payments: Stripe
- Mail: Nodemailer (Brevo SMTP relay)

## Key Features

- Authentication with register/login, email verification, and password reset flows
- Role-based access control for Admin, Vendor, and Customer users
- User and profile management with image/file upload support
- Project CRUD workflows
- Product catalog management, cart, checkout, and order history
- Stripe payment checkout and subscription workflows
- Realtime chat using Socket.IO (admin and user chat flows)
- Product export/import support and static export/upload serving

## Project Structure

```text
Vendora/
├── backend/   # Express API + MongoDB + Socket.IO
└── frontend/  # React TypeScript client
```

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB connection string
- Stripe account keys
- SMTP credentials (Brevo)

## Environment Variables (Backend)

Create `backend/.env` with:

```env
PORT= # Port on which the server runs
MONGO_URI= # MongoDB connection string
JWT_SECRET= # Secret key for signing JWT tokens
NODE_ENV= # Application environment (development/production)
SMTP_USER= # SMTP username (Brevo)
SMTP_PASS= # SMTP password (Brevo)
SENDER_EMAIL= # Email address used to send mails
STRIPE_SECRET_KEY= # Stripe secret key for payment processing
```

## Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Run the Project

Start backend (from `backend`):

```bash
npm run dev
```

Start frontend (from `frontend`):

```bash
npm start
```

## Default Local URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- API base URL used by frontend: `http://localhost:5000/api`

## Notes

- CORS and credentials are enabled on the backend.
- Backend serves static directories for `uploads` and `exports`.
- Keep `.env` values private and never commit them.
