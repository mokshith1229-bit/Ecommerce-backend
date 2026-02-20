const mongoose = require('mongoose');

/**
 * Order Schema
 * Represents a customer order containing multiple products.
 */
const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Please add a customer name'],
        trim: true
    },
    customerPhone: {
        type: String,
        required: [true, 'Please add a phone number'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    shippingAddress: {
        fullName: { type: String },
        phone: { type: String },
        line1: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String }
    },
    billingAddress: {
        fullName: { type: String },
        phone: { type: String },
        line1: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String }
    },
    products: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    couponCode: String,
    discountAmount: { type: Number, default: 0 },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    billingAddress: {
        address: String,
        city: String,
        postalCode: String
    },
    paymentMethod: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Shipped', 'Delivered', 'Modified', 'Rejected', 'Cancelled', 'Failed', 'Returned', 'Cancelled by Buyer'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
