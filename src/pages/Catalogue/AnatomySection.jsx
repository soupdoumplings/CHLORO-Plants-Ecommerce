import React from 'react';
import { motion as Motion } from 'framer-motion';
import { fallbackHeroImage } from '../../lib/localImages';
import { getProductType, productTypeLabels } from '../../lib/productTypes';

const AnatomySection = ({ product }) => {
  const name = product?.name || 'This Product';
  const isPlantProduct = Boolean(product) && getProductType(product) === productTypeLabels.plants;
  const heroImage = product?.images && product.images.length > 0
    ? product.images[0]
    : fallbackHeroImage;

  // Generate anatomy details from plant data
  const getAnatomyDetails = () => {
    const optimalPlace = product?.optimal_place || '';
    const waterFrequency = product?.water_frequency || '';

    const detail1 = isPlantProduct
      ? {
          title: 'Leaf',
          subtitle: 'Details',
          description: `${name} has distinctive foliage. Use the image and notes here to understand its shape, texture, and how it may look in your space.`,
        }
      : {
          title: 'Item',
          subtitle: 'Details',
          description: `${name} is shown with its current catalogue image and notes so customers can understand the finish, format, and intended use before checkout.`,
        };

    const detail2 = isPlantProduct
      ? {
          title: 'Growth',
          subtitle: 'Habit',
          description: optimalPlace
            ? `Thriving in ${optimalPlace.toLowerCase()} conditions${waterFrequency ? ` with ${waterFrequency.toLowerCase()} hydration` : ''}, the ${name} develops its signature form over time.`
            : `New leaves open gradually as the plant settles into the right light, water, and room conditions.`,
        }
      : {
          title: 'Shop',
          subtitle: 'Context',
          description: `${name} belongs to ${product?.category || 'the catalogue'} and can be paired with plants, gifts, or care routines depending on the customer's need.`,
        };

    return [detail1, detail2];
  };

  const details = getAnatomyDetails();

  return (
    <section className="mb-32 grid grid-cols-1 md:grid-cols-4 gap-12 page-shell group">
      {/* Anatomy Visual Feature */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="md:col-span-2 relative aspect-square overflow-hidden shadow-2xl shadow-black/10 transition-all duration-700 hover:scale-[1.02]"
      >
        <img
          src={heroImage}
          alt={`${name} details`}
          className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[#456565]/10 mix-blend-multiply opacity-30"></div>
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
             <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/70 border border-white/20 px-8 py-3 backdrop-blur-md pointer-events-none">{name} Details</span>
        </Motion.div>
      </Motion.div>

      {/* Detail Block 1 */}
      <Motion.div
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
      </Motion.div>

      {/* Detail Block 2 */}
      <Motion.div
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
      </Motion.div>
    </section>
  );
};

export default AnatomySection;
