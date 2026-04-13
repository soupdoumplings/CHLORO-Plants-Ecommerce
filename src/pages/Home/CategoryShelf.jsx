import React from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    id: 1,
    title: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2574&auto=format&fit=crop',
    link: '/discovery'
  },
  {
    id: 2,
    title: 'Low-Maintenance',
    image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?q=80&w=2691&auto=format&fit=crop',
    link: '/discovery'
  },
  {
    id: 3,
    title: 'Pet-Friendly',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop', // French bulldog image
    link: '/discovery'
  },
  {
    id: 4,
    title: 'Gifts',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop',
    link: '/discovery'
  }
];

const CategoryShelf = () => {
  return (
    <section className="w-full py-32 px-12 bg-[#FBF9F4]">
      <div className="max-w-[1440px] mx-auto">
        <div className="space-y-4 mb-20 text-left">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#785A1A] font-bold inline-block"
          >
            Shop by Category
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline text-7xl md:text-8xl tracking-tighter text-[#31332C] leading-none"
          >
            Find your perfect plant
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer relative aspect-[14/19] overflow-hidden"
              onClick={() => window.location.href = cat.link}
            >
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-white font-headline text-3xl md:text-4xl tracking-tight mb-4 group-hover:scale-[1.02] transition-transform origin-left">
                  {cat.title}
                </h3>
                <div className="w-10 h-[1px] bg-white opacity-40 group-hover:w-full group-hover:opacity-100 transition-all duration-700"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShelf;
