import axios from 'axios';

const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await axios.post('/api/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await axios.get('/api/orders/myorders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await axios.get(`/api/orders/${id}`);
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async () => {
    const response = await axios.get('/api/orders');
    return response.data;
  },

  // Update order to paid
  updateOrderToPaid: async (id) => {
    const response = await axios.put(`/api/orders/${id}/pay`);
    return response.data;
  },

  // Update order to delivered (Admin only)
  updateOrderToDelivered: async (id) => {
    const response = await axios.put(`/api/orders/${id}/deliver`);
    return response.data;
  }
};

export default orderService;

