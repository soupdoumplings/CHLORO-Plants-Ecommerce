import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../lib/CartContext';


const aspectMap = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[3/5]',
};

const DiscoveryProductCard = ({ product, index }) => {
  const aspect = aspectMap[product.aspect] || 'aspect-[4/5]';
  const { addToBag } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToBag = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await addToBag(product);
      if (result?.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      } else if (result?.error) {
        alert(result.error);
      }
    } catch (err) {
      console.error('Add to bag failed:', err);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hover"
      className="group relative"
    >
      <Link to={`/catalogue/${product.id}`} className="cursor-pointer block">
        {/* Image Container */}
        <div className={`${aspect} relative mb-5 overflow-hidden bg-[#EDEBE4]`}>
          <Motion.img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            variants={{ hover: { scale: 1.05 } }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Hover overlay tinted glass */}
          <Motion.div
            initial={{ opacity: 0 }}
            variants={{ hover: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/[0.04]"
          />
        </div>
      </Link>

        {/* View Product CTA - slides up from below the frame */}
        <Motion.div
          initial={{ opacity: 0, y: 15 }}
          variants={{ hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[max-content] flex gap-2 z-10"
        >
          <Link to={`/catalogue/${product.id}`} className="bg-white/95 backdrop-blur-md px-6 py-2.5 shadow-sm flex items-center justify-center">
            <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#1A1A1A] font-semibold">
              View Details
            </span>
          </Link>
          <button
            type="button"
            onClick={handleAddToBag}
            className="bg-[#2F4F4F] text-white px-6 py-2.5 shadow-sm flex items-center justify-center hover:bg-[#1A2F2F] transition-colors"
          >
            <span className="font-label text-[9px] tracking-[0.15em] uppercase font-semibold">
              {added ? 'Added' : 'Add to Bag'}
            </span>
          </button>
        </Motion.div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <Motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute top-4 left-4 flex flex-col items-start gap-1.5 pointer-events-none"
          >
            {product.tags.slice(0, 2).map((tag) => (
              <span key={`${product.id}-${tag}`} className="inline-block bg-[#0D3535] text-[#FBF9F4] font-label text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 font-medium shadow-sm max-w-[150px] truncate">
                {tag}
              </span>
            ))}
          </Motion.div>
        )}
      {/* Product Info */}
      <Link to={`/catalogue/${product.id}`} className="block">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-headline text-[18px] text-[#1A1A1A] leading-snug group-hover:text-[#C5A059] transition-colors duration-300">
              {product.name}
            </h3>
            <p className="font-label text-[9px] tracking-[0.12em] uppercase text-[#6B6B6B] font-medium">
              {product.category}
            </p>
          </div>
          <span className="font-headline text-[16px] text-[#1A1A1A] whitespace-nowrap pt-0.5">
            {product.price}
          </span>
        </div>
      </Link>
    </Motion.div>
  );
};

const ProductGrid = ({ products }) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-10 lg:px-14 pb-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
        {products.map((product, i) => (
          <DiscoveryProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
