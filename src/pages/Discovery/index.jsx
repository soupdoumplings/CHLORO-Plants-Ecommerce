import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import DiscoveryHero from './DiscoveryHero';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import Newsletter from './Newsletter';
import Footer from '../../components/Footer';
import { supabase } from '../../supabase';

const categoryMap = {
  'All Objects': null,
  'Rare Plants': ['Rare Foliage', 'Succulents', 'Large Scale', 'Fresh Cut'],
  'Ceramics': ['Studio Ceramics'],
  'Tools': ['Heirloom Tools', 'Copperware'],
  'Care': ['Living Ecosystem'],
};

const DiscoveryPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Objects');
  const [activeSort, setActiveSort] = useState('Latest');
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Assuming all fetched products go into the "All Objects" category default.
      // You should eventually relate with Category UUIDs, but for now we map them simply.
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setAllProducts(data.map(p => ({
            ...p,
            id: p.id,
            name: p.name,
            price: `रू ${Number(p.price).toFixed(2)}`,
            rawPrice: Number(p.price),
            image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80',
            // Default category map to keep filters working if Categories are not fully built
            category: 'Rare Foliage'
        })));
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];
    const allowed = categoryMap[activeCategory];
    if (allowed) {
      items = items.filter((p) => allowed.includes(p.category));
    }
    if (activeSort === 'Price: Low to High') {
      items.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (activeSort === 'Price: High to Low') {
      items.sort((a, b) => b.rawPrice - a.rawPrice);
    }
    return items;
  }, [allProducts, activeCategory, activeSort]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F9F7F2] flex flex-col"
    >
      <Navbar />
      <main className="flex-grow">
        <DiscoveryHero />
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeSort={activeSort}
          onSortChange={setActiveSort}
        />
        <ProductGrid products={filteredProducts} />
        <Newsletter />
      </main>
      <Footer />
    </motion.div>
  );
};

export default DiscoveryPage;
