import express from 'express';

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/login', userController.handleLogin);
router.post('/signup', userController.handleSignup);
router.get('/', userController.getInfoUser);


module.exports  = router;