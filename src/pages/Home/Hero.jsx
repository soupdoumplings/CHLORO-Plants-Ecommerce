import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Aperture } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <header ref={containerRef} className="relative w-full h-[100vh] flex flex-col justify-center px-12 pt-20 overflow-hidden bg-[#31332c]">
      <motion.div 
        style={{ y: videoY, opacity }}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover grayscale-[0.05] brightness-[0.85]"
        >
          <source src="/flo.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl text-left"
      >
        <motion.p 
          variants={itemVariants}
          className="font-label text-[11px] tracking-[0.25em] uppercase mb-4 text-white font-semibold opacity-90"
        >
          The High-Altitude Collection
        </motion.p>
        
        <motion.h1 
          variants={itemVariants}
          className="font-headline text-7xl md:text-[8.5rem] lg:text-[10rem] tracking-tighter leading-[0.85] text-white mb-10"
        >
          Himalayan <br /> 
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="italic font-extralight opacity-95"
          >
            Elegance.
          </motion.span>
        </motion.h1>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row gap-10 items-start md:items-center"
        >
          <button className="bg-white text-[#31332c] px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#fbf9f4] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-black/10">
            Explore the Archive
          </button>

          {/* AI Diagnosis Button */}
          <button className="flex items-center gap-4 group cursor-pointer transition-all duration-300">
            <div className="w-12 h-12 flex items-center justify-center border border-white/20 backdrop-blur-sm group-hover:border-white/40 transition-colors">
              <Aperture className="w-5 h-5 text-white" strokeWidth={1.2} />
            </div>
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1">
                AI Powered
              </span>
              <span className="block font-headline text-2xl italic text-white/90 leading-tight">
                Al Diagnosis
              </span>
            </div>
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-12 flex items-center gap-4 animate-bounce"
      >
        <span className="w-[1px] h-10 bg-white/40"></span>
        <span className="text-[9px] uppercase tracking-widest text-white/60 font-bold vertical-text">Scroll</span>
      </motion.div>
    </header>
  );
};

export default Hero;
