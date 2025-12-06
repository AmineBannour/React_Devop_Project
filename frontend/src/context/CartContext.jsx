import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState({ items: [], total: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartCount(0);
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
      const count = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    const count = newCart.items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        fetchCart,
        updateCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

