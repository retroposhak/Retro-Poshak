import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';
import { upload } from '../middleware/upload.js';
import * as admin from '../controllers/adminController.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

// Stats
router.get('/stats', admin.stats);

// Products
router.get('/products', admin.listProducts);
router.get('/products/:id', admin.getProduct);
router.post('/products', admin.createProduct);
router.patch('/products/:id', admin.updateProduct);
router.delete('/products/:id', admin.deleteProduct);
router.post('/products/upload', upload.array('images', 8), admin.uploadImages);

// Categories (read-only)
router.get('/categories', admin.listCategories);

// Orders
router.get('/orders', admin.listOrders);
router.patch('/orders/:id/status', admin.updateOrderStatus);
router.patch('/orders/:id/tracking', admin.updateOrderTracking);

// Users
router.get('/users', admin.listUsers);

// Coupons
router.get('/coupons', admin.listCoupons);
router.post('/coupons', admin.createCoupon);
router.patch('/coupons/:id', admin.updateCoupon);
router.delete('/coupons/:id', admin.deleteCoupon);

export default router;