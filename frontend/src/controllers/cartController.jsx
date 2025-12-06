import cartService from '../services/cartService';

const cartController = {
  // Fetch cart
  fetchCart: async () => {
    try {
      const cart = await cartService.getCart();
      return { success: true, data: cart };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching cart'
      };
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const cart = await cartService.addToCart(productId, quantity);
      return { success: true, data: cart };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error adding to cart'
      };
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    try {
      const cart = await cartService.updateCart(productId, quantity);
      return { success: true, data: cart };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating cart'
      };
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      const cart = await cartService.removeFromCart(productId);
      return { success: true, data: cart };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error removing from cart'
      };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      await cartService.clearCart();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error clearing cart'
      };
    }
  }
};

export default cartController;

