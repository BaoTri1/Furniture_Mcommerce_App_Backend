import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';
import reviewController from '../controllers/reviewController';

const router = express.Router();

router.get('/rating/:idProduct', reviewController.getRatingProduct);

router.use(verifyToken);
router.get('/product', reviewController.getListReviewForProduct);
router.post('/addReview', reviewController.createReview);

router.use(isAdmin);
router.get('/', reviewController.getProductByPage);
router.put('/update/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);


module.exports = router;