import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { supabase } from '../../supabase';
import { getProductImage } from '../../lib/localImages';

const CartCrossSell = ({ onAdd }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DYNAMIC FIX: Fetches real "Care Tools" inventory instead of using placeholders.
    // This ensures that "Add to Bag" works with actual product IDs in the database.
    const fetchCrossSell = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'Care Tools')
          .eq('is_active', true)
          .limit(1)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching cross-sell product:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrossSell();
  }, []);

  if (loading || !product) return null;

  const price = Number(product.price || 0);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 lg:mt-20 bg-[#F3F1EA] p-8 sm:p-10 lg:p-14 flex flex-col sm:flex-row gap-8 lg:gap-14 items-center group/crosssell"
    >
      {/* Product Image Frame */}
      <div className="w-full sm:w-[220px] aspect-square shrink-0 bg-[#E6E4DC] relative overflow-hidden shadow-inner border border-[#11110E]/5">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/crosssell:scale-105"
        />
      </div>

      {/* Copy Area */}
      <div className="flex-1 flex flex-col justify-center w-full">
        <p className="font-label text-[9px] tracking-[0.2em] uppercase text-[#4A4A4A] italic font-medium mb-3">
          Complete the Ritual
        </p>
        <h3 className="font-headline text-[24px] lg:text-[28px] text-[#1A1A1A] mb-4 leading-tight">
          {product.name}
        </h3>
        <p className="font-body text-[13px] lg:text-[14px] leading-[1.65] text-[#4A4A4A] max-w-[380px] mb-8 line-clamp-2">
          {product.description}
        </p>
        <button
          onClick={() => onAdd(product)}
          className="flex items-center gap-2 font-label text-[10px] tracking-[0.15em] uppercase text-[#C5A059] hover:text-[#1A1A1A] font-semibold transition-colors w-fit group"
        >
          Add to Bag — रू {price.toLocaleString('en-NP')}
          <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1.5 inline-block">
            arrow_right_alt
          </span>
        </button>
      </div>
    </Motion.div>
  );
};

export default CartCrossSell;
