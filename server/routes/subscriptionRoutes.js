import express from 'express';
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getSubscriptions);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

export default router;

