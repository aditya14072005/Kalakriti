# 🎨 Kalakriti

A full-stack e-commerce platform for Indian ethnic wear and handcrafted products, built with React, Node.js, Express, and MongoDB.

🌐 **Live:** [kalakriti-rust.vercel.app](https://kalakriti-rust.vercel.app)

## 🖼️ Preview

![Kalakriti Home Page](./Kalakriti%20Home%20Page.png)

## ✨ Features

- 🛍️ Product browsing with filters, search, and pagination
- 🛒 Cart and wishlist management
- 👤 Customer authentication (login/signup) with JWT
- 🧑‍💼 Vendor portal — register, add/manage products and orders
- 🔐 Admin dashboard
- 💳 Payment integration (Razorpay & Stripe)
- ☁️ Image uploads via Cloudinary
- 📦 Order tracking and management
- 👤 User profile page
- 🎬 Intro animation and themed UI

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS, Framer Motion     |
| Backend   | Node.js, Express 5, MongoDB, Mongoose           |
| Auth      | JWT, bcryptjs                                   |
| Payments  | Razorpay, Stripe                                |
| Storage   | Cloudinary                                      |
| Deploy    | Vercel (frontend), Render (backend)             |

## 📁 Project Structure

```
kalakriti/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedIndianBackground.jsx
│   │   │   ├── BestSeller.jsx
│   │   │   ├── CartTotal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── IntroAnimation.jsx
│   │   │   ├── LatestCollection.jsx
│   │   │   ├── LuxuryNavbar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NewsLetterBox.jsx
│   │   │   ├── OurPolicy.jsx
│   │   │   ├── ProductItem.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SectionDivider.jsx
│   │   │   └── Title.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Collection.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── PlaceOrder.jsx
│   │   │   ├── Product.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Vendor.jsx
│   │   │   ├── VendorDashboard.jsx
│   │   │   ├── VendorLogin.jsx
│   │   │   ├── Verify.jsx
│   │   │   └── Wishlist.jsx
│   │   ├── context/
│   │   │   └── ShopContext.jsx
│   │   └── assets/
│   └── .env
├── backend/                   # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── .env
└── package.json               # Root — runs both concurrently
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

```bash
git clone https://github.com/aditya14072005/Kalakriti.git
cd Kalakriti
npm install
cd backend && npm install
cd ../frontend && npm install
```

### Environment Variables

Create `backend/.env`:
```env
PORT=4000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Create `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Run Locally

```bash
# From root — starts both frontend and backend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## ☁️ Deployment

- **Frontend** deployed on [Vercel](https://vercel.com) — set root directory to `frontend` and add env variables in Vercel dashboard
- **Backend** deployed on [Render](https://render.com) — add all `backend/.env` variables in Render environment settings

## 📜 License

MIT
