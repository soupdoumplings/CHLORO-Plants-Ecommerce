import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';

const FEATURED_PRODUCTS = [
  // ... (keeping same products)
  { 
    id: 1, 
    name: "Monstera Deliciosa", 
    price: "4,500", 
    category: "Kathmandu Indoor Selection", 
    image: "/orchid_macro_1_1775451056219.png" 
  },
  { 
    id: 2, 
    name: "Sansevieria 'Laurentii'", 
    price: "2,200", 
    category: "Low Maintenance Specimen", 
    image: "/bougainvillea_macro_1_1775451075940.png" 
  },
  { 
    id: 3, 
    name: "Ficus Lyrata", 
    price: "8,900", 
    category: "Statement Foliage", 
    image: "/orchid_macro_2_droplets_1775451100302.png" 
  }
];

const Archive = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-32 px-12 bg-[#fbf9f4]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8"
        >
          <div className="max-w-2xl text-left">
            <h2 className="font-headline text-5xl md:text-6xl mb-8 leading-tight text-[#31332c]">Personalized Archive Recommendations</h2>
            <p className="font-body text-[#5e6058] leading-relaxed text-lg tracking-wide opacity-90 mb-4">
              Curated by our proprietary growth algorithms, these specimens are selected based on your local micro-climate in the Kathmandu Valley.
            </p>
          </div>
          <motion.a 
            whileHover={{ x: 5 }}
            className="font-label text-[10px] uppercase font-bold tracking-[0.25em] border-b border-[#31332c] pb-1.5 mb-2 hover:opacity-50 transition-all text-[#31332c] flex items-center gap-3 shrink-0" 
            href="#"
          >
             View Full Collection 
             <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </motion.a>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12"
        >
          {FEATURED_PRODUCTS.map((p) => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </section>
  );
};

export default Archive;
