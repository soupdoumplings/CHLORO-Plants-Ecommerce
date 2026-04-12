import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FicusHero from './FicusHero';
import CareSection from './CareSection';
import HeritageSection from './HeritageSection';
import AnatomySection from './AnatomySection';
import { supabase } from '../../supabase';

const CataloguePage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        let query = supabase.from('products').select('*');
        
        if (id) {
          // Fetch specific product by ID
          query = query.eq('id', id).single();
        } else {
          // Fetch the latest product as default
          query = query.order('created_at', { ascending: false }).limit(1).single();
        }

        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load plant data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-6 mt-32">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-t-2 border-[#785A1A] rounded-full"
          />
          <p className="font-label text-[11px] tracking-[0.2em] uppercase text-[#5E6058] font-bold">Loading Specimen Data</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center">
        <Navbar />
        <div className="flex flex-col items-center gap-6 mt-48 px-6 text-center">
          <span className="material-symbols-outlined text-[48px] text-[#B1B3A9]">psychiatry</span>
          <h2 className="font-headline text-4xl text-[#31332C]">Specimen Not Found</h2>
          <p className="font-body text-[#5E6058] max-w-md">
            {error || 'No plant data available. Add a plant from the admin panel to see it here.'}
          </p>
          <a href="/discovery" className="mt-4 bg-[#5F5E5E] text-[#FAF7F6] px-10 py-4 font-label text-[11px] tracking-[0.2em] uppercase hover:bg-[#31332C] transition-all shadow-lg">
            Browse Discovery
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative"
    >
      <Navbar />
      
      <main className="w-full max-w-[1920px] mx-auto flex-grow mt-[81px] px-6 md:px-12 pt-12">
        <FicusHero product={product} />
        <CareSection product={product} />
        <HeritageSection product={product} />
        <AnatomySection product={product} />
      </main>

      <Footer />
    </motion.div>
  );
};

export default CataloguePage;
