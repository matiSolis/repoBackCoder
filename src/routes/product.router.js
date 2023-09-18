import { Router } from 'express';
import ProductController from '../controllers/product.controllers.js';
import { adminSession, premiumSession } from '../middlewares/middlewareAccess.js';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getProducts);
router.post('/', adminSession, premiumSession, productController.addProduct);
router.get('/:pid', productController.getProductById);
router.put('/:pid', productController.updateProductById);
router.delete('/:pid', adminSession, productController.deleteProductById);
export default router;
