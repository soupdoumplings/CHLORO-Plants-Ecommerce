import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import DiscoveryHero from './DiscoveryHero';
import CategoryFilter from './CategoryFilter';
import ProductGrid from './ProductGrid';
import Newsletter from './Newsletter';
import Footer from '../../components/Footer';
import discoveryProducts from './discoveryProducts';

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

  const filteredProducts = useMemo(() => {
    let items = [...discoveryProducts];

    // Filter by category
    const allowed = categoryMap[activeCategory];
    if (allowed) {
      items = items.filter((p) => allowed.includes(p.category));
    }

    // Sort
    if (activeSort === 'Price: Low to High') {
      items.sort(
        (a, b) =>
          parseFloat(a.price.replace(/[$,]/g, '')) -
          parseFloat(b.price.replace(/[$,]/g, ''))
      );
    } else if (activeSort === 'Price: High to Low') {
      items.sort(
        (a, b) =>
          parseFloat(b.price.replace(/[$,]/g, '')) -
          parseFloat(a.price.replace(/[$,]/g, ''))
      );
    }

    return items;
  }, [activeCategory, activeSort]);

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
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
    </div>
  );
};

export default DiscoveryPage;
