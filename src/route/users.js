import express from 'express';
//import userController from '../controllers/userController';

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/login', userController.handleLogin);
router.post('/signup', userController.handleSignup);


module.exports  = router;