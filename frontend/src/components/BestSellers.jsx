import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function BestSellers({ onProductClick }) {
  const products = [
    {
      name: 'Money Tree',
      category: 'EASY CARE',
      price: 48,
      originalPrice: 65,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/6915358/pexels-photo-6915358.jpeg',
      colors: ['#8B9B7E', '#5A6B52', '#E8DDD3']
    },
    {
      name: 'Tough Stuff Collection',
      category: 'EASY CARE',
      price: 71,
      originalPrice: 95,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/6915358/pexels-photo-6915358.jpeg',
      colors: ['#2C3E2E']
    },
    {
      name: 'Red Prayer Plant',
      category: 'PET FRIENDLY',
      price: 38,
      originalPrice: 52,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/6964562/pexels-photo-6964562.jpeg',
      colors: ['#D4A373', '#E8DDD3']
    },
    {
      name: 'Bamboo Palm',
      category: 'LOW LIGHT',
      price: 85,
      originalPrice: 115,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/6964562/pexels-photo-6964562.jpeg',
      colors: ['#2C3E2E', '#4A5F4A', '#6B7F6B']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="w-full mx-auto px-6 md:px-12 xl:px-20">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <h2 className="text-4xl text-[#2D5A3D]" style={{ fontFamily: 'Lora, serif' }}>Best Sellers</h2>
          <a href="#" className="text-xs font-bold text-[#2D5A3D] hover:text-[#2D7A4E] uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
            SHOP ALL
            <span className="text-lg leading-none">&rsaquo;</span>
          </a>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.name} {...product} onClick={onProductClick} />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] flex items-center justify-center hover:bg-white transition-all hover:scale-105 border border-gray-100">
            <ChevronLeft className="w-5 h-5 text-gray-700 stroke-[1.5]" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.06)] flex items-center justify-center hover:bg-white transition-all hover:scale-105 border border-gray-100">
            <ChevronRight className="w-5 h-5 text-gray-700 stroke-[1.5]" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-gray-800"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
}
