import { Sun, Heart, Sparkles, Leaf, ArrowRight } from 'lucide-react';

const categories = [
  {
    title: 'Low Light', description: 'Thrives in shady spots', icon: Sun,
    image: 'https://images.pexels.com/photos/7655923/pexels-photo-7655923.jpeg'
  },
  {
    title: 'Pet-Friendly', description: 'Safe for furry friends', icon: Heart,
    image: 'https://images.pexels.com/photos/7655923/pexels-photo-7655923.jpeg'
  },
  {
    title: 'Statement Plants', description: 'Bold and dramatic', icon: Sparkles,
    image: 'https://images.pexels.com/photos/4671039/pexels-photo-4671039.jpeg'
  },
  {
    title: 'Easy Care', description: 'Hard to kill', icon: Leaf,
    image: 'https://images.pexels.com/photos/4671039/pexels-photo-4671039.jpeg'
  }
];

export function PlantCategories() {
  return (
    <section className="py-20 bg-[#F5F1ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm text-[#2D7A4E] uppercase tracking-wider mb-4">CATEGORIES</p>
            <h2 className="text-5xl text-[#2D5A3D]" style={{ fontFamily: 'Lora, serif' }}>Shop by category</h2>
          </div>
          <button className="text-[#2D7A4E] hover:text-[#235F3D] flex items-center gap-2 group">
            <span className="uppercase tracking-wider text-sm">View all</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className="group cursor-pointer relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-[#C8E6C9] group-hover:text-[#2D7A4E] transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-medium mb-2">{category.title}</h3>
                  <p className="text-white/80 text-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
