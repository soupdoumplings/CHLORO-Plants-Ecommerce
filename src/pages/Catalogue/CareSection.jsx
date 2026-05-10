import React from 'react';
import { motion } from 'framer-motion';

const CareSection = ({ product }) => {
  const optimalPlace = product?.optimal_place || 'Bright Indirect Light';
  const waterFrequency = product?.water_frequency || 'Every 7 Days';
  const plantName = product?.name || 'This specimen';

  // Derive illumination description from optimal_place
  const getIlluminationDesc = (place) => {
    const lower = (place || '').toLowerCase();
    if (lower.includes('direct') && !lower.includes('indirect')) {
      return `${plantName} thrives in direct sunlight. Position near a south-facing window for optimal photosynthesis and vibrant growth patterns.`;
    }
    if (lower.includes('low') || lower.includes('shade')) {
      return `${plantName} adapts well to low-light conditions. It can be placed in interior rooms with minimal natural light, though growth may slow.`;
    }
    return `${plantName} thrives in bright, filtered light. Direct sun may scorch the delicate broad-leaf membranes, while deep shade will cause the specimen to stretch and lose its sculptural density.`;
  };

  // Derive environment hints from optimal_place
  const getEnvironmentDesc = (place) => {
    const lower = (place || '').toLowerCase();
    if (lower.includes('outdoor') || lower.includes('full sun')) {
      return `${plantName} prefers outdoor conditions with good air circulation. Protect from frost and extreme wind exposure for best results.`;
    }
    return `${plantName} loathes drafts and sudden temperature shifts. Place in a stable, humid corner away from vents or doorways. It is a creature of habit.`;
  };

  // Derive environment checklist from optimal_place
  const getEnvironmentChecklist = (place) => {
    const lower = (place || '').toLowerCase();
    if (lower.includes('low') || lower.includes('shade')) {
      return ['Humidity: 50%+', 'Temp: 60°F - 80°F'];
    }
    if (lower.includes('outdoor') || lower.includes('full sun')) {
      return ['Humidity: 40%+', 'Temp: 55°F - 95°F'];
    }
    return ['Humidity: 60%+', 'Temp: 65°F - 85°F'];
  };

  const cards = [
    {
      icon: 'wb_sunny',
      title: 'Illumination',
      desc: getIlluminationDesc(optimalPlace),
      badge: optimalPlace,
      bg: 'bg-[#F5F4ED]',
      hoverEffect: 'group-hover:rotate-45',
      extra: null,
    },
    {
      icon: 'water_drop',
      title: 'Hydration',
      desc: `Water only when the top two inches of soil feel parched. Consistency is the hallmark of health for ${plantName}.`,
      badge: null,
      bg: 'bg-[#E8E9E0]',
      hoverEffect: 'group-hover:scale-y-125',
      extra: 'hydration',
    },
    {
      icon: 'grid_view',
      title: 'Environment',
      desc: getEnvironmentDesc(optimalPlace),
      badge: null,
      bg: 'bg-[#E2E3D9]',
      hoverEffect: 'group-hover:scale-150',
      extra: 'environment',
    },
  ];

  return (
    <section className="mb-32">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-[#B1B3A9]/10 pb-8 gap-8"
      >
        <h2 className="font-headline text-5xl italic text-[#31332C]">Cultivation & Preservation</h2>
        <p className="font-label text-[11px] tracking-[0.1rem] uppercase text-[#5E6058] mt-4 md:mt-0 font-bold opacity-80">Technical Care Specifications</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-[#B1B3A9]/10">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`p-16 ${card.bg} border-r border-[#B1B3A9]/10 text-left group`}
          >
            <motion.span 
              className={`material-symbols-outlined text-[#785A1A] mb-8 text-3xl ${card.hoverEffect} transition-transform inline-block`}
            >
              {card.icon}
            </motion.span>
            <h3 className="font-label text-xs tracking-[0.15rem] uppercase mb-8 font-black text-[#31332C]">{card.title}</h3>
            <p className={`font-body text-sm leading-relaxed text-[#5E6058] mb-12 opacity-90 transition-opacity group-hover:opacity-100 ${card.title === 'Hydration' ? 'italic' : ''}`}>
              {card.desc}
            </p>
            
            {card.extra === null && (
              <div className="flex items-center gap-4 text-xs font-label tracking-widest uppercase text-[#456565] font-black">
                <span className="w-2.5 h-2.5 bg-[#456565] rounded-full drop-shadow-sm"></span>
                {card.badge}
              </div>
            )}

            {card.extra === 'hydration' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white p-10 border border-[#B1B3A9]/15 shadow-2xl shadow-black/5 transform group-hover:-translate-y-2 transition-transform duration-500"
              >
                 <p className="font-label text-[9px] tracking-[0.1rem] uppercase mb-6 opacity-60 font-black text-[#31332C]">Botanical Management</p>
                 <h4 className="font-headline italic text-2xl text-[#31332C] mb-6">Set Hydration Schedule</h4>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#B1B3A9]/10 pb-3">
                       <span className="text-xs font-body text-[#31332C]">Frequency</span>
                       <span className="text-xs font-label uppercase text-[#785A1A] font-black tracking-widest">{waterFrequency}</span>
                    </div>
                    <motion.button 
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 text-[10px] font-label tracking-widest uppercase border border-[#5F5E5E] text-[#5F5E5E] hover:bg-[#5F5E5E] hover:text-white transition-all font-bold"
                    >
                       Sync to Calendar
                    </motion.button>
                 </div>
              </motion.div>
            )}

            {card.extra === 'environment' && (
              <ul className="space-y-4 font-body text-xs text-[#31332C] font-bold">
                {getEnvironmentChecklist(optimalPlace).map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 active:text-[#785A1A] transition-colors"
                  >
                     <span className="material-symbols-outlined scale-[0.6] bg-[#31332c] text-white rounded-full p-2 border border-[#31332c]">check</span> 
                     {item}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CareSection;
