import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import serviceController from '../controllers/serviceController';

const router = express.Router();

router.use(verifyToken);
router.get('/methodShipping', serviceController.getMethodShipping);
router.get('/methodPayment', serviceController.getMethodPayment);

router.use(isAdmin);
router.get('/information', serviceController.getInformation)
router.get('/most-product-for-month', serviceController.getMostProductForMonth)
router.get('/StatisticalProductByParentCategory', serviceController.statisticalProduct_ParentCategory)
router.get('/StatisticalForMonth', serviceController.statisticalForMonth)
router.get('/MonthlyRevenueStatisticsByCategory', serviceController.MonthlyRevenueStatisticsByCategory)
router.get('/order-by-status', serviceController.getOrderByListStatus)

module.exports = router;