const express = require('express');
const stripeController = require('../controllers/stripe-controller.js');
const router = express.Router();

router.post('/createStripeAccount', stripeController.createStripeAccount);
router.post('/createStripeAccountLink', stripeController.createStripeAccountLink);
router.post('/createPaymentIntent', stripeController.createPaymentIntent)

module.exports = router;