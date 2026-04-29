import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ArchiveHeader from './ArchiveHeader';
import MetricsGrid from './MetricsGrid';
import InventoryTable from './InventoryTable';
import SystemLog from './SystemLog';
import { supabase } from '../../supabase';

const ArchivePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative"
    >
      <Navbar />
      
      <main className="w-full max-w-[1920px] mx-auto flex-grow mt-[82px] px-6 md:px-12 pt-16">
        <ArchiveHeader />
        <MetricsGrid products={products} loading={loading} />
        <InventoryTable products={products} loading={loading} onRefresh={fetchProducts} />
        <SystemLog />
      </main>

      <Footer />
      

    </motion.div>
  );
};

export default ArchivePage;
