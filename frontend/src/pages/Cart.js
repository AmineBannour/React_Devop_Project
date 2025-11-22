import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cart, fetchCart, updateCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState([]);

  // Get localStorage key for saved items
  const getSavedItemsKey = () => {
    return user?._id ? `savedItems_${user._id}` : 'savedItems';
  };

  // Load saved items from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const key = getSavedItemsKey();
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setSavedItems(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved items:', error);
        }
      } else {
        setSavedItems([]);
      }
    } else if (!isAuthenticated) {
      setSavedItems([]);
    }
  }, [isAuthenticated, user]);

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

  const saveForLater = async (item) => {
    try {
      // Remove item from cart
      const res = await axios.delete(`/api/cart/remove/${item.productId}`);
      updateCart(res.data);

      // Add to saved items
      const key = getSavedItemsKey();
      const updatedSavedItems = [...savedItems, item];
      setSavedItems(updatedSavedItems);
      localStorage.setItem(key, JSON.stringify(updatedSavedItems));
    } catch (error) {
      console.error('Error saving item for later:', error);
    }
  };

  const moveToCart = async (savedItem) => {
    try {
      // Add item back to cart
      const res = await axios.post('/api/cart/add', {
        productId: savedItem.productId,
        quantity: savedItem.quantity
      });
      updateCart(res.data);

      // Remove from saved items
      const key = getSavedItemsKey();
      const updatedSavedItems = savedItems.filter(
        item => item.productId !== savedItem.productId
      );
      setSavedItems(updatedSavedItems);
      localStorage.setItem(key, JSON.stringify(updatedSavedItems));
    } catch (error) {
      console.error('Error moving item to cart:', error);
    }
  };

  const removeSavedItem = (productId) => {
    const key = getSavedItemsKey();
    const updatedSavedItems = savedItems.filter(
      item => item.productId !== productId
    );
    setSavedItems(updatedSavedItems);
    localStorage.setItem(key, JSON.stringify(updatedSavedItems));
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cart.items.length === 0 && savedItems.length === 0) {
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
          {cart.items.length > 0 && (
            <>
              <h2 className="cart-section-title">Active Cart</h2>
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
                  <div className="cart-item-actions">
                    <button
                      onClick={() => saveForLater(item)}
                      className="btn btn-secondary btn-sm"
                    >
                      Save for Later
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {savedItems.length > 0 && (
            <div className="saved-items-section">
              <h2 className="cart-section-title">Saved for Later</h2>
              {savedItems.map((item) => (
                <div key={item.productId} className="cart-item saved-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>${item.price.toFixed(2)}</p>
                    <p className="saved-quantity">Quantity: {item.quantity}</p>
                  </div>
                  <div className="cart-item-total">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      onClick={() => moveToCart(item)}
                      className="btn btn-primary btn-sm"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeSavedItem(item.productId)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.items.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default Cart;

