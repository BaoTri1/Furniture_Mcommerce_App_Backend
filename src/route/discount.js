import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import discountController from '../controllers/discountController';

const router = express.Router();

router.get('/checkQuantity', discountController.checkQuantity);
router.get('/checkDiscountValid', discountController.checkDiscountValid);
router.get('/', discountController.getDiscountByPage);

router.use(verifyToken);
router.use(isAdmin);

router.post('/addDiscount', discountController.createDiscount);
router.delete('/:id', discountController.deleteDiscount);
router.put('/update/:id', discountController.updateDiscount);


module.exports = router;