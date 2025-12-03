const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getAllProducts);

// Get single product
router.get('/:id', productController.getProductById);

// Create product (Admin only)
router.post('/', auth, admin, productController.createProduct);

// Update product (Admin only)
router.put('/:id', auth, admin, productController.updateProduct);

// Delete product (Admin only)
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router;

