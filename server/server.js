import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import connectDB from './config/database.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import subscription processor
import { processSubscriptions } from './controllers/subscriptionController.js';

// Import product seeder
import { seedProductsOnStart } from './utils/seedProductsOnStart.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's personal room for notifications
  socket.on('joinUserRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Join admin room for admin notifications
  socket.on('joinAdminRoom', () => {
    socket.join('admin');
    console.log('Admin joined admin room');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to controllers
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Cron job to process subscriptions daily at 2 AM
// Runs every day at 2:00 AM
cron.schedule('0 2 * * *', () => {
  console.log('Running subscription processing cron job...');
  processSubscriptions(io);
});

// Also run on server start for testing (can be removed in production)
// Uncomment the line below if you want to test immediately
// processSubscriptions(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
  
  // Seed products if database is empty
  await seedProductsOnStart();
});

