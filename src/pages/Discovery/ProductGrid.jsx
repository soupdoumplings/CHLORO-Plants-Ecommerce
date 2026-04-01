import React from 'react';
import { Link } from 'react-router-dom';

const aspectMap = {
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[3/5]',
};

const DiscoveryProductCard = ({ product }) => {
  const aspect = aspectMap[product.aspect] || 'aspect-[4/5]';

  return (
    <Link to={`/catalogue/${product.id}`} className="group cursor-pointer block">
      {/* Image Container */}
      <div className={`${aspect} overflow-hidden bg-[#EFEEE6] relative mb-5`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-500" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-[#456565] text-white font-label text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 font-medium">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="font-headline text-[18px] text-[#31332C] leading-snug group-hover:text-[#785A1A] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="font-label text-[9px] tracking-[0.12em] uppercase text-[#797C73] font-medium">
            {product.category}
          </p>
        </div>
        <span className="font-headline text-[16px] text-[#31332C] whitespace-nowrap pt-0.5">
          {product.price}
        </span>
      </div>
    </Link>
  );
};

const ProductGrid = ({ products }) => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-10 lg:px-14 pb-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
        {products.map((product) => (
          <DiscoveryProductCard key={product.id} product={product} />  
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
