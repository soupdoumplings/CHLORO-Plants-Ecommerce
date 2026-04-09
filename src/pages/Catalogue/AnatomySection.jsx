import React from 'react';

const AnatomySection = () => {
  return (
    <section className="mb-32 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1440px] mx-auto px-12 group">
      {/* Anatomy Visual Feature */}
      <div className="md:col-span-2 relative aspect-square overflow-hidden shadow-2xl shadow-black/10 transition-all duration-700 hover:scale-[1.02]">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD-JWKExkplCQ2jokkSuAYmb3pq9UPsFzyeTCtNuCP51EgPyF8Hh-klVZFU5bCIoC16DCtwDp0Zcs7uhjNrLg0e_I7fWuA3JTIR4ARgq55L7j2nk_ZOYYYoU2j34w4pqIa-XiizoqFzXnD-G2XPtPzVdgXBDxuOrHqa4w0CjWvqyaZG1qthuL-lhKF3iaP86ZTJYss3ZmJFXJ80nI6RaVjMIF6gPjOvDjjzBL9FQp7O3wJvTnmuspNugg1K1jKsnxF5u8VY7bhJwSt" 
          alt="Leaf Anatomy" 
          className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-[#456565]/10 mix-blend-multiply opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
             <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/70 border border-white/20 px-8 py-3 backdrop-blur-md pointer-events-none">Specimen 842 Anatomy</span>
        </div>
      </div>

      {/* Detail Block 1: Waxy Luster */}
      <div className="bg-[#F5F4ED] p-16 flex flex-col justify-end text-left relative overflow-hidden border border-[#B1B3A9]/10 group/item">
        <div className="absolute top-0 right-0 p-8 text-[#31332C]/5 font-headline italic text-8xl pointer-events-none group-hover/item:text-[#785A1A]/10 transition-colors">01</div>
        <div className="relative z-10 space-y-6">
          <h4 className="serif-display text-4xl leading-tight text-[#31332C] group-hover/item:text-[#785A1A] transition-colors">Waxy <br /> Luster</h4>
          <p className="font-body text-sm leading-relaxed text-[#5E6058] opacity-90 transition-opacity group-hover/item:opacity-100">
             The protective cuticle reflects light, giving the leaves their signature semi-gloss finish.
          </p>
        </div>
      </div>

      {/* Detail Block 2: Violin Form */}
      <div className="bg-[#EFEEE6] p-16 flex flex-col justify-start text-left relative overflow-hidden border border-[#B1B3A9]/10 group/item">
        <div className="absolute bottom-0 right-0 p-8 text-[#31332C]/5 font-headline italic text-8xl pointer-events-none group-hover/item:text-[#785A1A]/10 transition-colors">02</div>
        <div className="relative z-10 space-y-6">
          <h4 className="serif-display text-4xl leading-tight text-[#31332C] group-hover/item:text-[#785A1A] transition-colors">Violin <br /> Form</h4>
          <p className="font-body text-sm leading-relaxed text-[#5E6058] opacity-90 transition-opacity group-hover/item:opacity-100">
             Each leaf tapers toward the middle, mimicking the curves of a fine orchestral instrument.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AnatomySection;
