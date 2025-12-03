const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// Get all reviews for a product
router.get('/product/:productId', reviewController.getProductReviews);

// Create a review
router.post('/', auth, reviewController.createReview);

// Update a review
router.put('/:id', auth, reviewController.updateReview);

// Delete a review
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;

