# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Step-by-Step Setup

### 1. Clone/Download the Project
```bash
# If using git
git clone <repository-url>
cd subscription-ecommerce-platform
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# Copy the content below and create server/.env file
```

**server/.env file content:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/subscription_ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**Start MongoDB:**
- If using local MongoDB: Ensure MongoDB service is running
- If using MongoDB Atlas: Update MONGODB_URI with your Atlas connection string

**Start backend server:**
```bash
npm run dev
```

Backend should be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Create .env file (optional, defaults are set)
# Create .env file in root with:
```

**.env file content (root directory):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Start frontend:**
```bash
npm run dev
```

Frontend should be running on `http://localhost:5173`

### 4. Access the Application

1. Open browser: `http://localhost:5173`
2. Register a new account
3. Start browsing products!

### 5. Create Admin User (Optional)

To access admin dashboard, update a user's role in MongoDB:

```javascript
// Using MongoDB Compass or MongoDB Shell
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Then login with that email to access admin features.

## Testing the Subscription Feature

1. **Create a Subscription:**
   - Browse products
   - Click "Subscribe" on a subscription-eligible product
   - Fill in the subscription form (quantity, interval, start date)
   - Submit

2. **Test Auto-Order Generation:**
   - The cron job runs daily at 2 AM
   - For testing, you can manually trigger it by:
     - Temporarily modifying the cron schedule in `server/server.js`
     - Or manually calling the `processSubscriptions` function
   - Orders will be created automatically when `nextDeliveryDate` arrives

3. **Manage Subscriptions:**
   - Go to Dashboard → My Subscriptions
   - Pause, resume, or cancel subscriptions

## Common Commands

### Backend
```bash
cd server
npm start          # Production mode
npm run dev        # Development mode with nodemon
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify MONGODB_URI in server/.env
- Check MongoDB logs for connection errors

### Port Already in Use
- Backend: Change PORT in server/.env
- Frontend: Change port in vite.config.js

### CORS Errors
- Ensure FRONTEND_URL in server/.env matches your frontend URL
- Check browser console for specific CORS error details

### Socket.IO Connection Failed
- Verify VITE_SOCKET_URL in frontend .env
- Check backend Socket.IO server is running
- Ensure no firewall blocking WebSocket connections

## Next Steps

1. Add sample products via admin dashboard
2. Test user registration and login
3. Create a subscription
4. Test cart and checkout flow
5. Explore admin dashboard features

## Production Deployment

See README.md for detailed deployment instructions.

---

**Happy Coding! 🚀**

