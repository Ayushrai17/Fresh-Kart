import express from 'express';
import { getOrders, getOrder, createOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);

export default router;

