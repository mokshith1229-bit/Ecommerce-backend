const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    couponType: {
        type: String,
        required: true,
        enum: ['percentage', 'flat', 'buy_x_get_y', 'freebie', 'free_shipping', 'loyalty']
    },
    discountValue: {
        type: Number,
        default: 0
    },
    minOrderCondition: {
        type: String,
        default: 'Order value'
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number
    },
    usageLimit: {
        type: String,
        default: 'Only once'
    },
    maxUsage: {
        type: String,
        default: 'Unlimited'
    },
    description: String,
    applyOn: {
        type: String,
        default: 'All products'
    },
    specificItems: [String],
    buyX: Number,
    getY: Number,
    freebieItem: String,
    functionality: {
        showToCustomer: { type: Boolean, default: true },
        onlinePayments: { type: Boolean, default: false },
        newCustomers: { type: Boolean, default: false },
        autoApply: { type: Boolean, default: false },
        applicableWithOthers: { type: Boolean, default: false }
    },
    validity: {
        startDate: Date,
        startTime: String,
        hasEndDate: { type: Boolean, default: false },
        endDate: Date,
        endTime: String
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Expired', 'Paused']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Coupon', couponSchema);
