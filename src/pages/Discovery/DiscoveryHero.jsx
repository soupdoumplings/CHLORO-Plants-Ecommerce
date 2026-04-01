import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/discovery-hero.png';

const DiscoveryHero = () => {
  return (
    <section className="w-full pt-[82px]">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[75vh] items-center">
          {/* Left — Editorial Copy */}
          <div className="flex flex-col justify-center py-20 lg:py-32 lg:pr-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-label text-[10px] tracking-[0.2em] uppercase text-[#2F4F4F] font-semibold mb-6"
            >
              Summer Collection / Vol. 04
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-tight text-[#1A1A1A] mb-8"
            >
              Living{' '}
              <br />
              <span className="italic font-light">Sculpture</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[15px] text-[#4A4A4A] leading-[1.75] max-w-[380px]"
            >
              A meticulous collection of rare botanical specimens
              and artisan-crafted vessels, designed to transform
              domestic spaces into living galleries.
            </motion.p>
          </div>

          {/* Right — Editorial Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full min-h-[400px] lg:min-h-[600px] overflow-hidden"
          >
            <img
              src={heroImage}
              alt="Summer collection — Living Sculpture"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryHero;
