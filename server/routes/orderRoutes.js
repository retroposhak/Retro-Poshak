import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  placeOrder,
  listOrders,
  getOrder,
  cancelOrder,
  trackOrder,
} from '../controllers/orderController.js';

const router = Router();

// Track is public-ish (requires knowing the order ID) — must be before /:orderId
router.get('/track/:orderId', trackOrder);

router.use(requireAuth);
router.post('/', placeOrder);
router.get('/', listOrders);
router.get('/:orderId', getOrder);
router.post('/:orderId/cancel', cancelOrder);

export default router;