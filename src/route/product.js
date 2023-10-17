import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import productController from '../controllers/productController';

const router = express.Router();


router.use(verifyToken);
router.use(isAdmin);

router.post('/addProduct', productController.createProduct);

module.exports = router;