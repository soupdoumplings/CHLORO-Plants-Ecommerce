import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('id, name, price, images, category');

      if (!error && data && isMounted) {
        setAllProducts(data.map((product) => ({
          ...product,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80',
          displayPrice: `NPR ${Number(product.price).toFixed(2)}`,
        })));
      }

      if (isMounted) setLoading(false);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ');
    return allProducts.filter((product) => {
      const target = `${product.name} ${product.category || ''}`.toLowerCase();
      return searchTerms.every((term) => target.includes(term));
    }).slice(0, 6);
  }, [allProducts, query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/discovery?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleResultClick = (id) => {
    navigate(`/catalogue/${id}`);
    onClose();
  };

  const handleViewAll = () => {
    navigate(`/discovery?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <Motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#0F3A3A]/60 backdrop-blur-sm z-[99]"
      />

      <Motion.div
        key="panel"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] bg-[#0D3535]/95 backdrop-blur-md border-b border-[#FBF9F4]/10 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-4 px-8 md:px-16 h-[82px]">
          <span className="material-symbols-outlined text-[#FBF9F4]/50 text-[22px] shrink-0">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search plants, ceramics, tools..."
            className="flex-1 bg-transparent border-none outline-none font-headline text-[22px] md:text-[28px] text-[#FBF9F4] placeholder:text-[#FBF9F4]/25 leading-none"
          />
          {loading && (
            <Motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="material-symbols-outlined text-[#C5A059] text-[18px] animate-spin shrink-0"
            >
              progress_activity
            </Motion.span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="material-symbols-outlined text-[#FBF9F4]/50 hover:text-[#FBF9F4] transition-colors text-[22px] shrink-0"
          >
            close
          </button>
        </form>

        <div className="mx-8 md:mx-16 h-px bg-[#FBF9F4]/8" />

        <AnimatePresence mode="wait">
          {query.trim() && (
            <Motion.div
              key="results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-8 md:px-16 py-5 max-h-[420px] overflow-y-auto">
                {results.length > 0 ? (
                  <>
                    <p className="font-label text-[9px] uppercase tracking-[0.25em] text-[#FBF9F4]/35 mb-4">
                      {results.length} result{results.length !== 1 ? 's' : ''} found
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {results.map((item, index) => (
                        <Motion.button
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.04 }}
                          onClick={() => handleResultClick(item.id)}
                          className="flex items-center gap-4 p-3 rounded-sm border border-[#FBF9F4]/8 bg-[#FBF9F4]/4 hover:bg-[#FBF9F4]/10 hover:border-[#C5A059]/40 transition-all duration-200 text-left group"
                        >
                          <div className="w-14 h-14 shrink-0 overflow-hidden bg-[#1E5B5B]/40">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-headline text-[16px] text-[#FBF9F4] leading-snug truncate group-hover:text-[#C5A059] transition-colors">
                              {item.name}
                            </p>
                            <p className="font-label text-[9px] tracking-[0.12em] uppercase text-[#FBF9F4]/40 mt-0.5">
                              {item.category || 'Plant'}
                            </p>
                            <p className="font-headline text-[14px] text-[#C5A059] mt-1">
                              {item.displayPrice}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-[#FBF9F4]/20 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all text-[18px] shrink-0">
                            arrow_forward
                          </span>
                        </Motion.button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleViewAll}
                      className="mt-4 flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.2em] text-[#C5A059] hover:text-[#FBF9F4] transition-colors"
                    >
                      View all results for "{query}"
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </>
                ) : !loading ? (
                  <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-6"
                  >
                    <p className="font-headline text-[22px] text-[#FBF9F4]/30">
                      No results for "{query}"
                    </p>
                    <p className="font-label text-[10px] uppercase tracking-[0.18em] text-[#FBF9F4]/20 mt-2">
                      Try a different search term
                    </p>
                  </Motion.div>
                ) : null}
              </div>

              <div className="flex items-center gap-6 px-8 md:px-16 py-3 border-t border-[#FBF9F4]/6">
                <span className="font-label text-[9px] uppercase tracking-[0.18em] text-[#FBF9F4]/20 flex items-center gap-1.5">
                  <kbd className="bg-[#FBF9F4]/10 px-1.5 py-0.5 rounded text-[9px]">Enter</kbd> to see all results
                </span>
                <span className="font-label text-[9px] uppercase tracking-[0.18em] text-[#FBF9F4]/20 flex items-center gap-1.5">
                  <kbd className="bg-[#FBF9F4]/10 px-1.5 py-0.5 rounded text-[9px]">Esc</kbd> to close
                </span>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.div>
    </AnimatePresence>
  );
};

export default SearchOverlay;
