import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeGuest,
} from '../controllers/cartController.js';

const router = Router();
router.use(requireAuth);

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);
router.delete('/', clearCart);
router.post('/merge', mergeGuest);

export default router;