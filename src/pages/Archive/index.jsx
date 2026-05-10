import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ArchiveHeader from './ArchiveHeader';
import BroadcastWidget from './BroadcastWidget';
import MetricsGrid from './MetricsGrid';
import OrdersTable from './OrdersTable';
import StockInfoBar from './StockInfoBar';
import InventoryTable from './InventoryTable';
import SystemLog from './SystemLog';
import { supabase } from '../../supabase';

const ArchivePage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err.message);
      setOrders([]);
      setOrdersError(err.message || 'Could not load customer orders.');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative"
    >
      <Navbar />
      <main className="w-full page-shell flex-grow mt-[82px] page-gutter pt-16">
        <ArchiveHeader />
        <BroadcastWidget />
        <MetricsGrid products={products} orders={orders} loading={loading || ordersLoading} />
        <OrdersTable orders={orders} loading={ordersLoading} error={ordersError} onRefresh={fetchOrders} />
        <StockInfoBar products={products} loading={loading} />
        <InventoryTable products={products} loading={loading} onRefresh={fetchProducts} />
        <SystemLog orders={orders} loading={ordersLoading} />
      </main>

      <Footer />


    </Motion.div>
  );
};

export default ArchivePage;
