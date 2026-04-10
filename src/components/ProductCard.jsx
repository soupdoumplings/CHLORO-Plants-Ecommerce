import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../lib/CartContext';

const ProductCard = ({ product, delay = 0 }) => {
  const { addToBag } = useCart();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer block h-full flex flex-col"
    >
      <div className="relative aspect-[3/4] mb-8 overflow-hidden bg-[#e2e3d9]/30">
        <motion.img 
          initial={{ scale: 1.05 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0" 
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
        
        {/* Hover action */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex justify-center">
            <motion.button 
              whileHover={{ y: -2, backgroundColor: '#31332c', color: '#fbf9f4' }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                addToBag(product);
              }}
              className="bg-white/90 backdrop-blur-sm px-8 py-3 w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#31332c] shadow-lg"
            >
              Add to Bag
            </motion.button>
        </div>
      </div>
      
      <div className="px-2 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-headline text-2xl text-[#31332c] group-hover:text-[#785a1a] transition-colors">{product.name}</h3>
           <p className="font-serif text-[#31332c] text-lg mt-1">रू {product.price}</p>
        </div>
        <div className="flex items-center gap-3 opacity-60 mt-auto pt-4">
           <span className="w-1.5 h-1.5 rounded-full bg-[#785a1a]"></span>
           <p className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-[#5e6058]">{product.category}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
