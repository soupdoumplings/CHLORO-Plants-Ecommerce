import React from 'react';
import { useCart } from '../../lib/CartContext';

const CatalogueHero = () => {
  const { addToBag } = useCart();
  return (
    <section className="relative w-full min-h-[966px] flex flex-col md:flex-row bg-[#FBF9F4] pt-20">
      
      {/* Left Column: Identity */}
      <div className="w-full md:w-[410px] flex flex-col items-start px-12 pt-16 gap-12 text-left">
        <div className="space-y-4">
          <span className="font-sans text-[10px] tracking-[0.32em] uppercase text-[#785A1A]">
            Specimen No. 1042
          </span>
          <h1 className="font-headline text-[96px] leading-[100%] text-[#31332C] tracking-tighter">
            Himalayan <br /> Orchid
          </h1>
        </div>

        <div className="max-w-sm">
          <p className="font-sans text-base leading-[162%] text-[#5E6058]">
            The Coelogyne cristata, an ethereal beauty of the high altitudes. This rare orchid is defined by its cascading crystalline blooms and a fragrance that evokes the crisp morning air of the mountain peaks.
          </p>
        </div>

        <div className="space-y-8 w-full border-t border-[#B1B3A9]/20 pt-8 mt-4">
          <div className="space-y-2">
            <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#31332C]/50 font-bold">Provenance</span>
            <p className="font-sans text-sm text-[#31332C]">Eastern Himalayas, High Altitude Cloud Forests</p>
          </div>

          <div className="flex items-end justify-between w-full pt-8">
            <div className="space-y-2">
              <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#31332C]/50 font-bold">Price</span>
              <p className="font-headline text-3xl text-[#31332C]">रू 12,500</p>
            </div>
            <button 
              onClick={() => addToBag({
                id: 'himalayan-orchid-id',
                name: 'Himalayan Orchid',
                price: 12500
              })}
              className="bg-[#5F5E5E] text-[#FAF7F6] px-10 py-4 text-[11px] tracking-[0.16em] uppercase hover:bg-[#31332C] transition-all transform hover:-translate-y-1 shadow-lg shadow-black/5"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Focus */}
      <div className="flex-1 bg-[#F5F4ED] relative h-[966px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1599931302353-8d693f41af90?q=80&w=2574&auto=format&fit=crop" 
          alt="Himalayan Orchid" 
          className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-110 brightness-[0.95]"
        />
        
        {/* Floating Quote Box */}
        <div className="absolute left-[-48px] bottom-12 bg-white p-8 w-64 shadow-2xl shadow-black/10 z-10 border border-[#B1B3A9]/10">
          <p className="font-sans text-xs leading-[162%] text-[#5E6058] italic">
            "The Himalayan Orchid demands a cool temperament and an appreciation for the subtle rhythm of the seasons."
          </p>
        </div>
      </div>
      
    </section>
  );
};

export default CatalogueHero;
