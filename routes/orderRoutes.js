const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById
} = require('../controllers/orderController');

// Route to get all orders and create a new order
router.route('/')
    .get(getOrders)
    .post(createOrder);

// Route to get a single order by ID
router.route('/:id')
    .get(getOrderById);

module.exports = router;
