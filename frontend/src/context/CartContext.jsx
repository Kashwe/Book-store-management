import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], totalAmount: 0 });
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/api/cart');
      setCart(response.data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  //  Add to Cart
  const addToCart = async (bookId, quantity = 1) => {
    const response = await api.post('/api/cart/add', { bookId, quantity });
    setCart(response.data);
    return response.data;
  };

  const removeFromCart = async (bookId) => {
    const response = await api.delete(`/api/cart/item/${bookId}`);
    setCart(response.data);
    return response.data;
  };

  const clearCart = async () => {
    await api.delete('/api/cart/clear');
    setCart({ items: [], totalAmount: 0 });
  };

  // Place Order
  const placeOrder = async () => {
    const response = await api.post('/api/orders/place');
    setCart({ items: [], totalAmount: 0 });
    return response.data;
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, addToCart, removeFromCart, clearCart, placeOrder, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;