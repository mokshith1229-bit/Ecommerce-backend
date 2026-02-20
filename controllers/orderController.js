const Order = require('../models/Order');

/**
 * @desc    Create a new order
 * @route   POST /orders
 * @access  Public
 */
const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            user,
            products,
            totalAmount,
            shippingAddress,
            billingAddress,
            paymentMethod,
            couponCode,
            discountAmount
        } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'No products in order' });
        }

        // Copy shipping to billing if billing is missing
        const finalBillingAddress = billingAddress && Object.keys(billingAddress).length > 0
            ? billingAddress
            : shippingAddress;

        // Status logic: Online -> Accepted (as success is assumed if frontend calls this), COD -> Pending
        const status = paymentMethod === 'Online' ? 'Accepted' : 'Pending';

        const order = await Order.create({
            customerName,
            customerPhone,
            user,
            products,
            totalAmount,
            shippingAddress,
            billingAddress: finalBillingAddress,
            paymentMethod,
            couponCode,
            discountAmount,
            status
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * @desc    Get all orders
 * @route   GET /orders
 * @access  Public
 */
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // Newest first
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get single order by ID
 * @route   GET /orders/:id
 * @access  Public
 */
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById
};
