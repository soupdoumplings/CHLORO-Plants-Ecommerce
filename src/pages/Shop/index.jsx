import React from 'react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { productAssetImages, publicPlantImages } from '../../lib/localImages';

const ALL_PLANTS = [
  {
    id: 'ficus',
    name: "Ficus Lyrata",
    price: "4,500",
    category: "Kathmandu selection",
    image: publicPlantImages.phool
  },
  {
    id: 'orchid',
    name: "Himalayan Orchid",
    price: "12,500",
    category: "High Altitude Collection",
    image: publicPlantImages.orchid
  },
  {
    id: 'monstera',
    name: "Monstera Deliciosa",
    price: "4,500",
    category: "Tropical Lowland",
    image: productAssetImages.monstera
  },
  {
    id: 'snake',
    name: "Sansevieria",
    price: "2,200",
    category: "Low Maintenance",
    image: productAssetImages.succulents
  }
];

const ShopPage = () => {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center"
    >
      <Navbar />

      <main className="w-full page-shell page-gutter pt-32 pb-48">
        <header className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
           <div className="text-left space-y-6 max-w-2xl">
              <Motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#785A1A] font-bold inline-block"
              >
                Plant Shop
              </Motion.span>
              <Motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-headline text-8xl md:text-9xl tracking-tighter text-[#31332C] leading-none"
              >
                Plants <span className="italic font-light">& Gifts.</span>
              </Motion.h1>
              <Motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-body text-[#5E6058] text-lg max-w-md leading-relaxed"
              >
                 Shop indoor plants, pots, and care pieces selected for Nepal homes, balconies, and everyday routines.
              </Motion.p>
           </div>

           <Motion.div
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
             className="flex gap-12 font-sans text-[11px] tracking-[0.1em] uppercase font-bold text-[#31332C]/40 border-b border-[#31332C]/5 pb-2"
           >
              <button className="text-[#31332C] border-b border-[#31332C]">All</button>
              <button className="hover:text-[#31332C] transition-colors">High Altitude</button>
              <button className="hover:text-[#31332C] transition-colors">Indoor</button>
              <button className="hover:text-[#31332C] transition-colors">Rare</button>
           </Motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {ALL_PLANTS.map((p, i) => (
             <div key={p.id} className="group relative">
                <ProductCard product={p} delay={i * 0.12} />
                <button className="absolute inset-0 opacity-0 bg-transparent" onClick={() => window.location.href = `/catalogue/${p.id}`}></button>
             </div>
          ))}
        </div>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default ShopPage;
