
export function ProductCard({ name, category, price, originalPrice, rating, image, colors, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick({ name, category, price, originalPrice, rating, image, colors });
    }
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50/50">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transform transition-transform duration-[2000ms] ease-out group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.15em] uppercase text-[#2D5A3D] shadow-sm">
          {category}
        </div>
      </div>
      
      <div className="flex justify-between items-start gap-4 mb-2">
        <h3 className="text-lg font-normal text-gray-900 leading-tight" style={{ fontFamily: 'Lora, serif' }}>{name}</h3>
        
        <div className="text-right">
          <div className="text-[15px] font-medium text-[#2D5A3D]">₹{price.toFixed(2)}</div>
        </div>
      </div>
      

    </div>
  );
}
