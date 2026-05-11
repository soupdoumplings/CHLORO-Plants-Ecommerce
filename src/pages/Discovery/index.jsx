import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import DiscoveryHero from './DiscoveryHero';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import Newsletter from './Newsletter';
import Footer from '../../components/Footer';
import SaleBanner from '../../components/SaleBanner';
import { supabase } from '../../supabase';
import { fallbackCatalogImage } from '../../lib/localImages';
import { formatRupees, getEffectivePrice, hasActiveSale } from '../../lib/pricing';
import { getProductType, productMatchesType, productTypeLabels } from '../../lib/productTypes';

const coreCategories = [
  productTypeLabels.all,
  productTypeLabels.plants,
  productTypeLabels.care,
  productTypeLabels.gifts,
];

const DiscoveryPage = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const searchQuery = searchParams.get('q') || '';
  const [activeCategory, setActiveCategory] = useState(productTypeLabels.all);
  const [activeSort, setActiveSort] = useState('Latest');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const productsRef = useRef(null);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message || 'Could not load products.');
        setAllProducts([]);
      } else if (data) {
        setAllProducts(data.map(p => ({
            ...p,
            id: p.id,
            name: p.name,
            price: formatRupees(getEffectivePrice(p)),
            rawPrice: getEffectivePrice(p),
            originalPrice: Number(p.price),
            salePrice: hasActiveSale(p) ? Number(p.sale_price) : null,
            saleEndsAt: p.sale_ends_at,
            isOnSale: hasActiveSale(p),
            image: p.images && p.images.length > 0 ? p.images[0] : fallbackCatalogImage,
            category: p.category || 'Indoor Plants',
            tags: p.tags || [],
            type: getProductType(p),
            is_featured: p.is_featured || false,
            season: p.season || 'All Year'
        })));
      }

      setLoading(false);
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => (
    [
      ...coreCategories,
      ...new Set(
        allProducts
          .map(p => p.category)
          .filter((category) => category && !coreCategories.includes(category))
      ),
    ]
  ), [allProducts]);

  const categoryCounts = useMemo(() => (
    allProducts.reduce((counts, product) => {
      counts[productTypeLabels.all] = (counts[productTypeLabels.all] || 0) + 1;
      counts[product.type] = (counts[product.type] || 0) + 1;
      if (product.category !== product.type) {
        counts[product.category] = (counts[product.category] || 0) + 1;
      }
      return counts;
    }, {})
  ), [allProducts]);

  const filteredProducts = useMemo(() => {
    let items = [...allProducts];

    // Priority 0: Live search query from navbar (?q=)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.type && p.type.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.info && p.info.toLowerCase().includes(q)) ||
        (p.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
      return items;
    }

    // Priority 1: Filter by Tags (from Homepage links like ?filter=Pet-Friendly)
    if (filterParam) {
      items = items.filter((p) => (
        p.type === filterParam
        || p.category === filterParam
        || (p.tags && p.tags.includes(filterParam))
      ));
    }

    // Priority 2: Filter by Primary Category (Tabs)
    if (activeCategory !== productTypeLabels.all) {
      items = coreCategories.includes(activeCategory)
        ? items.filter((p) => productMatchesType(p, activeCategory))
        : items.filter((p) => p.category === activeCategory);
    }

    if (activeSort === 'Featured First') {
      items.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
    } else if (activeSort === 'Price: Low to High') {
      items.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (activeSort === 'Price: High to Low') {
      items.sort((a, b) => b.rawPrice - a.rawPrice);
    } else {
      items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
    return items;
  }, [allProducts, activeCategory, activeSort, filterParam, searchQuery]);

  const featuredProduct = useMemo(() => (
    filteredProducts.find((product) => product.is_featured)
    || filteredProducts[0]
    || allProducts.find((product) => product.is_featured)
    || allProducts[0]
  ), [allProducts, filteredProducts]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#F9F7F2] flex flex-col"
    >
      <Navbar />
      <main className="flex-grow">
        <DiscoveryHero
          featuredProduct={featuredProduct}
          totalCount={allProducts.length}
          onBrowse={scrollToProducts}
        />
        <SaleBanner />

        {/* Active search query banner */}
        {searchQuery.trim() && (
          <Motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full page-shell page-gutter pt-10 pb-2"
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
          </Motion.div>
        )}

        {/* Category filter — hidden when searching */}
        {!searchQuery.trim() && (
          <CategoryFilter
            categories={categories}
            categoryCounts={categoryCounts}
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
            totalCount={allProducts.length}
            loading={loading}
          />
        )}

        <section ref={productsRef} className="scroll-mt-[100px]">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            activeCategory={searchQuery.trim() ? 'Search Results' : activeCategory}
          />
        </section>
        <Newsletter />
      </main>
      <Footer />
    </Motion.div>
  );
};

export default DiscoveryPage;
