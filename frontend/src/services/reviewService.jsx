import axios from 'axios';

const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId) => {
    const response = await axios.get(`/api/reviews/product/${productId}`);
    return response.data;
  },

  // Create review
  createReview: async (productId, rating, comment) => {
    const response = await axios.post('/api/reviews', {
      productId,
      rating,
      comment
    });
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, rating, comment) => {
    const response = await axios.put(`/api/reviews/${reviewId}`, {
      rating,
      comment
    });
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await axios.delete(`/api/reviews/${reviewId}`);
    return response.data;
  }
};

export default reviewService;

