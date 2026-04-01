import React, { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  'All Objects',
  'Rare Plants',
  'Ceramics',
  'Tools',
  'Care',
];

const sortOptions = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Popular'];

const CategoryFilter = ({ activeCategory, onCategoryChange, activeSort, onSortChange }) => {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1440px] mx-auto px-10 lg:px-14 py-10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCategoryChange(cat)}
              className={`px-5 py-2 text-[11px] tracking-[0.06em] uppercase font-medium border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-transparent text-[#4A4A4A] border-[#B0B0A8]/40 hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 font-label text-[11px] tracking-[0.06em] uppercase text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors"
          >
            <span className="text-[#B0B0A8]">Showing 24 results</span>
            <span className="mx-2 text-[#B0B0A8]">·</span>
            <span className="font-semibold">Sort by {activeSort}</span>
            <motion.span
              animate={{ rotate: sortOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="material-symbols-outlined text-[16px] inline-block"
            >
              expand_more
            </motion.span>
          </button>

          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-2 bg-white border border-[#B0B0A8]/20 shadow-lg shadow-black/5 z-30 min-w-[180px]"
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSortChange(opt);
                    setSortOpen(false);
                  }}
                  className={`block w-full text-left px-5 py-3 font-label text-[11px] tracking-[0.04em] uppercase transition-colors ${
                    activeSort === opt
                      ? 'text-[#1A1A1A] bg-[#F3F1EA] font-semibold'
                      : 'text-[#4A4A4A] hover:bg-[#F3F1EA]/50 hover:text-[#1A1A1A]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryFilter;
