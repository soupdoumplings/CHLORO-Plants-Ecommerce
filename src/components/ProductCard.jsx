import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { useWishlist } from '../lib/WishlistContext';

const ProductCard = ({ product, delay = 0 }) => {
  const { addToBag } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.isWishlisted(product.id);

  return (
    <Link to={`/catalogue/${product.id}`} className="block h-full">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        className="group cursor-pointer block h-full flex flex-col"
      >
        <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#e2e3d9]/30">
          <Motion.img
            initial={{ scale: 1.05 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              wishlist.toggleWishlist(product);
            }}
            className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border transition-colors ${
              saved
                ? 'border-[#0F3A3A] bg-[#0F3A3A] text-white'
                : 'border-white/75 bg-white/85 text-[#0F3A3A] hover:bg-white'
            }`}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <span className="material-symbols-outlined text-[20px]">{saved ? 'favorite' : 'favorite_border'}</span>
          </button>

          {product.isOnSale && (
            <span className="absolute left-4 top-4 z-20 bg-[#785A1A] px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-white">
              Sale
            </span>
          )}

          <div className="absolute bottom-2 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center">
            <Motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToBag(product);
              }}
              whileHover={{ y: -2, backgroundColor: '#31332c', color: '#fbf9f4' }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/90 backdrop-blur-sm px-8 py-3 w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#31332c] shadow-lg"
            >
              Add to Bag
            </Motion.button>
          </div>
        </div>

        <div className="px-1 flex-grow flex flex-col">
          <div className="flex justify-between items-start gap-5 mb-2">
            <h3 className="font-headline text-[25px] leading-tight text-[#31332c] group-hover:text-[#785a1a] transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 whitespace-nowrap text-right font-serif text-[18px] text-[#31332c]">
              {product.isOnSale && product.originalPrice ? (
                <>
                  <span className="block text-[12px] text-[#5e6058]/50 line-through">रू {product.originalPrice}</span>
                  <span>रू {product.price}</span>
                </>
              ) : (
                <>रू {product.price}</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 opacity-60 mt-auto pt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#785a1a]" />
            <p className="font-label text-[9px] uppercase tracking-[0.2em] font-bold text-[#5e6058]">
              {product.category}
            </p>
          </div>
        </div>
      </Motion.div>
    </Link>
  );
};

export default ProductCard;
