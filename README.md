# Subscription-Based E-Commerce Platform

A full-stack MERN application for managing subscription-based e-commerce with automatic order generation, real-time notifications, and comprehensive admin dashboard.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with protected routes
- **Product Management**: CRUD operations for products with subscription eligibility
- **Subscription System**: 
  - Weekly, monthly, or custom interval subscriptions
  - Automatic order generation via cron jobs
  - Pause, resume, and cancel subscriptions
- **Shopping Cart**: Add, update, and remove items
- **Order Management**: Complete order lifecycle
- **Real-time Notifications**: Socket.IO for subscription order confirmations
- **Admin Dashboard**: Manage products, users, subscriptions, and view statistics

### User Roles
- **Normal User**: Browse products, subscribe, manage orders
- **Admin**: Full access to admin dashboard and product management

## 📋 Tech Stack

### Frontend
- React 18+ with Vite
- Redux Toolkit for state management
- React Router DOM for navigation
- Axios for API calls
- Tailwind CSS for styling
- Socket.IO Client for real-time features

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.IO for real-time features
- node-cron for scheduled tasks

## 📁 Project Structure

```
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & error handling
│   ├── utils/            # Utilities
│   └── server.js         # Entry point
│
├── src/                   # Frontend
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── redux/            # Redux store & slices
│   ├── services/         # API services
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilities
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
│
├── package.json          # Frontend dependencies
├── vite.config.js        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/subscription_ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update` - Update cart item (protected)
- `DELETE /api/cart/remove/:productId` - Remove item (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `POST /api/orders` - Create order (protected)

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions (protected)
- `POST /api/subscriptions` - Create subscription (protected)
- `PUT /api/subscriptions/:id` - Update subscription (protected)
- `DELETE /api/subscriptions/:id` - Delete subscription (protected)

### Admin
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/subscriptions` - Get all subscriptions (admin)
- `GET /api/admin/stats` - Get statistics (admin)

## 🔄 Subscription Logic

### How It Works

1. **Subscription Creation**: User selects a product, quantity, interval (in days), and start date
2. **Next Delivery Date**: Calculated as start date + interval
3. **Cron Job**: Runs daily at 2 AM to check for due subscriptions
4. **Order Generation**: 
   - Finds all active subscriptions where `nextDeliveryDate <= today`
   - Creates an order for each subscription
   - Updates `nextDeliveryDate` to current date + interval
   - If `autoRenew` is false, cancels the subscription
5. **Notification**: Sends real-time notification via Socket.IO

### Subscription Statuses
- **active**: Subscription is active and will generate orders
- **paused**: Subscription is paused (won't generate orders)
- **cancelled**: Subscription is cancelled

## 🧪 Testing

### Create Admin User

To create an admin user, you can either:
1. Use MongoDB Compass/CLI to update a user's role to 'admin'
2. Add admin creation logic in the registration controller

Example MongoDB command:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🚢 Deployment

### Backend Deployment

1. Set production environment variables
2. Use PM2 or similar for process management:
```bash
pm2 start server.js --name subscription-backend
```

3. Ensure MongoDB is accessible (use MongoDB Atlas for cloud)

### Frontend Deployment

1. Build the frontend:
```bash
npm run build
```

2. Serve the `dist` folder using:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

3. Update CORS settings in backend to allow production frontend URL

### Environment Variables for Production

**Backend (.env)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=strong_random_secret_key
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## 📚 Key Features Explained

### Real-time Notifications
- Socket.IO establishes WebSocket connection
- Users join their personal room on connection
- Server emits notifications to user's room when subscription orders are created

### Protected Routes
- Frontend: `ProtectedRoute` component checks authentication
- Backend: `protect` middleware validates JWT token
- Admin routes: Additional `admin` middleware checks role

### State Management
- Redux Toolkit manages:
  - User authentication state
  - Cart items
  - Subscriptions
- Persists token and user in localStorage

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **CORS Errors**
   - Verify FRONTEND_URL in backend .env matches frontend URL

3. **JWT Token Expired**
   - Token expires after 7 days (configurable)
   - User needs to login again

4. **Socket.IO Connection Failed**
   - Check VITE_SOCKET_URL in frontend .env
   - Ensure backend Socket.IO server is running

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

### Adding New Features

1. **Backend**: Add controller → Add route → Update server.js
2. **Frontend**: Add service → Add Redux slice (if needed) → Add component/page → Update routes

### Code Style
- Use functional components only
- Follow React hooks best practices
- Use async/await for API calls
- Implement proper error handling

## 🎯 Future Enhancements

- Email notifications for subscription orders
- Payment integration (Stripe/PayPal)
- Product reviews and ratings
- Advanced filtering and search
- Order tracking
- Multiple address management
- Subscription modification (change quantity/interval)
- Grace period for failed payments
- Subscription analytics

---

**Built with ❤️ for subscription-based e-commerce**

#   F r e s h - K a r t  
 