const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Route for getting all products and adding a new product
router.route('/')
    .get(getProducts)
    .post(addProduct);

// Route for getting, updating, and deleting a single product by ID
router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;
