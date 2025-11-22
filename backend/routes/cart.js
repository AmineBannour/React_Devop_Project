const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// In-memory cart storage (in production, use Redis or database)
// For now, we'll use a simple approach with session storage
let carts = {};

// Get user cart
router.get('/', auth, (req, res) => {
  const userId = req.user._id.toString();
  const cart = carts[userId] || { items: [], total: 0 };
  res.json(cart);
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!carts[userId]) {
      carts[userId] = { items: [], total: 0 };
    }

    const existingItemIndex = carts[userId].items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex > -1) {
      carts[userId].items[existingItemIndex].quantity += quantity;
    } else {
      carts[userId].items.push({
        productId,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity
      });
    }

    // Calculate total
    carts[userId].total = carts[userId].items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json(carts[userId]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item quantity
router.put('/update', auth, (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId, quantity } = req.body;

    if (!carts[userId]) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = carts[userId].items.findIndex(
      item => item.productId === productId
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        carts[userId].items.splice(itemIndex, 1);
      } else {
        carts[userId].items[itemIndex].quantity = quantity;
      }

      // Calculate total
      carts[userId].total = carts[userId].items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      res.json(carts[userId]);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', auth, (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { productId } = req.params;

    if (!carts[userId]) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    carts[userId].items = carts[userId].items.filter(
      item => item.productId !== productId
    );

    // Calculate total
    carts[userId].total = carts[userId].items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json(carts[userId]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', auth, (req, res) => {
  const userId = req.user._id.toString();
  carts[userId] = { items: [], total: 0 };
  res.json({ message: 'Cart cleared' });
});

module.exports = router;

