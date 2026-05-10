import React from 'react';
import { motion } from 'framer-motion';

const VALUE_PROPS = [
  {
    title: 'Natural Philosophy',
    desc: 'At Chloro, we believe that caring for plants should be as natural as the plants themselves.',
    icon: 'eco'
  },
  {
    title: 'Conscious Quality',
    desc: 'Every tool, vessel, and accessory in our collection is handpicked for quality, durability, and thoughtful design.',
    icon: 'verified'
  },
  {
    title: 'AI powered Intelligence',
    desc: 'With our proprietary AI-powered diagnosis feature, expert plant care guidance is always just a tap away.',
    icon: 'psychiatry'
  },
  {
    title: 'Root-to-Leaf Care',
    desc: 'Whether you are a seasoned gardener or just starting, Chloro is your trusted companion for every leaf, stem, and root.',
    icon: 'spa'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="pt-12 pb-32 px-12 bg-[#FBF9F4] border-t border-[#31332c]/5">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start pt-20">
        
        {/* Left Side: Editorial Image */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative group lg:sticky lg:top-32"
        >
          <div className="aspect-[4/5] overflow-hidden shadow-2xl shadow-black/10">
            <img 
              src="/ful.jpg" 
              alt="Botanical Care" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Right Side: Integrated Grid */}
        <div className="text-left py-8">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-label text-[11px] tracking-[0.3em] uppercase text-[#785a1a] font-bold inline-block mb-6"
          >
            The Chloro Standard
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline text-6xl md:text-7xl tracking-tight text-[#31332c] mb-20"
          >
            Why choose us??
          </motion.h2>

          {/* Integrated Story Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {VALUE_PROPS.map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#785a1a] text-2xl opacity-80">{prop.icon}</span>
                  <h4 className="font-headline text-2xl text-[#31332c] tracking-tight">{prop.title}</h4>
                </div>
                <p className="font-body text-sm text-[#5e6058] leading-relaxed opacity-90 max-w-xs">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
