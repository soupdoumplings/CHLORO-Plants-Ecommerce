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
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div className="text-white max-w-2xl">
          <p className="text-sm uppercase tracking-wider mb-4">HOME-READY PLANTS</p>
          <h2 className="text-6xl mb-6 leading-tight" style={{ fontFamily: 'Lora, serif' }}>It's our birthday! </h2>
          <p className="text-xl mb-8 text-white/90">
            Celebrate all weekend long with up to 30% off All plants
          </p>

          <div className="flex gap-4">
            <button className="bg-[#2D7A4E] text-white px-8 py-3 rounded-full hover:bg-[#235F3D] transition-colors flex items-center gap-2">
              SHOP SELF-WATERING PLANTS
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
              SHOP THE SALE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}