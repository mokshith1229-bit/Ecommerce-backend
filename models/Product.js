const mongoose = require('mongoose');

/**
 * Product Schema for the ecommerce database.
 */

const mediaSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    url: { type: String, required: true }
}, { _id: false });

const variantSchema = new mongoose.Schema({
    name: String,
    price: Number,
    discountedPrice: Number,
    stock: Number,
    sku: String,
    thumbnail: String,
    cover: mediaSchema,
    media: [mediaSchema],
    attributes: { type: Map, of: String }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please add a product name'], trim: true },
    price: { type: Number, required: [true, 'Please add a price'], default: 0 },
    discountedPrice: Number,
    thumbnail: String,
    cover: mediaSchema,
    media: [mediaSchema],
    description: { type: String, required: [true, 'Please add a description'] },
    category: { type: String, required: [true, 'Please add a category'] },
    stock: { type: Number, required: [true, 'Please add stock count'], default: 0 },
    weight: { type: Number }, // in grams
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number }
    },
    variants: [variantSchema],
    seo: {
        title: { type: String },
        description: { type: String }
    },
    status: {
        type: String,
        enum: ['Active', 'Draft'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
