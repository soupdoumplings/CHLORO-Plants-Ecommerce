import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <video
          src="/vid/petals.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full w-full mx-auto px-6 md:px-12 xl:px-20 flex items-center">
        <div className="text-white max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-white/80">HOME-READY PLANTS</p>
          <h2 className="text-5xl md:text-7xl mb-6 leading-[1.1] font-medium drop-shadow-sm" style={{ fontFamily: 'Lora, serif' }}>Bring nature indoors.</h2>
          <p className="text-lg md:text-xl mb-10 text-white/90 font-light max-w-lg leading-relaxed">
            Discover our curated collection of vibrant, easy-care plants designed to elevate your everyday space.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <button className="bg-[#2D7A4E] text-white px-10 py-4 rounded-full text-xs font-medium tracking-[0.15em] hover:bg-[#235F3D] transition-all duration-500 flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
              SHOP SELF-WATERING PLANTS
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-white/80 backdrop-blur-sm text-white px-10 py-4 rounded-full text-xs font-medium tracking-[0.15em] hover:bg-white hover:text-[#2D5A3D] transition-all duration-500 flex items-center justify-center">
              SHOP THE SALE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}