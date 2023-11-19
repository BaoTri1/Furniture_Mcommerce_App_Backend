import express from 'express';
import verifyToken from '../middlewares/verify_token';
import isAdmin from '../middlewares/verify_role';

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/login', userController.handleLogin);
router.post('/signup', userController.handleSignup);


router.use(verifyToken);
router.get('/info', userController.getInfoUser);
router.put('/updateInfo', userController.updateInfoUser);

router.use(isAdmin);

router.get('/', userController.getListUserByPage);


module.exports  = router;