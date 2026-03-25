import { ArrowRight } from 'lucide-react';

const tools = [
  { name: 'EcoRain', price: 26, badge: 'SALE', image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg' },
  { name: 'Grow Light', price: 97, badge: 'SALE', image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg' },
  { name: 'Mister', price: 15, badge: 'SALE', image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg' },
  { name: 'Watering Can', price: 22, badge: 'SALE', image: 'https://images.pexels.com/photos/8292069/pexels-photo-8292069.jpeg' }
];

export function CareTools() {
  return (
    <section className="py-20 bg-[#F5F1ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1652122788538-9aba111c550e"
              alt="Plant care tools"
              className="w-full h-[500px] object-cover"
            />
          </div>

          <div>
            <p className="text-sm text-[#2D7A4E] uppercase tracking-wider mb-4">
              CARE, POTS & DECOR 🪴
            </p>
            <h2 className="text-5xl text-[#2D5A3D] mb-6 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
              Everything to help them thrive
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From our exclusive EcoPots collection to essential care tools and handcrafted Ayurveda decor, we have everything you need to nurture your plants and show off your style.
            </p>
            <button className="text-[#2D7A4E] hover:text-[#235F3D] flex items-center gap-2 group">
              <span className="uppercase tracking-wider text-sm">Shop Care Tools</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div key={tool.name} className="group cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-white relative">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {tool.badge && (
                  <span className="absolute top-2 left-2 bg-[#2D7A4E] text-white text-xs px-2 py-1 rounded">
                    {tool.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm text-gray-900 mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-700">${tool.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
