import React, { useState } from 'react';

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
    <div className="w-full max-w-[1440px] mx-auto px-10 lg:px-14 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-5 py-2 text-[11px] tracking-[0.06em] uppercase font-medium border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-transparent text-[#4A4A4A] border-[#B0B0A8]/40 hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
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
            <span className="material-symbols-outlined text-[16px]">
              {sortOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-[#B1B3A9]/20 shadow-lg shadow-black/5 z-30 min-w-[180px]">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
