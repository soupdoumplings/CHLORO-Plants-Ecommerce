import React from 'react';
import { motion } from 'framer-motion';

const metrics = [
  {
    label: 'Total Catalog Value',
    value: 'रू 142,850.00',
    extra: (
      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
        <span className="material-symbols-outlined text-[#456565] text-sm font-bold">trending_up</span>
        <p className="font-label text-xs font-bold text-[#456565] tracking-tight uppercase">+8.4% last quarter</p>
      </div>
    ),
    valueColor: 'text-[#31332C]',
  },
  {
    label: 'Active Listings',
    value: '284',
    extra: (
      <div className="flex items-center gap-2 text-[#5E6058]">
        <span className="material-symbols-outlined text-sm font-bold opacity-60">inventory_2</span>
        <p className="font-label text-xs font-medium tracking-tight uppercase opacity-80">Distribution: Global</p>
      </div>
    ),
    valueColor: 'text-[#31332C]',
  },
  {
    label: 'Critical Stock',
    value: '08',
    extra: (
      <div className="flex items-center gap-2 text-[#9F403D]">
        <span className="material-symbols-outlined text-sm font-bold animate-pulse">report</span>
        <p className="font-label text-xs font-bold tracking-tight uppercase">Low inventory alert</p>
      </div>
    ),
    valueColor: 'text-[#9F403D]',
  },
  {
    label: 'Curation Velocity',
    value: '88%',
    extra: (
      <div className="w-full bg-[#EFEEE6] h-1 relative rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           whileInView={{ width: '88%' }}
           viewport={{ once: true }}
           transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
           className="absolute left-0 top-0 bottom-0 bg-[#785A1A] group-hover:opacity-80"
         />
      </div>
    ),
    valueColor: 'text-[#31332C]',
  },
];

const MetricsGrid = () => {
  return (
    <section className="mb-24 px-12 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#B1B3A9]/20 bg-white shadow-2xl shadow-black/5">
      {metrics.map((metric, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`p-10 group hover:bg-[#FBF9F4] transition-colors ${i < 3 ? 'border-b lg:border-b-0 lg:border-r border-[#B1B3A9]/20' : ''}`}
        >
          <p className="font-label text-xs tracking-widest text-[#5E6058] uppercase mb-4">{metric.label}</p>
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`font-headline text-5xl ${metric.valueColor} mb-6 tracking-tight`}
          >
            {metric.value}
          </motion.h3>
          {metric.extra}
        </motion.div>
      ))}
    </section>
  );
};

export default MetricsGrid;
