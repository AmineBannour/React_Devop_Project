import orderService from '../services/orderService';
import productService from '../services/productService';

const adminController = {
  // Fetch dashboard statistics
  fetchDashboardStats: async () => {
    try {
      const [orders, products] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts()
      ]);

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrders = orders.filter(order => !order.isDelivered).length;

      return {
        success: true,
        data: {
          totalOrders: orders.length,
          totalProducts: products.length,
          totalRevenue,
          pendingOrders,
          orders,
          products
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching dashboard data'
      };
    }
  },

  // Mark order as delivered
  markOrderDelivered: async (orderId) => {
    try {
      const order = await orderService.updateOrderToDelivered(orderId);
      return { success: true, data: order };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating order'
      };
    }
  }
};

export default adminController;

