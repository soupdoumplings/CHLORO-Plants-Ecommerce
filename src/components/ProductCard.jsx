import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
    >
      <div className="aspect-[4/5] overflow-hidden bg-[#efeee6] mb-8 relative">
        <motion.img 
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
        {/* Hover View Label */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between overflow-hidden">
            <motion.span 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileHover={{ opacity: 1, y: 0, scale: 1 }}
              className="text-[9px] font-bold tracking-[0.3em] uppercase bg-white/95 backdrop-blur-md text-[#31332c] px-6 py-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
            >
              View Details
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="material-symbols-outlined text-white text-base opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75"
            >
              shopping_bag
            </motion.span>
        </div>
      </div>
      
      <div className="flex justify-between items-start group-hover:px-1 transition-all">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-1.5"
        >
          <h3 className="font-headline text-2xl mb-1 text-[#31332c] group-hover:text-[#785a1a] transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="font-label text-[9px] uppercase tracking-widest text-[#797c73] font-bold">
            {product.category || "Kathmandu selection"}
          </p>
        </motion.div>
        <span className="font-serif text-xl font-medium text-[#31332c]">
          रू {product.price}
        </span>
      </div>
    </motion.div>
  );
};

export default ProductCard;
