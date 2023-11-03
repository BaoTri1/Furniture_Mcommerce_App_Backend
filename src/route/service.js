import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import serviceController from '../controllers/serviceController';

const router = express.Router();

router.use(verifyToken);
router.get('/methodShipping', serviceController.getMethodShipping);
router.get('/methodPayment', serviceController.getMethodPayment);

module.exports = router;