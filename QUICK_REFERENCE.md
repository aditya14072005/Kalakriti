# 📚 Quick Reference - Viva Key Points

## What is Kalakriti? (1 sentence)
An e-commerce platform connecting Indian artisans with customers to buy/sell handcrafted ethnic wear.

---

## Technology Stack (Remember These)

| Part | Technology | Why |
|------|-----------|-----|
| Frontend UI | React 19 + Vite | Modern, fast, component-based |
| Styling | Tailwind CSS | Rapid development, utility-first |
| Frontend State | Context API | Global state without Redux |
| Backend | Node.js + Express | JavaScript across stack, lightweight |
| Database | MongoDB | Flexible schema for varying products |
| Auth | JWT + bcryptjs | Stateless, scalable, secure |
| Images | Cloudinary | Cloud storage, optimization, CDN |
| Payments | Razorpay/Stripe | Industry standard payment gateways |

---

## Key Concepts (Must Know)

### 1. JWT Authentication
- User logs in → password hashed & verified
- Server generates JWT token with {id, role, name}
- Token stored in frontend localStorage
- Token sent in request headers for protected routes
- Backend middleware verifies token expiry & signature
- If valid → request proceeds, if invalid → rejected

### 2. Role-Based Access Control (3 types)
```
CUSTOMER → Browse, Cart, Order, Wishlist
VENDOR → Add products, View dashboard
ADMIN → Approve products, Manage orders, View stats
```

### 3. Product Approval System
```
Vendor adds product
    ↓
Can be: Direct (approved) OR Submit (pending)
    ↓
If pending: Admin reviews
    ↓
Admin: Approve (visible) OR Reject (reason given)
    ↓
Vendor: Can edit & resubmit if rejected
```

### 4. Shopping Workflow
```
Browse → Add to Cart → Checkout → Fill Address 
→ Select Payment → Payment Gateway → Verify 
→ Order Created → Track Order
```

### 5. Image Handling
```
User uploads → Multer receives → Cloudinary stores 
→ URL returned → DB stores URL (not file) 
→ Frontend displays from Cloudinary
```

---

## Database Models (3 Main)

### USER
```
- name, email, password (hashed)
- role (customer/vendor/admin)
- cartData { productId: {size: qty} }
- addresses [] (for shipping)
- vendorRequest (status pending/approved/rejected)
```

### PRODUCT
```
- name, description, price
- image [] (URLs from Cloudinary)
- category, subCategory, sizes
- vendorId, vendorName
- status (pending/approved/rejected)
- rejectReason (if rejected)
```

### ORDER
```
- userId, items [], amount
- address (full shipping details)
- status, paymentMethod
- payment (boolean: paid or not)
- date (timestamp)
```

---

## API Endpoints (Top 10)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/user/register | POST | Customer signup |
| /api/user/login | POST | Login (any role) |
| /api/user/register-vendor | POST | Vendor signup |
| /api/product/list | GET | Get all approved products |
| /api/product/add | POST | Vendor adds product |
| /api/product/approve | POST | Admin approves |
| /api/product/reject | POST | Admin rejects |
| /api/cart/add | POST | Add to cart |
| /api/order/place | POST | Place order |
| /api/order/verify | POST | Verify payment |

---

## Common Viva Question Answers

### Q: How does authentication work?
A: User enters credentials → Backend validates email exists & password matches via bcryptjs → JWT token generated with user ID, role, name → Sent to frontend → Stored in localStorage → For protected routes, token included in request header → Backend middleware verifies token signature & extracts user info → If invalid, request rejected with 401/403 error.

### Q: Why JWT instead of sessions?
A: JWT is stateless (server needs no session storage), scalable (works across multiple servers), self-contained (token has user info, no DB lookup needed), and great for mobile/distributed systems.

### Q: How does product approval work?
A: Vendors add products either directly (immediate approval) or submit for approval. Admin sees pending products and either approves (becomes visible) or rejects with reason. Vendor can then edit and resubmit. This ensures quality control.

### Q: Explain cart functionality
A: Cart stored in ShopContext (frontend state) and MongoDB (backend). When user adds item, both updated. Cart persists via token identification. Cart data structure: {productId: {size: quantity}}

### Q: Why Cloudinary for images?
A: Saves server disk space, provides CDN for fast loading, offers image optimization/resizing, allows deletion without DB modification, and is industry-standard for scalable image hosting.

### Q: How does checkout work?
A: User reviews cart → fills address → selects payment method → order created in DB → redirected to Razorpay/Stripe → payment processed → /verify endpoint confirms → order marked paid → customer can track.

### Q: What are 3 middleware functions?
A: authUser (any authenticated user), authVendor (vendor or admin), authAdmin (admin only). They verify JWT and check role before allowing request.

### Q: Why React + Vite?
A: React is industry standard with huge ecosystem. Vite is much faster than webpack (100x faster builds, instant HMR), ESM-based, perfect for modern development.

### Q: What security measures exist?
A: Passwords hashed with bcryptjs, JWT expires after 7 days, role-based access control, middleware validates all requests, Mongoose schema validation, CORS configured, sensitive data in environment variables.

### Q: How would you scale this?
A: Implement API pagination, add Redis caching, database indexing, separate cart collection, separate image optimization service, load balancing, database sharding.

---

## Study Tips for Viva

1. **Understand Complete Flow** - Draw and explain full user journey from signup to order
2. **Know Why Choices** - Be ready to explain why each technology was chosen
3. **Security Matters** - They will ask about password hashing, JWT, role checks
4. **Test API Manually** - Use Postman to see request/response to understand flow
5. **Explain Code Aloud** - Read a controller function and explain what each line does
6. **Database Schema** - Know all fields in User, Product, Order models
7. **Middleware Importance** - Understand how authentication/file upload middleware work
8. **Data Flow** - Trace data from frontend submit → backend receive → DB update → response
9. **Error Handling** - Explain what happens if user not authorized, email invalid, etc.
10. **Real-World Scenarios** - Think: "What if vendor changes product price?" or "How password reset?"

---

## 30-Second Elevator Pitch

"Kalakriti is an e-commerce marketplace for Indian handcrafted products. We have three user roles: customers who browse and purchase, vendors who list products, and admins who moderate listings. We built it with React frontend and Node.js backend, using MongoDB for data storage, JWT for stateless authentication, and Cloudinary for image hosting. Products go through an admin approval process. Payment processing is handled by Razorpay and Stripe. The tech stack ensures scalability and security across the platform."

---

## Final Checklist Before Viva

- [ ] Understand U.S authentication flow (steps 1-5)
- [ ] Know 3 user roles and their permissions
- [ ] Explain product approval workflow
- [ ] Know all 3 database models by heart
- [ ] Understand why each technology chosen
- [ ] Can trace a complete user journey
- [ ] Know middleware functions and their purpose
- [ ] Understand JWT structure and verification
- [ ] Can explain 5 common viva questions
- [ ] Ready to discuss scalability concerns
- [ ] Understand how payments are verified
- [ ] Know Cloudinary image flow

---

## If They Ask "Walk me through..."

**Signup:** User fills form → validate format → hash password → create user in DB → generate JWT → send to frontend → store in localStorage → redirect home

**Add Product:** Vendor uploads images → multer receives → send to Cloudinary → get URLs → save product with URLs to DB → if submit for approval, status=pending, else status=approved → admin approves → visible to customers

**Place Order:** User in cart → click checkout → fill address → select payment → POST /order/place → create order record → redirect to payment gateway → process payment → POST /verify → confirm payment → mark order.payment=true → send confirmation

---

