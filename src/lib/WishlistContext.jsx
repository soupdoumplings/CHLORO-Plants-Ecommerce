/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import { fallbackCatalogImage } from './localImages';

const WishlistContext = createContext({});

const fallbackImage = fallbackCatalogImage;

const normalizeWishlistItem = (item) => {
  const product = item.products || item.product || {};
  return {
    id: item.id,
    productId: item.product_id,
    createdAt: item.created_at,
    product: {
      ...product,
      id: product.id || item.product_id,
      name: product.name || 'Saved item',
      rawPrice: Number(product.rawPrice || product.price || 0),
      price: Number(product.price || product.rawPrice || 0),
      displayPrice: `रू ${Number(product.rawPrice || product.price || 0).toLocaleString('en-NP', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      image: product.images?.[0] || product.image || fallbackImage,
      category: product.category || 'Indoor Plants',
    },
  };
};

const attachProductsToWishlist = async (wishlistItems) => {
  const productIds = [...new Set((wishlistItems || []).map((item) => item.product_id).filter(Boolean))];
  if (!productIds.length) return wishlistItems || [];

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds);

  if (error) throw error;

  const productsById = new Map((products || []).map((product) => [String(product.id), product]));
  return wishlistItems.map((item) => ({
    ...item,
    product: productsById.get(String(item.product_id)) || null,
  }));
};

export const WishlistProvider = ({ children }) => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectToLogin = useCallback(() => {
    navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
  }, [location.pathname, location.search, navigate]);

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('wishlist')
        .select('id, product_id')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (fetchError) throw fetchError;
      const wishlistWithProducts = await attachProductsToWishlist(data || []);
      setItems(wishlistWithProducts.map(normalizeWishlistItem));
    } catch (err) {
      setError(err.message || 'Could not load wishlist.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const productIds = useMemo(() => new Set(items.map((item) => String(item.productId))), [items]);

  const isWishlisted = useCallback((productId) => productIds.has(String(productId)), [productIds]);

  const addToWishlist = useCallback(async (product) => {
    if (!userId) {
      redirectToLogin();
      return { success: false, requiresAuth: true };
    }

    const productId = product?.id || product?.productId;
    if (!productId) return { success: false, error: 'Missing product id.' };

    try {
      const { error: insertError } = await supabase
        .from('wishlist')
        .upsert({
          user_id: userId,
          product_id: productId,
        }, { onConflict: 'user_id,product_id' });

      if (insertError) throw insertError;
      await fetchWishlist();
      return { success: true };
    } catch (err) {
      setError(err.message || 'Could not save wishlist item.');
      return { success: false, error: err.message };
    }
  }, [fetchWishlist, redirectToLogin, userId]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!userId) {
      redirectToLogin();
      return { success: false, requiresAuth: true };
    }

    try {
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (deleteError) throw deleteError;
      setItems((current) => current.filter((item) => String(item.productId) !== String(productId)));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Could not remove wishlist item.');
      return { success: false, error: err.message };
    }
  }, [redirectToLogin, userId]);

  const toggleWishlist = useCallback(async (product) => {
    const productId = product?.id || product?.productId;
    if (!productId) return { success: false, error: 'Missing product id.' };

    if (isWishlisted(productId)) {
      return removeFromWishlist(productId);
    }
    return addToWishlist(product);
  }, [addToWishlist, isWishlisted, removeFromWishlist]);

  const value = useMemo(() => ({
    items,
    products: items.map((item) => item.product),
    count: items.length,
    loading,
    error,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist,
  }), [addToWishlist, error, fetchWishlist, isWishlisted, items, loading, removeFromWishlist, toggleWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
