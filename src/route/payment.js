import express from 'express';
import verifyToken from '../middlewares/verify_token';
const stripe = require('stripe')(process.env.Secret_key);

require('dotenv').config();

const router = express.Router();

router.use(verifyToken);
router.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency, paymentMethodId } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
      });
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  });


module.exports = router;