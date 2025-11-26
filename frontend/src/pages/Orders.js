import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/myorders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>You have no orders yet</h2>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-8)}</h3>
                <p className="order-date">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="order-status">
                <span className={`status-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
                <span className={`status-badge ${order.isDelivered ? 'delivered' : 'pending'}`}>
                  {order.isDelivered ? 'Delivered' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.product?.image || 'https://via.placeholder.com/300'}
                    alt={item.product?.name}
                  />
                  <div className="order-item-info">
                    <p className="order-item-name">{item.product?.name}</p>
                    <p>Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="order-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
              </div>
              {!order.isPaid && (
                <button
                  onClick={() => {
                    axios.put(`/api/orders/${order._id}/pay`);
                    fetchOrders();
                  }}
                  className="btn btn-success"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

