var express = require('express');
var router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Route to create a payment intent
router.post('/payment', async (req, res) => {
    const { amount } = req.body;

    try {
        // Create a payment intent with the provided amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in smallest currency unit (e.g., cents for USD)
            currency: 'usd',
        });

        // Return the client secret for the payment intent
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: 'Error creating payment intent', error });
    }
});

module.exports = router;
