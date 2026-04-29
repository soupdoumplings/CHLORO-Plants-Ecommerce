import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
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

const HOME_CATEGORY_PLANTS = {
  'New Arrivals': ['Peace Lily', 'Lavender'],
  'Low-Maintenance': ['Monstera Albo'],
  'Pet-Friendly': ['Money Tree', 'Orchid'],
  'Gifts': ['salsa'],
};

const DiscoveryPage = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const [activeCategory, setActiveCategory] = useState('All Objects');
  const [activeSort, setActiveSort] = useState('Latest');
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setAllProducts(data.map(p => ({
            ...p,
            id: p.id,
            name: p.name,
            price: `रू ${Number(p.price).toFixed(2)}`,
            rawPrice: Number(p.price),
            image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80',
            category: 'Rare Foliage',
            is_featured: p.is_featured || false,
            season: p.season || 'All Year'
        })));
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];

    // Priority 1: Filter from Home Page Categories (via URL param)
    if (filterParam && HOME_CATEGORY_PLANTS[filterParam]) {
      const allowedNames = HOME_CATEGORY_PLANTS[filterParam];
      items = items.filter(p => allowedNames.some(name => p.name.toLowerCase().includes(name.toLowerCase())));
    }

    // Priority 2: Filter from Discovery Page Tabs
    const allowed = categoryMap[activeCategory];
    if (allowed) {
      items = items.filter((p) => allowed.includes(p.category));
    }

    // Default top-level sort: Featured first
    items.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0; 
    });

    if (activeSort === 'Price: Low to High') {
      items.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (activeSort === 'Price: High to Low') {
      items.sort((a, b) => b.rawPrice - a.rawPrice);
    }
    return items;
  }, [allProducts, activeCategory, activeSort, filterParam]);

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
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            if (filterParam) {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('filter');
              window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
            }
          }}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          productCount={filteredProducts.length}
        />
        <ProductGrid products={filteredProducts} />
        <Newsletter />
      </main>
      <Footer />
    </motion.div>
  );
};

export default DiscoveryPage;
