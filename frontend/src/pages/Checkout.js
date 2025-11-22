import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
    if (user?.address) {
      setFormData({
        ...formData,
        ...user.address
      });
    }
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      setCart(res.data);
      if (res.data.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: cart.total
      };

      await axios.post('/api/orders', orderData);
      await axios.delete('/api/cart/clear');
      navigate('/orders');
    } catch (error) {
      alert('Error placing order: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping Address</h2>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h2>Payment Method</h2>
          <div className="form-group">
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large btn-block"
            disabled={submitting}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="order-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

