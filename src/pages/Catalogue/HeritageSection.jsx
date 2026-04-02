import React from 'react';
import { motion } from 'framer-motion';

const HeritageSection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32 bg-[#F5F4ED] px-12 py-32 rounded-sm mx-auto max-w-[1440px] drop-shadow-sm group">
      {/* Visual Component */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden shadow-2xl shadow-black/10 h-[600px] border border-[#B1B3A9]/10"
      >
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQb0IBHuXj7YIxS_N3NxonDg-QG5st_Cm_DbZEX-a9x_8j-aiN3wuZ-sJfWKdA_0WREZM7GA5qU1NpkY6TNzwMK7lCnFU_KqorA-vaRQoMbV4y8WaX69jjkQiHhUs_MdUAhDJPc4KC_ikXujcg0AGD4pc4AZ7shZ2GqjZUTaaFQA68S6ICADID8TzJqVsAJxmhrIW1Wz00bruN0hZERUvp9xFDRxlzeGeJkuCfoqUROEm8wOm_thw9zQizs-FANcK61zMvUJ2ZKSyy" 
          alt="Heritage Detail" 
          className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-[#31332c]/5 mix-blend-overlay"></div>
      </motion.div>

      {/* Narrative Component */}
      <motion.div 
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-left space-y-12"
      >
        <div className="space-y-4">
           <motion.h2 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
             className="font-headline text-[80px] leading-tight text-[#31332C] tracking-tighter"
           >
             Rooted in <br /><span className="italic font-light">Heritage</span>
           </motion.h2>
        </div>
        
        <div className="space-y-10 max-w-lg">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[#5E6058] leading-relaxed text-lg opacity-90 transition-opacity group-hover:opacity-100"
          >
              Centuries before it graced the galleries of Paris and London, the Ficus Lyrata thrived in the dense, humid understories of the West African rainforest. Its evolution as an epiphyte—starting life in the canopy of other trees—bestowed it with a fierce resilience and an upward-reaching ambition.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[#5E6058] leading-relaxed text-lg opacity-90"
          >
              Today, we curate these specimens not just for their aesthetic grace, but as living links to a primordial ecosystem. Each leaf is a record of light captured and air filtered.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="pt-16 mt-16 border-t border-[#B1B3A9]/30 space-y-10"
          >
             <blockquote className="font-headline italic text-3xl leading-relaxed text-[#31332C] opacity-90">
                "To live with a Lyrata is to curate a dialogue between the wild and the domestic. It is the architectural pulse of the room."
             </blockquote>
             
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#e2e3d9] overflow-hidden drop-shadow-lg grayscale relative">
                   <img 
                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEVkERmYpg6K7ZWbK8LrUMHiaAf1b-5Ra8UVjyeoj_VFIdgZuG_tz4VaFJaJz_ZxNIXHI6yz0PxGNCifOogFm3DtoJZLZiEVMrwoJ1WQ7_KGe_o9LN5NZ0ITiAoFrlY2JtkjPATyV1PR6-aEb7xCAy_mccl4HKzDH3Wg8PbmiiTRBW2bEuGz2Lrm6mX62jqCgbyIIPv8FaVJwvVgK_NX3WF7Zxy12h8f6O2BcSud0AV-rtjq3MOXagfko0yizKYkFC0MrqiLfbLjZC" 
                     alt="Curator" 
                     className="w-full h-full object-cover mix-blend-multiply" 
                   />
                </div>
                <div className="space-y-1">
                   <p className="font-label text-[10px] tracking-[2px] uppercase text-[#31332C] font-black">Julian Vane</p>
                   <p className="font-body text-xs text-[#5E6058] italic font-bold">Lead Botanical Curator</p>
                </div>
             </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeritageSection;
