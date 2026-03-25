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
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl text-[#2D5A3D]" style={{ fontFamily: 'Lora, serif' }}>Best Sellers</h2>
          <a href="#" className="text-sm text-[#2D7A4E] hover:underline uppercase tracking-wider">
            SHOP ALL
          </a>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.name} {...product} onClick={onProductClick} />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-6 h-6 text-gray-700" />
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
