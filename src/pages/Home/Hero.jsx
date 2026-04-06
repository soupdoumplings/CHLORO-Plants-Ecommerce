import React from 'react';
import { Aperture } from 'lucide-react';

const Hero = () => {
  return (
    <header className="relative w-full h-screen flex flex-col justify-center px-12 pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover grayscale-[0.05] brightness-[0.85] transition-opacity duration-1000"
        >
          <source src="/flo.mp4" type="video/mp4" />
        </video>
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

          {/* AI Diagnosis Button */}
          <button className="flex items-center gap-4 group cursor-pointer transition-all duration-300">
            <div className="w-12 h-12 flex items-center justify-center border border-white/20 backdrop-blur-sm group-hover:border-white/40 transition-colors">
              <Aperture className="w-5 h-5 text-white" strokeWidth={1.2} />
            </div>
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1">
                AI Powered
              </span>
              <span className="block font-headline text-2xl italic text-white/90 leading-tight">
                Al Diagnosis
              </span>
            </div>
          </button>
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
