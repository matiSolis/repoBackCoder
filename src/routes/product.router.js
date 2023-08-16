import { Router } from "express";
import ProductController from "../controllers/product.controllers.js";


const router = Router();
const productController = new ProductController();
router.post('/mockingproducts', productController.generateProductsFaker);
router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.get('/:pid', productController.getProductById);
router.put('/:pid', productController.updateProductById);
router.delete('/:pid', productController.deleteProductById);
export default router;  