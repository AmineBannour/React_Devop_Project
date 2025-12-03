import reviewService from '../services/reviewService';

const reviewController = {
  // Fetch product reviews
  fetchProductReviews: async (productId) => {
    try {
      const reviews = await reviewService.getProductReviews(productId);
      return { success: true, data: reviews };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching reviews'
      };
    }
  },

  // Create review
  createReview: async (productId, rating, comment) => {
    try {
      const review = await reviewService.createReview(productId, rating, comment);
      return { success: true, data: review };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error creating review'
      };
    }
  },

  // Update review
  updateReview: async (reviewId, rating, comment) => {
    try {
      const review = await reviewService.updateReview(reviewId, rating, comment);
      return { success: true, data: review };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating review'
      };
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting review'
      };
    }
  }
};

export default reviewController;

