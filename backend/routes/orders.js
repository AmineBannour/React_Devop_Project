const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Get all orders (Admin only) - must be before /:id route
router.get('/', auth, admin, orderController.getAllOrders);

// Get user's orders
router.get('/myorders', auth, orderController.getMyOrders);

// Create new order
router.post('/', auth, orderController.createOrder);

// Get single order
router.get('/:id', auth, orderController.getOrderById);

// Update order to paid
router.put('/:id/pay', auth, orderController.updateOrderToPaid);

// Update order to delivered (Admin only)
router.put('/:id/deliver', auth, admin, orderController.updateOrderToDelivered);

module.exports = router;

