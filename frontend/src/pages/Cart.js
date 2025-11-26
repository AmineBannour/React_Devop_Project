import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { cart, fetchCart, updateCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const loadCart = async () => {
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, [isAuthenticated, navigate, fetchCart]);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const res = await axios.put('/api/cart/update', {
        productId,
        quantity: newQuantity
      });
      updateCart(res.data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(`/api/cart/remove/${productId}`);
      updateCart(res.data);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.productId} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-quantity">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  +
                </button>
              </div>
              <div className="cart-item-total">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="btn btn-danger btn-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
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
          <Link to="/checkout" className="btn btn-primary btn-large btn-block">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

