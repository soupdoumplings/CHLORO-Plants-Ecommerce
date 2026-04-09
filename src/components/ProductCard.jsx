import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="group cursor-pointer transition-all duration-700 hover:-translate-y-1">
      <div className="aspect-[4/5] overflow-hidden bg-[#efeee6] mb-8 relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
        {/* Hover View Label */}
        <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase bg-white/90 backdrop-blur-md text-[#31332c] px-4 py-2 rounded-full shadow-lg">View Details</span>
            <span className="material-symbols-outlined text-white text-base">shopping_bag</span>
        </div>
      </div>
      
      <div className="flex justify-between items-start group-hover:px-1 transition-all">
        <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h3 className="font-headline text-2xl mb-1 text-[#31332c] group-hover:text-[#785a1a] transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="font-label text-[9px] uppercase tracking-widest text-[#797c73] font-bold">
            {product.category || "Kathmandu selection"}
          </p>
        </div>
        <span className="font-serif text-xl font-medium text-[#31332c]">
          रू {product.price}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
