import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import orderController from '../controllers/orderController';

const router = express.Router();

router.use(verifyToken);
router.post('/createOrder', orderController.createOrder);
router.get('/items', orderController.getInforOrder);

router.use(isAdmin);
router.get('/list-status', orderController.getListStatus);
router.get('/list-order-process', orderController.getListOrderProcess);
router.get('/', orderController.getOrderByPage);
router.put('/update/:id', orderController.updateOrder);


module.exports = router;