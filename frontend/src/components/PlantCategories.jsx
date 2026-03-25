import { Sun, Heart, Sparkles, Leaf, ArrowRight } from 'lucide-react';

export function PlantCategories({ onProductClick }) {
  const categories = [
    {
      title: 'Low Light',
      description: 'Thrives in shady spots',
      icon: Sun,
      image: 'https://images.unsplash.com/photo-1640924011945-2f7f2b83d08c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGFyayUyMHBsYW50cyUyMHNoZWxmfGVufDF8fHx8MTc3NDIwODQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Pet-Friendly',
      description: 'Safe for furry friends',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1731919546963-a826a2011b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRvZyUyMGluZG9vciUyMHBsYW50fGVufDF8fHx8MTc3NDIwODQ3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Statement Plants',
      description: 'Bold and dramatic',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1657707251970-cf49a3b0bf59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjYXJpbmclMjBsYXJnZSUyMGZpZGRsZSUyMGxlYWYlMjBmaWd8ZW58MXx8fHwxNzc0MjA4NDc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      title: 'Easy Care',
      description: 'Hard to kill',
      icon: Leaf,
      image: 'https://images.unsplash.com/photo-1603712720632-7d5abdd039df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmFrZSUyMHBsYW50cyUyMGNvbGxlY3Rpb24lMjBwb3R0ZXJ5fGVufDF8fHx8MTc3NDIwODQ3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  return (
    <section className="py-20 bg-[#F5F1ED]">
      <div className="w-full mx-auto px-6 md:px-12 xl:px-20">
        <div className="text-center mb-12">
          <p className="text-sm text-[#2D7A4E] uppercase tracking-wider mb-4">
            FIND YOUR PERFECT PLANT
          </p>
          <h2 className="text-6xl text-[#2D5A3D] mb-4" style={{ fontFamily: 'Lora, serif' }}>
            What kind of plant parent are you?
          </h2>
          <p className="text-lg text-gray-600">
            Tell us about your space and we'll match you with plants that will thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => onProductClick && onProductClick({
                  name: category.title,
                  price: 39,
                  originalPrice: 55,
                  rating: 4.8,
                  image: category.image,
                  category: category.description
                })}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button className="text-gray-900 font-bold hover:text-gray-700 flex items-center gap-2 mx-auto">
            Or browse all plants
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
