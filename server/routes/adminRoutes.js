import express from 'express';
import {
  getUsers,
  getAllSubscriptions,
  getStats,
  getAllOrders,
  updateOrderStatus,
  updateSubscriptionStatus,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication
router.use(admin); // All routes require admin role

router.get('/users', getUsers);
router.get('/subscriptions', getAllSubscriptions);
router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/subscriptions/:id/status', updateSubscriptionStatus);

export default router;

