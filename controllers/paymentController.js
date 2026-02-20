const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * @desc    Create a new Razorpay order
 * @route   POST /payment/create-payment
 * @access  Public
 */
const createRazorpayOrder = async (req, res) => {
    try {
        const { totalAmount } = req.body;

        if (!totalAmount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const options = {
            amount: totalAmount * 100, // Amount in paise (e.g., ₹10 = 1000 paise)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRazorpayOrder
};
