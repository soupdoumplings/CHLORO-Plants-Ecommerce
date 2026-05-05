import React from 'react';
import ProductCard from '../../components/ProductCard';

const FEATURED_PRODUCTS = [
  { 
    id: 1, 
    name: "Monstera Deliciosa", 
    price: "4,500", 
    category: "Kathmandu Indoor Selection", 
    image: "https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg" 
  },
  { 
    id: 2, 
    name: "Sansevieria 'Laurentii'", 
    price: "2,200", 
    category: "Low Maintenance Specimen", 
    image: "https://images.pexels.com/photos/3699416/pexels-photo-3699416.jpeg" 
  },
  { 
    id: 3, 
    name: "Ficus Lyrata", 
    price: "8,900", 
    category: "Statement Foliage", 
    image: "https://images.pexels.com/photos/8175394/pexels-photo-8175394.jpeg" 
  }
];

const Archive = () => {
  return (
    <section className="py-32 px-12 bg-[#fbf9f4]">
        <div className="flex justify-between items-end mb-20">
          <div className="max-w-2xl text-left">
            <h2 className="font-headline text-5xl md:text-6xl mb-8 leading-tight text-[#31332c] animate-in slide-in-from-bottom-5 duration-700">Personalized Archive Recommendations</h2>
            <p className="font-body text-[#5e6058] leading-relaxed text-lg tracking-wide opacity-90 mb-4 animate-in slide-in-from-bottom-3 duration-500">
              Curated by our proprietary growth algorithms, these specimens are selected based on your local micro-climate in the Kathmandu Valley.
            </p>
          </div>
          <a class="font-label text-[10px] uppercase font-bold tracking-[0.25em] border-b border-[#31332c] pb-1.5 mb-2 hover:opacity-50 transition-all text-[#31332c] flex items-center gap-3 shrink-0" href="#">
             View Full Collection 
             <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {FEATURED_PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
  );
};

export default Archive;
