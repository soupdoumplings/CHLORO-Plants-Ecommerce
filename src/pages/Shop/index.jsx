import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';

const ALL_PLANTS = [
  { 
    id: 'ficus', 
    name: "Ficus Lyrata", 
    price: "4,500", 
    category: "Kathmandu selection", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmh3ws8jAdQ8dqczC4RT6uQ-1FW6LjsRw-ARUFPPJnHodhh2uAnW_U2EgZceK1v6L_OyVAKXkRylFpVBwkFvz1cDC8pkVwqCiCLbbXBxoqHKwoz_9iCELFqYsZf-mTgNT2xLLNBiHDdFd5Lj4UD3-dMa5pdb1t_twT5ukwQNeXDDDCfuvsKG4T0Dr6YLbjYwOq5iQML_OZkSm1uhEBAjyvdSaA-7Epc4heCe6sPcfAdt01GjdJ1jokhb6OpnlWOn7SZFWjUMC5VLEB" 
  },
  { 
    id: 'orchid', 
    name: "Himalayan Orchid", 
    price: "12,500", 
    category: "High Altitude Collection", 
    image: "https://images.unsplash.com/photo-1599931302353-8d693f41af90?q=80&w=2574&auto=format&fit=crop" 
  },
  { 
    id: 'monstera', 
    name: "Monstera Deliciosa", 
    price: "4,500", 
    category: "Tropical Lowland", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmNUMpaayfy0pwiSZD3r4qiI48Fgaf4wCOYK6WILl_SNwi5a-7Rq-cRbonZbn56-0F5zhFyKNRCnTEvXbU-tdRWYu5fqb1KbUy3B67yf6XibtrNOHFJxHIg4L0WCH1O0m4Vj1pSdMjvKuyuXtNA7BXvZlpQV2Up0rbTN9P72IoQRPdYUPKhLtqNHbL0zXfR5KWG4svuLmm8npwOVUk2zcfDzrj2erZ7bsfcJgsshDmlZZB5-tScPg6EpilE2Y6JRC8zA5Jy9Rd8EF0" 
  },
  { 
    id: 'snake', 
    name: "Sansevieria", 
    price: "2,200", 
    category: "Low Maintenance", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlG3pPQXbo97lh6RRSSmVvv9mqIejx8LJJipkizNUA3Izvkg8vWQQ2CmqJx7X-h4uyYSJta1Stop4jv9b84XlABZrqsLJekbz12j_GBXSdCi6nv5yGpLuQDCRqE1h9CTnI1h5vPd-8GrE3p_Ktmef_be59ZpYjdsmjaH6Jll-MDtz4CQTXFttYNsmVkM0DN-08RPDnHcq3bYeKKCXSAJdOQIBLkqhZhf4G8_xrm8ybusYy_WsBRO48nmaPQI7acE13ci5eyulsQ74l" 
  }
];

const ShopPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center"
    >
      <Navbar />
      
      <main className="w-full max-w-[1440px] px-12 pt-32 pb-48">
        <header className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
           <div className="text-left space-y-6 max-w-2xl">
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#785A1A] font-bold inline-block"
              >
                Botanical Archive
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-headline text-8xl md:text-9xl tracking-tighter text-[#31332C] leading-none"
              >
                The <span className="italic font-light">Specimens.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-body text-[#5E6058] text-lg max-w-md leading-relaxed"
              >
                 A curated selection of the finest flora from the Himalayan foothills and beyond. Each specimen is selected for its architectural presence and botanical soul.
              </motion.p>
           </div>
           
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
             className="flex gap-12 font-sans text-[11px] tracking-[0.1em] uppercase font-bold text-[#31332C]/40 border-b border-[#31332C]/5 pb-2"
           >
              <button className="text-[#31332C] border-b border-[#31332C]">All</button>
              <button className="hover:text-[#31332C] transition-colors">High Altitude</button>
              <button className="hover:text-[#31332C] transition-colors">Indoor</button>
              <button className="hover:text-[#31332C] transition-colors">Rare</button>
           </motion.div>
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
    </motion.div>
  );
};

export default ShopPage;
