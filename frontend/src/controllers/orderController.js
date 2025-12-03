import orderService from '../services/orderService';
import cartService from '../services/cartService';

const orderController = {
  // Create order from cart
  createOrderFromCart: async (cart, shippingAddress, paymentMethod) => {
    try {
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        totalPrice: cart.total
      };

      const order = await orderService.createOrder(orderData);
      await cartService.clearCart();
      
      return { success: true, data: order };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error placing order'
      };
    }
  },

  // Fetch user orders
  fetchUserOrders: async () => {
    try {
      const orders = await orderService.getMyOrders();
      return { success: true, data: orders };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching orders'
      };
    }
  },

  // Mark order as paid
  markOrderPaid: async (orderId) => {
    try {
      const order = await orderService.updateOrderToPaid(orderId);
      return { success: true, data: order };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating order'
      };
    }
  }
};

export default orderController;

