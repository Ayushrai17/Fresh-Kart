# Subscription-Based E-Commerce Platform - Architecture Overview

## System Architecture

### High-Level Overview
This is a full-stack MERN application with real-time capabilities for managing subscription-based e-commerce.

```
┌─────────────────┐
│   React Frontend│ (Vite + Redux + Tailwind)
│   Port: 5173    │
└────────┬────────┘
         │ HTTP/REST API
         │ Socket.IO (WebSocket)
┌────────▼────────┐
│  Express Backend│ (Node.js + Express)
│   Port: 5000    │
└────────┬────────┘
         │
┌────────▼────────┐
│   MongoDB       │ (Database)
│   Port: 27017   │
└─────────────────┘
```

## Technology Stack

### Frontend
- **React 18+** with Vite for fast development
- **Redux Toolkit** for state management (cart, user, subscriptions)
- **React Router DOM** for navigation
- **Axios** for API calls with interceptors
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.IO** for real-time features
- **node-cron** for subscription order generation

## Database Schema Design

### Collections

1. **Users**
   - _id (ObjectId)
   - name, email, password (hashed)
   - role (user/admin)
   - address (array)
   - createdAt, updatedAt

2. **Products**
   - _id (ObjectId)
   - name, description, price, image
   - category, subscriptionEligible (boolean)
   - stock, createdAt, updatedAt

3. **Orders**
   - _id (ObjectId)
   - userId (ref: User)
   - items (array of {productId, quantity, price})
   - totalAmount, status
   - shippingAddress
   - subscriptionId (optional ref: Subscription)
   - createdAt, updatedAt

4. **Subscriptions**
   - _id (ObjectId)
   - userId (ref: User)
   - productId (ref: Product)
   - quantity, interval (days)
   - nextDeliveryDate
   - status (active/paused/cancelled)
   - autoRenew (boolean)
   - startDate
   - createdAt, updatedAt

5. **Cart** (stored in Redux, optionally synced to backend)
   - userId (ref: User)
   - items (array)

## Data Flow

### Authentication Flow
1. User registers/logs in → Backend validates → Returns JWT
2. Frontend stores JWT → Axios interceptor adds to headers
3. Protected routes check JWT → Middleware validates

### Subscription Flow
1. User clicks "Subscribe" → Opens modal
2. User selects quantity, interval, start date → Creates subscription
3. Backend stores subscription → Cron job checks daily
4. When nextDeliveryDate arrives → Auto-generate order
5. Update nextDeliveryDate → Continue cycle

### Order Generation Logic
- Cron job runs daily at 2 AM
- Finds subscriptions where nextDeliveryDate <= today AND status = 'active'
- Creates order for each subscription
- Updates nextDeliveryDate = currentDate + interval
- Sends notification via Socket.IO

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)

### Cart
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove/:productId

### Orders
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders

### Subscriptions
- GET /api/subscriptions
- POST /api/subscriptions
- PUT /api/subscriptions/:id (pause/resume/cancel)
- DELETE /api/subscriptions/:id

### Admin
- GET /api/admin/users
- GET /api/admin/subscriptions
- GET /api/admin/stats

## Frontend Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── redux/            # Redux store & slices
├── services/         # API services
├── hooks/            # Custom hooks
├── utils/            # Utilities
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Backend Structure

```
server/
├── config/           # Database config
├── models/           # Mongoose models
├── controllers/      # Route handlers
├── routes/           # API routes
├── middleware/       # Auth, error handling
├── utils/            # Helpers
└── server.js         # Entry point
```

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcrypt with salt rounds
3. **Role-Based Access**: Admin vs User routes
4. **Input Validation**: Request validation middleware
5. **CORS**: Configured for frontend origin
6. **Environment Variables**: Sensitive data in .env

## Deployment Considerations

- Frontend: Build with `npm run build` → Serve static files
- Backend: Use PM2 or similar for process management
- Database: MongoDB Atlas for cloud hosting
- Environment: Set production variables
- CORS: Update allowed origins
- HTTPS: Use SSL certificates

