import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';

const sortOptions = ['Latest', 'Price: Low to High', 'Price: High to Low', 'Featured First'];

const CategoryFilter = ({
  categories = ['All Objects'],
  categoryCounts = {},
  activeCategory,
  onCategoryChange,
  activeSort,
  onSortChange,
  productCount,
  totalCount,
  loading,
}) => {
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <Motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-[#F8F6F1]"
    >
      <div className="page-shell page-gutter py-12">
        <div className="border-y border-[#11110E]/12 py-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr_auto] lg:items-start">
            <div>
              <p className="font-label text-[9px] font-bold uppercase tracking-[0.32em] text-[#6D695F]">
                Filters
              </p>
              <h2 className="mt-3 font-headline text-[34px] leading-none text-[#11110E]">
                Shop Products
              </h2>
              <p className="mt-4 font-label text-[9px] uppercase tracking-[0.18em] text-[#6D695F]">
                {loading ? 'Loading products' : `${productCount} of ${totalCount || productCount} products shown`}
              </p>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#11110E]/12 pb-3">
                <span className="font-label text-[9px] uppercase tracking-[0.28em] text-[#6D695F]">Shop Categories</span>
                <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#11110E]/35">Live Inventory</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, i) => (
                  <Motion.button
                    key={cat}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onCategoryChange(cat)}
                    className={`flex items-center gap-2 border px-4 py-2.5 transition-colors ${
                      activeCategory === cat
                        ? 'border-[#11110E] bg-[#11110E] text-[#FBF9F4]'
                        : 'border-[#11110E]/14 bg-[#FFFEFA] text-[#4F4B43] hover:border-[#11110E]/45'
                    }`}
                  >
                    <span className="font-label text-[8px] font-bold uppercase tracking-[0.17em]">{cat}</span>
                    <span className="font-body text-[11px] opacity-65">{categoryCounts[cat] || 0}</span>
                  </Motion.button>
                ))}
              </div>
            </div>

            <div className="relative lg:min-w-[220px]">
              <p className="mb-4 border-b border-[#11110E]/12 pb-3 font-label text-[9px] uppercase tracking-[0.28em] text-[#6D695F]">
                Sort By
              </p>
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="flex w-full items-center justify-between border border-[#11110E]/14 bg-[#FFFEFA] px-4 py-3 text-left transition-colors hover:border-[#11110E]/45"
              >
                <span className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#11110E]">
                  {activeSort}
                </span>
                <Motion.span
                  animate={{ rotate: sortOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="material-symbols-outlined text-[17px] text-[#6D695F]"
                >
                  expand_more
                </Motion.span>
              </button>

              {sortOpen && (
                <Motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-0 top-full z-30 mt-2 w-full border border-[#11110E]/14 bg-[#FFFEFA] shadow-[0_18px_50px_rgba(17,17,14,0.12)]"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onSortChange(opt);
                        setSortOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left font-label text-[9px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        activeSort === opt
                          ? 'bg-[#11110E] text-[#FBF9F4]'
                          : 'text-[#4F4B43] hover:bg-[#F0EEE7] hover:text-[#11110E]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </Motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Motion.section>
  );
};

export default CategoryFilter;
