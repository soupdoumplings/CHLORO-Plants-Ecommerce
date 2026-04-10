import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const fetchCart = async () => {
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
        price: Number(item.products.price),
        quantity: item.quantity,
        image: item.products.images?.[0] || 'https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg',
        variant: 'STUDIO SPECIMEN' // Default variant for simplicity
      }));

      setCartItems(formattedItems);
    } catch (err) {
      console.error('Error fetching cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [session]);

  const addToBag = async (product, quantity = 1) => {
    if (!session?.user) return;

    try {
      // Check if item already exists in bag
      const existingItem = cartItems.find(item => item.productId === product.id);

      if (existingItem) {
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
            price_snapshot: Number(product.price.toString().replace(/[^0-9.]/g, ''))
          }]);
        
        if (error) throw error;
      }

      await fetchCart(); // Refresh cart
    } catch (err) {
      console.error('Error adding to bag:', err.message);
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return removeFromBag(id);

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
    if (!session?.user) return;
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
      cartCount 
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
