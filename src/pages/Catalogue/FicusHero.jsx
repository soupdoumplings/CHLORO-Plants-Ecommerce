import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../lib/CartContext';

const FicusHero = () => {
  const { addToBag } = useCart();
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-32 pt-16">
      {/* Left Column: Identity */}
      <motion.div 
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-5 lg:sticky lg:top-32 order-2 lg:order-1 text-left"
      >
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-label text-[10px] tracking-[0.2rem] uppercase text-[#785A1A] mb-6 font-bold"
          >
            Specimen No. 842
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline text-8xl md:text-[9.5rem] leading-[0.8] mb-12 tracking-tighter text-[#31332C]"
          >
            Ficus <br /> Lyrata
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[#5E6058] leading-relaxed mb-12 max-w-sm text-lg opacity-90 transition-opacity hover:opacity-100"
          >
              Known colloquially as the Fiddle-Leaf Fig, this architectural masterpiece is defined by its dramatic, violin-shaped foliage and sculptural presence. A cornerstone of the curated interior.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 w-full"
          >
            <div>
              <p className="font-label text-[10px] tracking-[0.1rem] uppercase opacity-50 mb-2 font-black">Provenance</p>
              <p className="font-body text-sm italic text-[#31332C]">Western Africa, Tropical Lowland Rainforests</p>
            </div>
            
            <div className="pt-12 border-t border-[#B1B3A9]/20 flex justify-between items-end">
              <div>
                <p className="font-label text-[10px] tracking-[0.1rem] uppercase opacity-50 mb-2 font-black">Investment</p>
                <p className="font-headline text-4xl text-[#31332C]">रू 8,900</p>
              </div>
              <motion.button 
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addToBag({
                  id: 'ficus-lyrata-id', // Placeholder, ideally this would be dynamic from props
                  name: 'Ficus Lyrata',
                  price: 8900
                })}
                className="bg-[#5F5E5E] text-[#FAF7F6] px-12 py-5 font-label text-[11px] tracking-[0.2rem] uppercase hover:bg-[#31332C] transition-all shadow-2xl shadow-black/5 font-bold"
              >
                  Add to Bag
              </motion.button>
            </div>
          </motion.div>
      </motion.div>

      {/* Right Column: Visual Focus */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 order-1 lg:order-2"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F4ED]">
          <img 
            src="https://images.pexels.com/photos/6477994/pexels-photo-6477994.jpeg" 
            alt="Ficus Lyrata" 
            className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-transform duration-[10s] hover:scale-105" 
          />
          <motion.div 
            initial={{ opacity: 0, x: -30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-12 -left-12 hidden lg:block bg-white p-10 w-72 shadow-2xl border border-[#B1B3A9]/5"
          >
            <p className="font-body text-xs italic leading-relaxed text-[#5E6058] opacity-80">
              "The Lyrata requires patience and an understanding of light's gentle choreography. Focus on balance."
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FicusHero;
