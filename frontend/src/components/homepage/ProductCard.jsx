import { Star, Heart } from 'lucide-react';

export function ProductCard({ name, category, price, originalPrice, rating, image, colors }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-5 h-5 text-gray-900" />
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-gray-500 tracking-wider uppercase">{category}</p>
        <div className="flex justify-between items-start">
          <h3 className="text-lg text-gray-900" style={{ fontFamily: 'Lora, serif' }}>{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-black text-black" />
            <span className="text-xs font-semibold">{rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg text-[#2D7A4E]">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
          )}
        </div>
        
        {colors && (
          <div className="flex gap-1.5 mt-3">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
