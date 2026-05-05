import React from 'react';

const Hero = () => {
  return (
    <header className="relative w-full h-screen flex flex-col justify-center px-12 pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/28449944/pexels-photo-28449944.jpeg" 
          alt="Himalayan Flora" 
          className="w-full h-full object-cover grayscale-[0.2] brightness-[0.9] transition-transform duration-[10s] hover:scale-105"
        />
      </div>
      
      <div className="relative z-10 max-w-4xl text-left">
        <p className="font-label text-[11px] tracking-[0.25em] uppercase mb-4 text-white font-semibold opacity-90 animate-in fade-in slide-in-from-bottom-2 duration-700">
          The High-Altitude Collection
        </p>
        <h1 className="font-headline text-7xl md:text-[10rem] tracking-tighter leading-[0.85] text-white mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Himalayan <br /> 
          <span className="italic font-extralight opacity-95">Elegance.</span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <button className="bg-white text-[#31332c] px-12 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#fbf9f4] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-black/10">
            Explore the Archive
          </button>
          
          <div className="flex items-center gap-5 group cursor-pointer text-white">
            <div className="w-14 h-14 border border-white/20 flex items-center justify-center group-hover:bg-white transition-all duration-500 rounded-sm">
              <span className="material-symbols-outlined text-white group-hover:text-[#31332c] transition-colors text-2xl">
                camera
              </span>
            </div>
            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.2em] text-white/60 font-bold">AI Powered</p>
              <p className="font-headline italic text-lg text-white">AI Diagnosis</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator for that editorial feel */}
      <div className="absolute bottom-10 left-12 flex items-center gap-4 animate-bounce">
         <span className="w-[1px] h-10 bg-white/40"></span>
         <span className="text-[9px] uppercase tracking-widest text-white/60 font-bold vertical-text">Scroll</span>
      </div>
    </header>
  );
};

export default Hero;
