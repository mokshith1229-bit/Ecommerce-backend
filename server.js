const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for front-end integration
app.use(express.json()); // Body parser to handle JSON data

// Routes
// All product related routes will be prefixed with /products
app.use('/products', productRoutes);
// All order related routes will be prefixed with /orders
app.use('/orders', orderRoutes);
// All coupon related routes will be prefixed with /coupons
// All coupon related routes will be prefixed with /coupons
app.use('/coupons', couponRoutes);
// Dashboard analytics route
app.use('/dashboard', require('./routes/dashboardRoutes'));
// User routes
app.use('/users', require('./routes/userRoutes'));
// Payment routes
app.use('/payment', require('./routes/paymentRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send('Ecommerce API is running...');
});

// Set PORT
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
