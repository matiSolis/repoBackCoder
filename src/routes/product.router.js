import { Router } from 'express';
import ProductController from '../controllers/product.controllers.js';
import { adminSession, premiumSession } from '../middlewares/middlewareAccess.js';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.put('/:pid', productController.updateProductById);
router.post('/', adminSession, productController.addProduct);
router.delete('/:pid', adminSession, productController.deleteProductById);
export default router;
