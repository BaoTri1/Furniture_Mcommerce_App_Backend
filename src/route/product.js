import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import productController from '../controllers/productController';

const router = express.Router();

router.get('/checkQuantity', productController.checkQuantity);
router.get('/similar', productController.getListSimilarProduct);
router.get('/', productController.getProductByPage);
router.get('/items', productController.getInfoProduct);

router.use(verifyToken);
router.use(isAdmin);

router.get('/all', productController.getListProduct);
router.post('/addProduct', productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/update/:id', productController.updateProduct);

module.exports = router;