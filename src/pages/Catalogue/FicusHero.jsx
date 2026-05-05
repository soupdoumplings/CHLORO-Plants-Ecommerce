import React from 'react';

const FicusHero = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-32 pt-16">
      {/* Left Column: Identity */}
      <div className="lg:col-span-4 lg:sticky lg:top-32 order-2 lg:order-1 text-left">
          <p className="font-label text-[10px] tracking-[0.2rem] uppercase text-[#785A1A] mb-6 font-bold">Specimen No. 842</p>
          <h1 className="font-headline text-8xl md:text-[9.5rem] leading-[0.8] mb-12 tracking-tighter text-[#31332C]">Ficus <br /> Lyrata</h1>
          <p className="font-body text-[#5E6058] leading-relaxed mb-12 max-w-sm text-lg opacity-90 transition-opacity hover:opacity-100">
              Known colloquially as the Fiddle-Leaf Fig, this architectural masterpiece is defined by its dramatic, violin-shaped foliage and sculptural presence. A cornerstone of the curated interior.
          </p>
          
          <div className="space-y-8 w-full">
            <div>
              <p className="font-label text-[10px] tracking-[0.1rem] uppercase opacity-50 mb-2 font-black">Provenance</p>
              <p className="font-body text-sm italic text-[#31332C]">Western Africa, Tropical Lowland Rainforests</p>
            </div>
            
            <div className="pt-12 border-t border-[#B1B3A9]/20 flex justify-between items-end">
              <div>
                <p className="font-label text-[10px] tracking-[0.1rem] uppercase opacity-50 mb-2 font-black">Investment</p>
                <p className="font-headline text-4xl text-[#31332C]">रू 8,900</p>
              </div>
              <button className="bg-[#5F5E5E] text-[#FAF7F6] px-12 py-5 font-label text-[11px] tracking-[0.2rem] uppercase hover:bg-[#31332C] transition-all transform hover:-translate-y-1 shadow-2xl shadow-black/5 font-bold">
                  Acquire Specimen
              </button>
            </div>
          </div>
      </div>

      {/* Right Column: Visual Focus */}
      <div className="lg:col-span-8 order-1 lg:order-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F4ED]">
          <img 
            src="https://images.pexels.com/photos/6477994/pexels-photo-6477994.jpeg" 
            alt="Ficus Lyrata" 
            className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-transform duration-[10s] hover:scale-105" 
          />
          <div className="absolute bottom-12 -left-12 hidden lg:block bg-white p-10 w-72 shadow-2xl border border-[#B1B3A9]/5">
            <p className="font-body text-xs italic leading-relaxed text-[#5E6058] opacity-80">
              "The Lyrata requires patience and an understanding of light's gentle choreography. Focus on balance."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FicusHero;
