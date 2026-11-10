import { Router } from 'express';
import {
  listProducts,
  getProduct,
  listCategories,
} from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/categories', listCategories); // must come before /:slugOrId
router.get('/:slugOrId', getProduct);

export default router;