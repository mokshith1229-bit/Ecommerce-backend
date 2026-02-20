const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Create a new coupon
router.post('/', async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all coupons
router.get('/', async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a coupon
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.json(updatedCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Validate a coupon (for storefront)
router.post('/validate', async (req, res) => {
    const { code, orderValue } = req.body;
    console.log(`Validating coupon: ${code} for order value: ${orderValue}`);
    try {
        const coupon = await Coupon.findOne({ couponCode: code.toUpperCase(), status: 'Active' });

        if (!coupon) {
            console.log(`Coupon not found or inactive: ${code}`);
            return res.status(404).json({ message: 'Coupon not found or inactive' });
        }

        // Basic validation
        if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
            console.log(`Min order value not met. Required: ${coupon.minOrderValue}, Got: ${orderValue}`);
            return res.status(400).json({ message: `Minimum order value of ₹${coupon.minOrderValue} required` });
        }

        // Validity dates check
        const now = new Date();
        if (coupon.validity?.startDate && now < new Date(coupon.validity.startDate)) {
            console.log(`Coupon not yet active. Start: ${coupon.validity.startDate}`);
            return res.status(400).json({ message: 'Coupon is not yet active' });
        }
        if (coupon.validity?.hasEndDate && coupon.validity?.endDate && now > new Date(coupon.validity.endDate)) {
            console.log(`Coupon expired. End: ${coupon.validity.endDate}`);
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        console.log(`Coupon validated successfully: ${code}`);
        res.json(coupon);
    } catch (error) {
        console.error('Coupon validation error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
