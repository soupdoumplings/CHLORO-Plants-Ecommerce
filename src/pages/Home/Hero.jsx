import React from 'react';
import { motion } from 'framer-motion';
import Magnetic from '../../components/Magnetic';

const Hero = () => {
  return (
    <header className="relative w-full h-screen flex flex-col justify-center px-12 pt-20 overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img 
          src="https://images.pexels.com/photos/28449944/pexels-photo-28449944.jpeg" 
          alt="Himalayan Flora" 
          className="w-full h-full object-cover grayscale-[0.2] brightness-[0.9] transition-transform duration-[10s] hover:scale-105"
        />
      </motion.div>
      
      <div className="relative z-10 max-w-4xl text-left">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-label text-[11px] tracking-[0.25em] uppercase mb-4 text-white font-semibold"
        >
          The High-Altitude Collection
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-headline text-7xl md:text-[10rem] tracking-tighter leading-[0.85] text-white mb-10"
        >
          Himalayan <br /> 
          <span className="italic font-extralight opacity-95">Elegance.</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row gap-10 items-start md:items-center"
        >
          <Magnetic magnetism={15}>
            <motion.button 
              whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#31332c] px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#fbf9f4] transition-all shadow-xl shadow-black/10"
            >
              Explore the Archive
            </motion.button>
          </Magnetic>
          
          <div className="flex items-center gap-5 group cursor-pointer text-white">
            <Magnetic magnetism={20}>
              <motion.div 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,1)' }}
                className="w-14 h-14 border border-white/20 flex items-center justify-center transition-all duration-500 rounded-sm"
              >
                <span className="material-symbols-outlined text-white group-hover:text-[#31332c] transition-colors text-2xl">
                  camera
                </span>
              </motion.div>
            </Magnetic>
            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-white/60 font-bold">AI Powered</p>
              <p className="font-headline italic text-lg text-white">AI Diagnosis</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-12 flex items-center gap-4"
      >
        <motion.span 
          animate={{ height: [20, 40, 20] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] bg-white/40"
        />
        <span className="text-[9px] uppercase tracking-widest text-white/60 font-bold vertical-text">Scroll</span>
      </motion.div>
    </header>
  );
};

export default Hero;
