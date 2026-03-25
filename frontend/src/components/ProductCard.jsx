
export function ProductCard({ name, category, price, originalPrice, rating, image, colors }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-[#2D5A3D]">
          {category}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-light text-gray-900" style={{ fontFamily: 'Lora, serif' }}>{name}</h3>
        
        <div className="text-right">
          <div className="text-lg font-light text-[#2D5A3D]">${price}</div>
        </div>
      </div>
      

    </div>
  );
}
