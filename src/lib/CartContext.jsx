/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import { fallbackCatalogImage } from './localImages';
import { getEffectivePrice } from './pricing';

const CartContext = createContext();

const CART_LIMIT = 15;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToLogin = () => {
    navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
  };

  const fetchCart = useCallback(async () => {
    if (!session?.user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;

      const formattedItems = data.map((item) => ({
        id: item.id,
        productId: item.product_id,
        name: item.products.name,
        price: getEffectivePrice(item.products),
        originalPrice: Number(item.products.price || 0),
        quantity: item.quantity,
        image: item.products.images?.[0] || fallbackCatalogImage,
        variant: 'STUDIO PICK' // Default variant for simplicity
      }));

      setCartItems(formattedItems);
    } catch (err) {
      console.error('Error fetching cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToBag = async (product, quantity = 1) => {
    if (!session?.user) {
      redirectToLogin();
      return { success: false, requiresAuth: true, error: 'Please log in to add items to your bag.' };
    }

    // Enforce cart limit
    const currentTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (currentTotal + quantity > CART_LIMIT) {
      return { success: false, error: `Cart limit is ${CART_LIMIT} items` };
    }

    try {
      // Parse price: handle both raw numbers and formatted strings like "NPR 50.00"
      let priceValue = 0;
      if (product.salePrice) {
        priceValue = Number(product.salePrice);
      } else if (product.effectivePrice) {
        priceValue = Number(product.effectivePrice);
      } else if (typeof product.price === 'number') {
        priceValue = product.price;
      } else if (product.rawPrice) {
        priceValue = Number(product.rawPrice);
      } else {
        priceValue = Number(String(product.price).replace(/[^0-9.]/g, ''));
      }

      // Check if item already exists in bag
      const existingItem = cartItems.find(item => item.productId === product.id);

      if (existingItem) {
        if (existingItem.quantity + quantity > CART_LIMIT) {
          return { success: false, error: `Cart limit is ${CART_LIMIT} items` };
        }
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: session.user.id,
            product_id: product.id,
            quantity: quantity,
            price_snapshot: priceValue
          }]);

        if (error) throw error;
      }

      // Create a notification for the added item
      await supabase.from('notifications').insert([{
        user_id: session.user.id,
        type: 'SYSTEM',
        message: `You added ${quantity}x ${product.name || 'item'} to your bag.`,
        link: '/cart'
      }]);

      await fetchCart(); // Refresh cart
      return { success: true };
    } catch (err) {
      console.error('Error adding to bag:', err.message);
      return { success: false, error: err.message };
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return removeFromBag(id);

    if (!session?.user) {
      redirectToLogin();
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('id', id);

      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err.message);
    }
  };

  const removeFromBag = async (id) => {
    if (!session?.user) {
      redirectToLogin();
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCart();
    } catch (err) {
      console.error('Error removing from bag:', err.message);
    }
  };

  const clearBag = async () => {
    if (!session?.user) {
      setCartItems([]);
      return;
    }
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing bag:', err.message);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToBag,
      updateQuantity,
      removeFromBag,
      clearBag,
      cartCount,
      CART_LIMIT
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
