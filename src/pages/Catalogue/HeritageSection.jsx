import React from 'react';
import { motion as Motion } from 'framer-motion';
import { fallbackHeroImage } from '../../lib/localImages';

const HeritageSection = ({ product }) => {
  const name = product?.name || 'This Plant';
  const info = product?.info || '';
  const curatorQuote = product?.curator_quote || `"${name} brings a calm, sculptural green presence to the room when matched with the right light and watering rhythm."`;
  const provenance = product?.provenance || '';

  // Use second image if available, otherwise first image, otherwise fallback
  const heritageImage = product?.images && product.images.length > 1
    ? product.images[1]
    : product?.images && product.images.length > 0
      ? product.images[0]
      : fallbackHeroImage;

  // Generate heritage narrative from product data
  const getHeritageNarrative = () => {
    if (info && info.length > 60) {
      return info;
    }
    if (provenance) {
      return `${name} comes from plant lines associated with ${provenance}. That background helps explain its preferred light, humidity, and care rhythm at home.`;
    }
    return `${name} is selected for everyday homes, with care notes that help you understand where it should sit, how often to water, and what to expect as it grows.`;
  };

  const getHeritageSecondary = () => {
    return `Use this section as a plain-language guide before buying: match the plant to your room, light level, and routine so it has the best chance to thrive.`;
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32 bg-[#F5F4ED] p-12 lg:p-16 rounded-sm page-shell drop-shadow-sm group">
      {/* Visual Component */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden shadow-2xl shadow-black/10 h-[600px] border border-[#B1B3A9]/10"
      >
        <img
          src={heritageImage}
          alt={`${name} Heritage`}
          className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[#31332c]/5 mix-blend-overlay"></div>
      </Motion.div>

      {/* Narrative Component */}
      <Motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-left space-y-12"
      >
        <div className="space-y-4">
           <Motion.h2
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
             className="font-headline text-[80px] leading-tight text-[#31332C] tracking-tighter"
           >
             Rooted in <br /><span className="italic font-light">Heritage</span>
           </Motion.h2>
        </div>

        <div className="space-y-10 max-w-lg">
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[#5E6058] leading-relaxed text-lg opacity-90 transition-opacity group-hover:opacity-100"
          >
              {getHeritageNarrative()}
          </Motion.p>
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[#5E6058] leading-relaxed text-lg opacity-90"
          >
              {getHeritageSecondary()}
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="pt-16 mt-16 border-t border-[#B1B3A9]/30 space-y-10"
          >
             <blockquote className="font-headline italic text-3xl leading-relaxed text-[#31332C] opacity-90">
                {curatorQuote}
             </blockquote>

             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#e2e3d9] overflow-hidden drop-shadow-lg grayscale relative flex items-center justify-center">
                   <span className="material-symbols-outlined text-[28px] text-[#5E6058]">psychiatry</span>
                </div>
                <div className="space-y-1">
                   <p className="font-label text-[10px] tracking-[2px] uppercase text-[#31332C] font-black">Petals & Pots</p>
                   <p className="font-body text-xs text-[#5E6058] italic font-bold">Plant Care Team</p>
                </div>
             </div>
          </Motion.div>
        </div>
      </Motion.div>
    </section>
  );
};

export default HeritageSection;
