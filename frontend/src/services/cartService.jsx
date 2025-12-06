import axios from 'axios';

const cartService = {
  // Get cart
  getCart: async () => {
    const response = await axios.get('/api/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity) => {
    const response = await axios.post('/api/cart/add', {
      productId,
      quantity
    });
    return response.data;
  },

  // Update cart item
  updateCart: async (productId, quantity) => {
    const response = await axios.put('/api/cart/update', {
      productId,
      quantity
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const response = await axios.delete(`/api/cart/remove/${productId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await axios.delete('/api/cart/clear');
    return response.data;
  }
};

export default cartService;

