# 🎨 Kalakriti - Complete Viva Preparation Guide

**Project Name:** Kalakriti  
**Purpose:** E-commerce marketplace for Indian ethnic wear & handcrafted products  
**Deployed:** https://kalakriti-rust.vercel.app  

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack Explained](#tech-stack-explained)
3. [Architecture](#architecture)
4. [Database Models](#database-models)
5. [API Endpoints](#api-endpoints)
6. [Authentication System](#authentication-system)
7. [Key Features & Workflows](#key-features--workflows)
8. [Important Concepts](#important-concepts)
9. [Common Viva Questions](#common-viva-questions)
10. [Project Structure](#project-structure)

---

## 1. Project Overview

### What is Kalakriti?
A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform that:
- Connects artisans/vendors with customers
- Allows vendors to list handcrafted products
- Enables customers to browse and purchase products
- Provides admin dashboard for moderation
- Integrates payment processing

### Unique Features
- **Vendor Portal**: Craftspeople can register and manage their own shop
- **Admin Approval System**: Products go through approval before listing
- **Multiple Payment Options**: Razorpay & Stripe integration
- **Role-Based Access**: Different features for customer, vendor, admin
- **Cloud Image Hosting**: Uses Cloudinary for product images
- **Animated UI**: Beautiful Indian-themed background & intro animations

---

## 2. Tech Stack Explained

### Frontend Stack
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI library with latest features |
| **Vite** | Fast build tool & dev server (10x faster than Webpack) |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **Framer Motion** | Animation library for smooth transitions |
| **Axios** | HTTP client for API calls |
| **React Router Dom** | Client-side routing |
| **JWT Decode** | Decode JWT tokens on frontend |
| **React Toastify** | Notification system |

### Backend Stack
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime for server-side code |
| **Express 5** | Web framework for building REST APIs |
| **MongoDB** | NoSQL database (flexible document storage) |
| **Mongoose** | ODM (Object Data Modeling) for MongoDB |
| **JWT** | Stateless authentication tokens |
| **bcryptjs** | Password hashing & security |
| **Multer** | Middleware for file uploads |
| **Cloudinary** | Cloud storage for images |
| **Razorpay/Stripe** | Payment processing APIs |

### Why These Choices?
- **React + Vite**: Modern, fast development experience with instant HMR
- **Tailwind CSS**: Rapid UI development without writing custom CSS
- **Node.js + Express**: Non-blocking I/O, perfect for scalable APIs
- **MongoDB**: Flexible schema, great for evolving requirements
- **JWT**: Scalable auth, no server-side session storage needed
- **Cloudinary**: Reliable image storage with automatic optimization

---

## 3. Architecture

### 3-Tier Architecture

```
┌─────────────────────────────────────┐
│    PRESENTATION LAYER (Frontend)    │
│  React Components + Router + State  │
└──────────────┬──────────────────────┘
               │ (API Calls via Axios)
┌──────────────▼──────────────────────┐
│    APPLICATION LAYER (Backend)      │
│  Express Routes → Controllers        │
│  Business Logic + Validation        │
└──────────────┬──────────────────────┘
               │ (Query Language)
┌──────────────▼──────────────────────┐
│    DATA LAYER (Database)            │
│  MongoDB Collections (Users,         │
│  Products, Orders)                  │
└─────────────────────────────────────┘
```

### Data Flow Example: User Registration

```
1. [Frontend] User enters name, email, password and clicks Sign Up
   ↓
2. [Frontend] Form validation (email format, password length 8+)
   ↓
3. [Frontend] Axios POST request to /api/user/register
   ↓
4. [Backend] Route receives request → calls registerUser controller
   ↓
5. [Backend] Validation: Check email format, password length, if email exists
   ↓
6. [Backend] Security: Hash password with bcryptjs (salt: 10)
   ↓
7. [Backend] Database: Create new user in MongoDB
   ↓
8. [Backend] Generate JWT token: jwt.sign({id, role, name}, secret, {expires: 7d})
   ↓
9. [Backend] Send token back to frontend
   ↓
10. [Frontend] Store token in localStorage
   ↓
11. [Frontend] Update global state (ShopContext)
   ↓
12. [Frontend] Redirect to home page
```

---

## 4. Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: 'customer'|'vendor'|'admin', default: 'customer'),
  cartData: Object (sample: {productId: {size: quantity}}),
  addresses: Array (
    {
      id: String,
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String
    }
  ),
  vendorRequest: Object (
    {
      status: String ('pending'|'approved'|'rejected'),
      data: Object (business details),
      submittedAt: Date,
      reason: String (rejection reason if any)
    }
  ),
  timestamps: {createdAt, updatedAt}
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  price: Number (required),
  image: Array (URLs from Cloudinary),
  category: String (required, e.g., 'Sarees', 'Kurtas'),
  subCategory: String (required, e.g., 'Cotton', 'Silk'),
  sizes: Array (e.g., ['S', 'M', 'L', 'XL']),
  bestseller: Boolean (false),
  vendorId: String (ID of vendor who listed it),
  vendorName: String (Name of vendor),
  status: String (enum: 'pending'|'approved'|'rejected', default: 'approved'),
  rejectReason: String (if rejected by admin),
  date: Number (timestamp of creation),
  timestamps: {createdAt, updatedAt}
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  userId: String (Customer ID, required),
  items: Array (
    {
      productId: String,
      name: String,
      price: Number,
      size: String,
      quantity: Number,
      image: String
    }
  ),
  amount: Number (total price),
  address: Object (
    {
      firstName: String,
      lastName: String,
      email: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String
    }
  ),
  status: String (e.g., 'Order Placed', 'Shipped', 'Delivered'),
  paymentMethod: String ('Razorpay'|'Stripe'|'COD'),
  payment: Boolean (false by default, true if paid),
  date: Number (timestamp of order),
  timestamps: {createdAt, updatedAt}
}
```

---

## 5. API Endpoints

### User Routes (/api/user)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---|-----------|
| POST | `/register` | ❌ No | Customer signup |
| POST | `/login` | ❌ No | Login for all roles |
| POST | `/register-vendor` | ❌ No | Vendor signup |
| GET | `/profile` | ✅ Yes | Get logged-in user's profile |
| POST | `/update-profile` | ✅ Yes | Update profile name |
| POST | `/save-address` | ✅ Yes | Add shipping address |
| POST | `/delete-address` | ✅ Yes | Delete shipping address |
| POST | `/vendor-request` | ✅ Yes | Apply for vendor role |
| POST | `/change-password` | ✅ Yes | Change password |

**Example Request:**
```javascript
// Register
POST /api/user/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}

// Response
{
  "success": true,
  "token": "eyJhbGc...", // JWT token
  "role": "customer"
}
```

### Product Routes (/api/product)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/list` | ❌ No | Get all approved products |
| GET | `/single/:id` | ❌ No | Get product details |
| POST | `/add` | ✅ Vendor | Add product (direct listing) |
| POST | `/submit` | ✅ Vendor | Submit for approval |
| GET | `/my-products` | ✅ Vendor | Get vendor's own products |
| GET | `/pending` | ✅ Vendor | Get pending approval products |
| GET | `/rejected` | ✅ Vendor | Get rejected products |
| POST | `/approve` | ✅ Admin | Approve product |
| POST | `/reject` | ✅ Admin | Reject product |
| DELETE | `/remove` | ✅ Vendor | Delete product |

**Example: Add Product**
```javascript
POST /api/product/add
Headers: { token: "eyJhbGc..." }
FormData:
  - name: "Cotton Saree"
  - description: "Beautiful handwoven..."
  - price: 2999
  - category: "Sarees"
  - subCategory: "Cotton"
  - sizes: ["S", "M", "L"]
  - image1: <file>
  - image2: <file>
  - image3: <file>
  - image4: <file>
```

### Cart Routes (/api/cart)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/add` | Add item to cart |
| POST | `/update` | Update quantity |
| POST | `/get` | Get cart items |

### Order Routes (/api/order)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/place` | Place new order |
| POST | `/verify` | Verify Razorpay payment |
| GET | `/userorders` | Get user's orders |
| GET | `/list` | Get all orders (admin) |

### Admin Routes (/api/admin)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/orders` | Get all orders |
| POST | `/status` | Update order status |
| GET | `/stats` | Dashboard statistics |

---

## 6. Authentication System

### How JWT Works

**JWT Structure:**
```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  .eyJpZCI6IjY1YjI...", "role": "customer", "name": "John"}
  .SflKxw...
```

**Payload Contents:**
```javascript
{
  id: "65b2a3c8e7f0d1a2b3c4d5e6",  // MongoDB User ID
  role: "customer",                 // 'customer' | 'vendor' | 'admin'
  name: "John Doe",                 // User's name
  iat: 1706345600,                  // Issued at timestamp
  exp: 1707209600                   // Expires timestamp (7 days)
}
```

### Authentication Flow

**Step 1: User Logs In**
```javascript
// Frontend sends credentials
POST /api/user/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Backend:
// 1. Find user by email in MongoDB
// 2. Compare password using bcrypt.compare()
// 3. If match, generate JWT token
// 4. Send token to frontend

// Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "role": "customer"
}
```

**Step 2: Frontend Stores Token**
```javascript
// Store in localStorage
localStorage.setItem('token', receivedToken);

// Token automatically added to all API requests in headers
axios.post('/api/cart/add', data, {
  headers: { token: localStorage.getItem('token') }
});
```

**Step 3: Backend Verifies Token (Middleware)**
```javascript
// Middleware: authUser
const authUser = (req, res, next) => {
  const { token } = req.headers;
  
  if (!token)
    return res.json({ success: false, message: 'Login required' });
  
  try {
    // Verify token with secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Extract user info from token
    req.userId = decoded.id;      // Attach to request
    req.role = decoded.role;
    
    next();  // Allow request to proceed
  } catch (error) {
    return res.json({ success: false, message: 'Invalid token' });
  }
};
```

### Role-Based Access Control

**Three Middleware Levels:**

```javascript
// Level 1: Any authenticated user
authUser → Checks if token exists & valid

// Level 2: Vendor or Admin
authVendor → Checks role is 'vendor' OR 'admin'

// Level 3: Admin only
authAdmin → Checks role is 'admin'
```

**Implementation on Frontend:**
```javascript
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

function ProtectedPage() {
  const { role, token } = useContext(ShopContext);
  
  if (!token) return <Navigate to="/login" />;
  
  if (role === 'customer') {
    return <CustomerView />;
  } else if (role === 'vendor') {
    return <VendorView />;
  } else if (role === 'admin') {
    return <AdminView />;
  }
}
```

### Password Security

**Hashing Process:**
```javascript
// During registration/password change
const hashed = await bcryptjs.hash(password, 10);
// 'password123' becomes something like:
// $2a$10$N9qf8Cx...KvChO1M (irreversible)

// During login
const match = await bcryptjs.compare(providedPassword, storedHash);
// Returns true if password matches, false otherwise
```

**Why bcryptjs?**
- One-way hashing (cannot decrypt back to original)
- Includes salt (random data) to prevent rainbow table attacks
- Slow on purpose (delays brute force attacks)
- Standard security practice

---

## 7. Key Features & Workflows

### Feature 1: User Registration & Login

**Types of Users:**
1. **Customer** - Browse and buy products
2. **Vendor** - Register and sell products
3. **Admin** - Moderate and manage platform (created manually in DB)

**Customer Registration Flow:**
```
Sign Up Form
    ↓
Validation (email format, password length 8+)
    ↓
Check if email exists in DB
    ↓
Hash password using bcryptjs
    ↓
Create user with role: 'customer'
    ↓
Generate JWT token
    ↓
Store in localStorage
    ↓
Redirect to Home
```

### Feature 2: Product Listing (Vendor)

**3 Ways to List Products:**

**Method 1: Direct Listing** (appears immediately)
```
Vendor uploads 4 images + details
    ↓
POST /api/product/add
    ↓
Multer processes images
    ↓
Images uploaded to Cloudinary
    ↓
Product saved to DB with status: 'approved'
    ↓
Visible immediately in /collection
```

**Method 2: Submit for Approval**
```
POST /api/product/submit
    ↓
Product saved with status: 'pending'
    ↓
In admin's approval queue
    ↓
Admin reviews
    ↓
If YES: status → 'approved' (now visible)
If NO: status → 'rejected' + reason shown to vendor
    ↓
Vendor can edit and resubmit
```

**Method 3: Edit Rejected Product**
```
Vendor sees rejection reason
    ↓
Modifies product
    ↓
Resubmits
    ↓
Back to admin approval queue
```

### Feature 3: Shopping Cart

**Cart Data Structure:**
```javascript
// In database (User model)
cartData: {
  "product_id_1": { "S": 2, "M": 1 },  // 2 small, 1 medium
  "product_id_2": { "L": 3 },            // 3 large
  "product_id_3": { "XL": 1 }            // 1 extra large
}

// In frontend state (ShopContext)
cartItems: {
  "product_id_1": { "S": 2, "M": 1 },
  "product_id_2": { "L": 3 },
  "product_id_3": { "XL": 1 }
}
```

**Add to Cart Flow:**
```
1. Customer selects size on product page
2. Clicks "Add to Cart"
3. Check if logged in:
   - If NO: Show toast, redirect to login
   - If YES: Continue
4. Validate size selected
5. Update cartItems in ShopContext
6. Send POST /api/cart/add to backend
7. Backend updates cartData in user record
8. Cart persists across page reloads
```

### Feature 4: Checkout & Payment

**Order Placement Flow:**
```
Review Cart
    ↓
Fill Delivery Address
    ↓
Select Payment Method (Razorpay/Stripe)
    ↓
Place Order
    ↓
Create order in MongoDB:
{
  userId: current_user_id,
  items: [...cart items],
  amount: total_price,
  address: delivery_address,
  status: 'Order Placed',
  payment: false,
  date: timestamp
}
    ↓
Redirect to Payment Gateway
    ↓
User completes payment
    ↓
Payment verified via /api/order/verify
    ↓
Update order: payment = true
    ↓
Send confirmation email
    ↓
Customer can track in /orders
```

**Razorpay Integration:**
```javascript
// Backend creates order
const razorpayOrder = await razorpay.orders.create({
  amount: totalPrice * 100,  // in paise
  currency: 'INR',
  receipt: orderId
});

// Frontend opens Razorpay checkout
razorpay_options = {
  key: 'your_key_id',
  amount: totalPrice * 100,
  order_id: razorpayOrder.id,
  // ... payment details
  handler: function(response) {
    // Verify signature
    verify payment via /api/order/verify
  }
};
```

### Feature 5: Admin Dashboard

**Admin Capabilities:**
```
1. Approve/Reject Products
   - See pending products
   - Review details
   - Accept or reject with reason

2. Manage Orders
   - View all orders
   - Update status (Order Placed → Shipped → Delivered)
   - Track payment status

3. View Statistics
   - Total orders
   - Revenue
   - Top vendors
   - Product approval stats

4. Manage Vendors
   - Review vendor applications
   - Approve/reject vendor requests
   - Change user role to 'vendor'
```

---

## 8. Important Concepts

### Concept 1: Context API (State Management)
**What is ShopContext?**
- Global state management without Redux
- Stores user info, products, cart, wishlist
- Accessible from any component
- Reduces prop drilling

**Usage:**
```javascript
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

function MyComponent() {
  const { products, cartItems, token, role, addToCart } = useContext(ShopContext);
  
  // Can now use all these values
}
```

### Concept 2: Protected Routes
**Purpose:** Prevent unauthorized access to pages

```javascript
function ProtectedRoute({ allowedRoles, children }) {
  const { token, role } = useContext(ShopContext);
  
  if (!token) return <Navigate to="/login" />;
  
  if (!allowedRoles.includes(role))
    return <Navigate to="/" />;
  
  return children;
}

// Usage:
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### Concept 3: Middleware
**What are middleware?**
- Functions that run before a route handler
- Can modify request/response
- Can grant or deny access

```javascript
// Authentication middleware
app.post('/api/order/place', authUser, (req, res) => {
  // If token is invalid, authUser returns error
  // If valid, req.userId and req.role are set
  // Route handler executes
})
```

### Concept 4: Multer (File Upload)
**Purpose:** Handle file uploads from frontend

```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware setup
app.post('/upload', upload.single('image'), (req, res) => {
  // req.file contains uploaded file
  // Send to Cloudinary
});
```

### Concept 5: Cloudinary Integration
**Why cloud storage?**
- Server disk space unlimited
- Image optimization and resizing
- CDN delivery (fast load times)
- Can delete or modify images easily

**Flow:**
```javascript
// 1. Receive file from multer
const file = req.file;

// 2. Upload to Cloudinary
const result = await cloudinary.uploader.upload(file);

// 3. Get cloud URL
const imageUrl = result.secure_url;

// 4. Store URL in MongoDB
product.image.push(imageUrl);
```

### Concept 6: Mongoose Schema Validation
**Purpose:** Enforce data consistency

```javascript
const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['A', 'B', 'C'] },
  status: { type: String, default: 'pending' }
});

// Without this validation, MongoDB would accept:
{ name: '', price: 'invalid', category: 'anything' }
```

---

## 9. Common Viva Questions

### Q1: What is this project about?
**A:** Kalakriti is an e-commerce platform for Indian ethnic wear. It connects artisans (vendors) with customers. Vendors can register and list their handmade products. Customers can browse, add to cart, and purchase. Admin moderates product listings ensuring quality. It's essentially an Etsy-like marketplace for Indian crafts.

### Q2: Why did you choose MERN stack?
**A:** 
- React is industry standard with huge ecosystem
- Node.js enables full JavaScript development (same language frontend & backend)
- Express is lightweight yet powerful
- MongoDB offers flexible schema (products have varying attributes)
- All modern tools with fast development cycle

### Q3: Explain the authentication system
**A:** Users register with email and password. Password is hashed using bcryptjs (irreversible). On login, we verify password and generate a JWT token containing user ID, role, and name. Token is sent to frontend and stored in localStorage. For protected routes, token is included in request header. Backend middleware verifies token signature and extracts user info. If invalid, request is rejected. This allows stateless authentication across multiple servers.

### Q4: How are products moderated?
**A:** Products go through an approval system. Vendors can either:
1. Add directly (for existing vendors) - appears immediately
2. Submit for approval - goes to pending queue
Admin reviews and either approves (visible to customers) or rejects (with reason). Vendor can then edit and resubmit. This ensures only quality products are listed.

### Q5: How is cart data managed?
**A:** Cart data stored in two places:
1. Frontend: ShopContext maintains cartItems object for instant UI updates
2. Backend: User's cartData field in MongoDB for persistence
When user adds/updates items, both frontend and backend are updated. This ensures cart persists across sessions and devices.

### Q6: Why use JWT instead of sessions?
**A:** 
- Stateless: Server doesn't maintain session storage → scalable
- Self-contained: Token has user info, no DB lookup per request
- Can verify signature without contacting DB
- Works great for distributed systems and mobile apps

### Q7: What's the purpose of role-based access control?
**A:** Different user types have different permissions:
- Customer: Can browse, cart, order, wishlist
- Vendor: Can add products, view sales, manage inventory
- Admin: Can approve products, manage orders, view stats
We implement this via middleware that checks JWT role and route-level checks, preventing unauthorized access to sensitive pages/endpoints.

### Q8: How is image handling done?
**A:** Users upload images via form. Multer middleware receives files in memory. Files sent to Cloudinary cloud service. Cloudinary returns secure URLs. We store URLs in MongoDB (not images themselves). This approach:
- Saves server disk space
- Provides image optimization
- Offers CDN delivery for fast loading
- Images can be modified/deleted without DB changes

### Q9: Explain the checkout flow
**A:** 
1. Customer reviews cart and clicks checkout
2. Fills delivery address
3. Selects payment method (Razorpay/Stripe)
4. Order created in DB with status "Order Placed"
5. Redirected to payment gateway
6. Payment processed and verified
7. Order marked as paid
8. Customer can track in orders page
Vendor gets notified of sale through dashboard.

### Q10: What are the scalability concerns?
**A:** Current concerns:
1. Entire product list loaded into memory (ShopContext)
2. No pagination on backend
3. All user carts stored in single user document
4. No caching layer

Solutions:
- Implement API-level pagination
- Add Redis caching for frequently accessed products
- Separate cart collection from user
- Database indexing on frequently queried fields

### Q11: How would you add search functionality?
**A:** 
Frontend: Filter products by name/description from ShopContext
Backend: Add search API endpoint that queries MongoDB using regex
Example: `db.products.find({ name: /search_query/i })`
With indexing on name/description for performance.

### Q12: Why use Vite instead of Create React App?
**A:** 
- Vite uses native ES modules (faster dev server startup)
- Instant Hot Module Replacement
- CRA uses Webpack which bundles everything on change
- Build performance ~100x faster for large projects
- Modern tooling designed for 2024+

### Q13: What's the purpose of Framer Motion?
**A:** Animation library for smooth, interactive animations:
- Hero section transitions
- Intro animation on app load
- Product card animations on hover
- Smooth page transitions
- Makes UI feel polished and professional

### Q14: How would you implement product reviews?
**A:** 
Schema addition:
```javascript
review: { userID, rating: 1-5, text, date }
```
Endpoint: POST /api/product/:id/review
Only allow reviews from users who bought the product
Display average rating on product page
Show individual reviews with username and date

### Q15: What security measures are in place?
**A:** 
- Passwords hashed with bcrypt (one-way)
- JWT tokens expire after 7 days
- Role-based access control on backend
- Middleware validates all protected requests
- Mongoose schema validation prevents invalid data
- CORS configured to allow only frontend URLs
- Environment variables for sensitive data
- Never expose JWT secret or DB credentials

---

## 10. Project Structure

```
kalakriti/
│
├── frontend/                          # React + Vite app
│   ├── src/
│   │   ├── main.jsx                   # Entry point
│   │   ├── App.jsx                    # Main router & layout
│   │   ├── index.css                  # Global styles
│   │   │
│   │   ├── components/                # Reusable components
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   ├── Footer.jsx             # Footer section
│   │   │   ├── ProductItem.jsx        # Product card
│   │   │   ├── CartTotal.jsx          # Cart summary
│   │   │   ├── ProtectedRoute.jsx     # Route protection
│   │   │   └── ... (more components)
│   │   │
│   │   ├── pages/                     # Page components
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── Collection.jsx         # Product listing
│   │   │   ├── Cart.jsx               # Shopping cart
│   │   │   ├── PlaceOrder.jsx         # Checkout page
│   │   │   ├── AdminDashboard.jsx     # Admin panel
│   │   │   ├── VendorDashboard.jsx    # Vendor panel
│   │   │   └── ... (more pages)
│   │   │
│   │   ├── context/
│   │   │   └── ShopContext.jsx        # Global state management
│   │   │
│   │   └── assets/
│   │       └── assets.js              # Static product data
│   │
│   ├── package.json                   # Dependencies
│   ├── vite.config.js                 # Vite configuration
│   └── tailwind.config.js             # Tailwind setup
│
├── backend/                           # Express API server
│   ├── server.js                      # Express app setup
│   │
│   ├── routes/                        # API endpoints
│   │   ├── userRoutes.js              # /api/user/*
│   │   ├── productRoutes.js           # /api/product/*
│   │   ├── cartRoutes.js              # /api/cart/*
│   │   ├── orderRoutes.js             # /api/order/*
│   │   └── adminRoutes.js             # /api/admin/*
│   │
│   ├── controllers/                   # Business logic
│   │   ├── userController.js          # User operations
│   │   ├── productController.js       # Product operations
│   │   ├── cartController.js          # Cart operations
│   │   ├── orderController.js         # Order operations
│   │   └── adminController.js         # Admin operations
│   │
│   ├── models/                        # Database schemas
│   │   ├── userModel.js               # User schema
│   │   ├── productModel.js            # Product schema
│   │   └── orderModel.js              # Order schema
│   │
│   ├── middleware/                    # Middleware functions
│   │   ├── authMiddleware.js          # JWT authentication
│   │   └── multer.js                  # File upload handling
│   │
│   ├── config/                        # Configuration files
│   │   ├── db.js                      # MongoDB connection
│   │   └── cloudinary.js              # Cloudinary setup
│   │
│   ├── package.json                   # Dependencies
│   ├── server.js                      # Server entry point
│   └── .env                           # Environment variables
│
├── package.json                       # Root package.json
└── README.md                          # Project documentation
```

---

## 11. Environment Variables Needed

### Backend (.env)
```
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kalakriti
JWT_SECRET=your_super_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
STRIPE_KEY=your_stripe_key
STRIPE_SECRET=your_stripe_secret
FRONTEND_URL=https://kalakriti-rust.vercel.app
```

### Frontend (.env)
```
VITE_BACKEND_URL=https://your-backend-url.render.com
```

---

## 12. Running the Project

### Start Development
```bash
# Install dependencies
npm install
cd frontend && npm install
cd backend && npm install

# Run both frontend & backend concurrently
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:4000
```

### Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

---

## 13. Tips for Your Viva

### DO:
✅ Understand every file in the project
✅ Be ready to explain the complete data flow
✅ Know why each technology was chosen
✅ Practice talking about the code out loud
✅ Understand the database schema deeply
✅ Be ready to discuss scalability & improvements
✅ Know how authentication works step-by-step

### DON'T:
❌ Memorize code - understand concepts
❌ Claim features that don't exist
❌ Get confused between frontend and backend concepts
❌ Forget about the role-based access control
❌ Underestimate the importance of security
❌ Claim you understand something if you don't

### Likely Viva Questions:
1. "Walk me through the entire signup process"
2. "How does a vendor add a product?"
3. "Explain the JWT authentication in detail"
4. "What happens when a customer places an order?"
5. "Why use MongoDB instead of SQL?"
6. "How would you scale this application?"
7. "Explain role-based access control"
8. "What is Context API and why use it?"
9. "How are images handled in this project?"
10. "What are the security measures implemented?"

---

## 14. Additional Resources

### Learn More:
- JWT: https://jwt.io
- Mongoose: https://mongoosejs.com
- Express: https://expressjs.com
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com

### Tools to Explore:
- Postman (Test APIs)
- MongoDB Atlas (Cloud database console)
- Cloudinary Dashboard (Image management)

---

Good luck with your viva! 🎓

Remember: They want to see that you understand the concepts, not just memorized code. Be confident, explain clearly, and ask clarifications if needed.

