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
import SaleBanner from '../../components/SaleBanner';

// Mock sale end date (3 days from now)
const SALE_ENDS_AT = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();


const DiscoveryPage = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const searchQuery = searchParams.get('q') || '';
  const [activeCategory, setActiveCategory] = useState('All Objects');
  const [activeSort, setActiveSort] = useState('Latest');
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setAllProducts(data.map((p, index) => {
            // Mock sale data for demonstration: put the first two items on sale
            const is_on_sale = index < 2;
            const discount_price = is_on_sale ? `${(Number(p.price) * 0.8).toFixed(2)}` : null;

            return {
            ...p,
            id: p.id,
            name: p.name,
            price: `${Number(p.price).toFixed(2)}`,
            rawPrice: Number(p.price),
            image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80',
            category: p.category || 'Indoor Plants',
            tags: p.tags || [],
            is_featured: p.is_featured || false,
            season: p.season || 'All Year',
            is_on_sale,
            discount_price
        }}));
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];

    // Priority 0: Live search query from navbar (?q=)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
      return items;
    }

    // Priority 1: Filter by Tags (from Homepage links like ?filter=Pet-Friendly)
    if (filterParam) {
      items = items.filter(p => p.tags && p.tags.includes(filterParam));
    }

    // Priority 2: Filter by Primary Category (Tabs)
    if (activeCategory !== 'All Objects') {
      items = items.filter((p) => p.category === activeCategory);
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
  }, [allProducts, activeCategory, activeSort, filterParam, searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F9F7F2] flex flex-col"
    >
      <Navbar />
      <SaleBanner saleEndsAt={SALE_ENDS_AT} />
      <main className="flex-grow">
        <DiscoveryHero />

        {/* Active search query banner */}
        {searchQuery.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-14 pt-10 pb-2"
          >
            <div className="flex items-center justify-between border-b border-[#1D241F]/10 pb-5">
              <div>
                <p className="font-label text-[9px] uppercase tracking-[0.25em] text-[#1D241F]/40">Search Results</p>
                <h2 className="font-headline text-[32px] text-[#1D241F] mt-1">"{searchQuery}"</h2>
              </div>
              <p className="font-label text-[10px] uppercase tracking-[0.15em] text-[#1D241F]/50">
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}

        {/* Category filter — hidden when searching */}
        {!searchQuery.trim() && (
          <CategoryFilter
            categories={['All Objects', ...new Set(allProducts.map(p => p.category).filter(Boolean))]}
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
        )}

        <ProductGrid products={filteredProducts} />
        <Newsletter />
      </main>
      <Footer />
    </motion.div>
  );
};

export default DiscoveryPage;
