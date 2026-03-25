import { ArrowRight } from 'lucide-react';

export function CareTools({ onProductClick, onNavigate }) {
  const tools = [
    {
      name: 'EcoRain',
      price: 26,
      badge: 'SALE',
      image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg'
    },
    {
      name: 'Asparagus Plant Stand',
      price: 36,
      badge: 'SALE',
      image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg'
    },
    {
      name: 'Grow Light',
      price: 97,
      badge: 'SALE',
      image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg'
    },
    {
      name: 'Stained Glass Decor',
      price: 38,
      badge: 'SALE',
      image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg'
    },
    {
      name: 'Mister',
      price: 15,
      badge: 'SALE',
      image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg'
    },
    {
      name: 'Watering Can',
      price: 22,
      badge: 'SALE',
      image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg'
    },
    {
      name: 'Garden Shears',
      price: 18,
      badge: 'SALE',
      image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg'
    }
  ];

  return (
    <section className="py-20 bg-[#F5F1ED]">
      <div className="w-full mx-auto px-6 md:px-12 xl:px-20">
        {/* Featured Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1652122788538-9aba111c550e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGZlcnRpbGl6ZXIlMjBib3R0bGUlMjBvcmdhbmljfGVufDF8fHx8MTc3NDIwOTA4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Plant care tools"
              className="w-full h-[500px] object-cover"
            />
          </div>

          {/* Text Content */}
          <div>
            <p className="text-xs font-bold text-[#2D5A3D]/70 uppercase tracking-[0.2em] mb-4">
              CARE, POTS & DECOR 🪴
            </p>
            <h2 className="text-5xl lg:text-6xl text-[#2D5A3D] mb-6 leading-tight drop-shadow-sm" style={{ fontFamily: 'Lora, serif' }}>
              Everything to help them thrive
            </h2>
            <p className="text-lg text-gray-600 font-light mb-10 leading-relaxed max-w-lg">
              From our exclusive EcoPots collection to essential care tools and handcrafted Ayurveda decor, we have everything you need to nurture your plants and show off your style.
            </p>
            <button 
              onClick={() => onNavigate && onNavigate('catalog')}
              className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 hover:text-[#2D7A4E] transition-colors flex items-center gap-3 group"
            >
              Shop Care Tools
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
          {tools.map((tool) => (
            <div key={tool.name} className="group cursor-pointer" onClick={() => onProductClick && onProductClick({
              name: tool.name,
              price: tool.price,
              originalPrice: null,
              rating: 4.8,
              image: tool.image,
              category: tool.badge
            })}>
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white relative shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-50/50">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover transform transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
                {tool.badge && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-[0.15em] uppercase text-[#2D5A3D] px-3 py-1.5 rounded-full shadow-sm">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h3 className="text-base font-normal text-gray-900 leading-tight mb-1" style={{ fontFamily: 'Lora, serif' }}>{tool.name}</h3>
              <p className="text-[15px] font-medium text-[#2D5A3D]">₹{tool.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
