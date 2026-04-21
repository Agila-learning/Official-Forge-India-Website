# Forge India Connect — Official Website

> A full-stack business platform connecting vendors, candidates, HR, and customers across India.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Payments | Razorpay Checkout.js |
| Email | Nodemailer (Gmail SMTP) |
| Real-time | Socket.IO |

## 📦 Project Structure

```
FIC_Official-website/
├── backend/          # Express API server
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── frontend/         # React application
    └── src/
        ├── components/
        ├── pages/
        └── services/
```

## ⚙️ Setup

### Backend
```bash
cd backend
cp .env.example .env   # Fill in your secrets
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security
- Helmet.js headers
- Rate limiting: 10 req/15min on auth routes, 20 req/15min on payment routes
- JWT authentication on all protected routes
- HMAC Razorpay signature verification

## 💳 Job Consulting Payment Flow
1. Candidate fills consulting form in dashboard
2. Backend creates Razorpay order → returns `order_id` + `key_id`
3. Frontend opens **Razorpay Checkout.js modal** (URL never in DOM)
4. On payment success → backend verifies HMAC signature
5. Inquiry marked **Paid** in DB → confirmation email sent via Gmail SMTP

## 📧 Email
Transactional emails are sent from `forgeindiahr22@gmail.com` using a Gmail App Password.

---
© 2026 Forge India Connect. All rights reserved.
