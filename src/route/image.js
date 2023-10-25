import express from 'express';
import imageController from '../controllers/imageController';
import fileUploader from '../config/cloudinary.config';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';


const router = express.Router();

router.use(verifyToken);
router.use(isAdmin);

router.post('/uploadavatarproduct',fileUploader.single('image'),imageController.uploadAvatarProduct)
router.post('/uploaddetailproduct',fileUploader.array('images'),imageController.uploadDetailImageProduct)
router.put('/updateavatarproduct',fileUploader.single('image'),imageController.updateAvatarProduct)
router.put('/updatedetailimagesproduct',fileUploader.array('images'),imageController.updateDetailImagesProduct)

module.exports = router;