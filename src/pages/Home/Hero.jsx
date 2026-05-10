import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from '../../components/Magnetic';


const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const videoOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 0.78, 0.18]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.58, 0.92], [1, 0.96, 0.24]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.38, 0.48, 0.66]);

  return (
    <header
      ref={heroRef}
      data-cursor-theme="light"
      className="relative w-full h-screen flex flex-col justify-center page-gutter pt-20 overflow-hidden"
    >
      <Motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Motion.video
          autoPlay
          loop
          muted
          playsInline
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="w-full h-full object-cover grayscale-[0.04] brightness-[0.88]"
        >
          <source src="/flo.mp4" type="video/mp4" />
        </Motion.video>
      </Motion.div>
      <Motion.div
        className="absolute inset-0 z-[1] bg-[#071F1F]"
        style={{ opacity: veilOpacity }}
      />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_20%_50%,rgba(198,233,233,0.09),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.42),rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.22))]" />
      <Motion.div
        className="relative z-10 max-w-5xl text-left"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <Motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-label text-[11px] tracking-[0.28em] uppercase mb-5 text-[#C6E9E9] font-bold"
        >
          The High-Altitude Collection
        </Motion.p>
        <Motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-headline text-[clamp(4.7rem,11vw,10rem)] tracking-tight leading-[0.82] text-white mb-6 drop-shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
        >
          Himalayan <br />
          <span className="italic font-extralight opacity-95">Elegance.</span>
        </Motion.h1>
        <Motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="font-body text-[16px] md:text-[18px] leading-relaxed text-white/78 max-w-[560px] mb-2"
        >
          Shop curated living specimens, seasonal care tools, and quiet botanical support for refined homes.
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row gap-8 items-start md:items-center"
        >
          <Magnetic magnetism={15}>
            <Motion.div
              whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-[#31332c] shadow-xl shadow-black/10"
            >
              <Link
                to="/discovery"
                className="block px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#fbf9f4] transition-all"
              >
                Shop Collection
              </Link>
            </Motion.div>
          </Magnetic>

          <Link to="/ai-diagnosis" className="flex items-center gap-3 group cursor-pointer text-white">
            <Magnetic magnetism={20}>
              <Motion.div
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,1)' }}
                className="w-11 h-11 border border-white/20 flex items-center justify-center transition-all duration-500 rounded-sm group-hover:bg-white group-hover:border-white"
              >
                <span className="material-symbols-outlined text-white group-hover:text-[#31332c] transition-colors text-[18px]">psychiatry</span>
              </Motion.div>
            </Magnetic>
            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-white/60 font-bold">AI Powered</p>
              <p className="font-headline italic text-[16px] text-white">AI Diagnosis</p>
            </div>
          </Link>
        </Motion.div>
      </Motion.div>
      <Motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-6 left-0 right-0 z-10 page-gutter flex items-center justify-between text-white/55"
        style={{ opacity: contentOpacity }}
      >
        <span className="font-label text-[9px] uppercase tracking-[0.24em] font-bold">Scroll</span>
        <span className="h-px flex-1 mx-6 bg-white/18" />
        <span className="font-label text-[9px] uppercase tracking-[0.24em] font-bold">Seasonal Shop</span>
      </Motion.div>


    </header>
  );
};

export default Hero;
