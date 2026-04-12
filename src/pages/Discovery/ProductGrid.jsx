import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const aspectMap = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[3/5]',
};

const DiscoveryProductCard = ({ product, index }) => {
  const aspect = aspectMap[product.aspect] || 'aspect-[4/5]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        delay: (index % 4) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover="hover"
      className="group"
    >
      <Link to={`/catalogue/${product.id}`} className="cursor-pointer block">
        {/* Image Container */}
        <div className={`${aspect} overflow-hidden bg-[#EDEBE4] relative mb-5`}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            variants={{ hover: { scale: 1.05 } }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Hover overlay tinted glass */}
          <motion.div
            initial={{ opacity: 0 }}
            variants={{ hover: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/[0.04]"
          />

          {/* View Product CTA - slides up from below the frame */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            variants={{ hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[max-content] bg-white/95 backdrop-blur-md px-6 py-2.5 shadow-sm"
          >
            <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#1A1A1A] font-semibold">
              View Details
            </span>
          </motion.div>

          {/* Badge */}
          {product.badge && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-4 left-4"
            >
              <span className="inline-block bg-[#2F4F4F] text-white font-label text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 font-medium">
                {product.badge}
              </span>
            </motion.div>
          )}
        </div>

        {/* Product Info */}
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
    </motion.div>
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
