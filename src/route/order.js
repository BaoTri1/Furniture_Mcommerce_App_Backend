import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import orderController from '../controllers/orderController';

const router = express.Router();

router.use(verifyToken);
router.post('/createOrder', orderController.createOrder);
router.get('/items', orderController.getInforOrder);

router.get('/list-order-process-for-user', orderController.getListOrderProcessForUser);
router.get('/list-order-readydelivery-for-user', orderController.getListOrderReadyDeliveryForUser);
router.get('/list-order-delivering-for-user', orderController.getListOrderDeliveringForUser);
router.get('/list-order-delivered-for-user', orderController.getListOrderDelivereredForUser);
router.get('/list-order-cancel-for-user', orderController.getListOrderCancleForUser);
router.get('/count-order-for-user', orderController.getCountOrderForUser);
router.put('/cancleOrder', orderController.cancleOrder);

router.use(isAdmin);
router.get('/list-status', orderController.getListStatus);
router.get('/list-order-process', orderController.getListOrderProcess);
router.get('/', orderController.getOrderByPage);
router.put('/update/:id', orderController.updateOrder);
router.put('/updateStatus/', orderController.updateStatusOrder);


module.exports = router;