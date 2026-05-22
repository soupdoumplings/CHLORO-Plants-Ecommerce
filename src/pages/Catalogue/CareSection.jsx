import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import WateringReminderModal from '../../components/WateringReminderModal';
import { useAuth } from '../../lib/AuthContext';
import { getProductType, productTypeLabels } from '../../lib/productTypes';

const CareSection = ({ product }) => {
  const { user } = useAuth();
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);
  const optimalPlace = product?.optimal_place || 'Bright Indirect Light';
  const waterFrequency = product?.water_frequency || 'Every 7 Days';
  const plantName = product?.name || 'This plant';
  const isPlantProduct = Boolean(product) && getProductType(product) === productTypeLabels.plants;

  // Derive illumination description from optimal_place
  const getIlluminationDesc = (place) => {
    const lower = (place || '').toLowerCase();
    if (lower.includes('direct') && !lower.includes('indirect')) {
      return `${plantName} thrives in direct sunlight. Position near a south-facing window for optimal photosynthesis and vibrant growth patterns.`;
    }
    if (lower.includes('low') || lower.includes('shade')) {
      return `${plantName} adapts well to low-light conditions. It can be placed in interior rooms with minimal natural light, though growth may slow.`;
    }
    return `${plantName} thrives in bright, filtered light. Direct sun may scorch the leaves, while deep shade can slow growth and make the plant stretch.`;
  };

  // Derive environment hints from optimal_place
  const getEnvironmentDesc = (place) => {
    const lower = (place || '').toLowerCase();
    if (lower.includes('outdoor') || lower.includes('full sun')) {
      return `${plantName} prefers outdoor conditions with good air circulation. Protect from frost and extreme wind exposure for best results.`;
    }
    return `${plantName} prefers stable room conditions. Keep it away from strong drafts, hot vents, and sudden temperature changes.`;
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
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-[#B1B3A9]/10 pb-8 gap-8"
      >
        <h2 className="font-headline text-5xl italic text-[#31332C]">Plant Care Guide</h2>
        <p className="font-label text-[11px] tracking-[0.1rem] uppercase text-[#5E6058] mt-4 md:mt-0 font-bold opacity-80">Light, Water & Room Tips</p>
      </Motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-[#B1B3A9]/10">
        {cards.map((card, i) => (
          <Motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`p-16 ${card.bg} border-r border-[#B1B3A9]/10 text-left group`}
          >
            <Motion.span
              className={`material-symbols-outlined text-[#785A1A] mb-8 text-3xl ${card.hoverEffect} transition-transform inline-block`}
            >
              {card.icon}
            </Motion.span>
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

            {card.extra === 'hydration' && isPlantProduct && (
              <Motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white p-10 border border-[#B1B3A9]/15 shadow-2xl shadow-black/5 transform group-hover:-translate-y-2 transition-transform duration-500"
              >
                 <p className="font-label text-[9px] tracking-[0.1rem] uppercase mb-6 opacity-60 font-black text-[#31332C]">Care Reminder</p>
                 <h4 className="font-headline italic text-2xl text-[#31332C] mb-6">Set Watering Reminder</h4>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#B1B3A9]/10 pb-3">
                       <span className="text-xs font-body text-[#31332C]">Frequency</span>
                       <span className="text-xs font-label uppercase text-[#785A1A] font-black tracking-widest">{waterFrequency}</span>
                    </div>
                    <p className="font-body text-xs leading-relaxed text-[#5E6058]">
                      Save this plant to My Plants and receive bell plus email reminders on watering day.
                    </p>
                    <Motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setReminderOpen(true)}
                      className="w-full py-4 text-[10px] font-label tracking-widest uppercase border border-[#5F5E5E] text-[#5F5E5E] hover:bg-[#5F5E5E] hover:text-white transition-all font-bold"
                    >
                       {reminderSaved ? 'Reminder Saved' : 'Set Reminder'}
                    </Motion.button>
                 </div>
              </Motion.div>
            )}

            {card.extra === 'environment' && (
              <ul className="space-y-4 font-body text-xs text-[#31332C] font-bold">
                {getEnvironmentChecklist(optimalPlace).map((item, idx) => (
                  <Motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 active:text-[#785A1A] transition-colors"
                  >
                     <span className="material-symbols-outlined scale-[0.6] bg-[#31332c] text-white rounded-full p-2 border border-[#31332c]">check</span>
                     {item}
                  </Motion.li>
                ))}
              </ul>
            )}
          </Motion.div>
        ))}
      </div>
      <WateringReminderModal
        open={reminderOpen && isPlantProduct}
        onClose={() => setReminderOpen(false)}
        user={user}
        plants={product ? [product] : []}
        defaultFrequency={waterFrequency}
        onSaved={() => setReminderSaved(true)}
      />
    </section>
  );
};

export default CareSection;
