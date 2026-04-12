import React from 'react';
import { motion } from 'framer-motion';

const AnatomySection = ({ product }) => {
  const name = product?.name || 'This Specimen';
  const heroImage = product?.images && product.images.length > 0
    ? product.images[0]
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD-JWKExkplCQ2jokkSuAYmb3pq9UPsFzyeTCtNuCP51EgPyF8Hh-klVZFU5bCIoC16DCtwDp0Zcs7uhjNrLg0e_I7fWuA3JTIR4ARgq55L7j2nk_ZOYYYoU2j34w4pqIa-XiizoqFzXnD-G2XPtPzVdgXBDxuOrHqa4w0CjWvqyaZG1qthuL-lhKF3iaP86ZTJYss3ZmJFXJ80nI6RaVjMIF6gPjOvDjjzBL9FQp7O3wJvTnmuspNugg1K1jKsnxF5u8VY7bhJwSt';

  // Generate anatomy details from plant data
  const getAnatomyDetails = () => {
    const optimalPlace = product?.optimal_place || '';
    const waterFrequency = product?.water_frequency || '';

    const detail1 = {
      title: 'Leaf',
      subtitle: 'Structure',
      description: `The ${name}'s foliage exhibits a refined architecture — each leaf a testament to its evolutionary lineage, capturing light with precision.`,
    };

    const detail2 = {
      title: 'Growth',
      subtitle: 'Pattern',
      description: optimalPlace
        ? `Thriving in ${optimalPlace.toLowerCase()} conditions${waterFrequency ? ` with ${waterFrequency.toLowerCase()} hydration` : ''}, the ${name} develops its signature form over time.`
        : `Each leaf tapers and unfurls with deliberate grace, mirroring the natural rhythms of its ancestral habitat.`,
    };

    return [detail1, detail2];
  };

  const details = getAnatomyDetails();

  return (
    <section className="mb-32 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1440px] mx-auto px-12 group">
      {/* Anatomy Visual Feature */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="md:col-span-2 relative aspect-square overflow-hidden shadow-2xl shadow-black/10 transition-all duration-700 hover:scale-[1.02]"
      >
        <img 
          src={heroImage} 
          alt={`${name} Anatomy`} 
          className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-[#456565]/10 mix-blend-multiply opacity-30"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
             <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/70 border border-white/20 px-8 py-3 backdrop-blur-md pointer-events-none">{name} Anatomy</span>
        </motion.div>
      </motion.div>

      {/* Detail Block 1 */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#F5F4ED] p-16 flex flex-col justify-end text-left relative overflow-hidden border border-[#B1B3A9]/10 group/item"
      >
        <div className="absolute top-0 right-0 p-8 text-[#31332C]/5 font-headline italic text-8xl pointer-events-none group-hover/item:text-[#785A1A]/10 transition-colors">01</div>
        <div className="relative z-10 space-y-6">
          <h4 className="serif-display text-4xl leading-tight text-[#31332C] group-hover/item:text-[#785A1A] transition-colors">{details[0].title} <br />{details[0].subtitle}</h4>
          <p className="font-body text-sm leading-relaxed text-[#5E6058] opacity-90 transition-opacity group-hover/item:opacity-100">
             {details[0].description}
          </p>
        </div>
      </motion.div>

      {/* Detail Block 2 */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#EFEEE6] p-16 flex flex-col justify-start text-left relative overflow-hidden border border-[#B1B3A9]/10 group/item"
      >
        <div className="absolute bottom-0 right-0 p-8 text-[#31332C]/5 font-headline italic text-8xl pointer-events-none group-hover/item:text-[#785A1A]/10 transition-colors">02</div>
        <div className="relative z-10 space-y-6">
          <h4 className="serif-display text-4xl leading-tight text-[#31332C] group-hover/item:text-[#785A1A] transition-colors">{details[1].title} <br />{details[1].subtitle}</h4>
          <p className="font-body text-sm leading-relaxed text-[#5E6058] opacity-90 transition-opacity group-hover/item:opacity-100">
             {details[1].description}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AnatomySection;
