import { motion as Motion } from "framer-motion";
import { RatingStars } from "./rating-stars";
import { FeatureCard } from "./feature-card";
import { useCart } from "../../../../lib/CartContext";
import { useWishlist } from "../../../../lib/WishlistContext";

export function ProductHero({ product }) {
  const { addToBag } = useCart();
  const wishlist = useWishlist();
  const saved = wishlist.isWishlisted(product.id);

  return (
    <Motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[70vh] lg:min-h-[700px] bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex flex-col lg:flex-row overflow-hidden border border-gray-100"
    >
      {/* Left Section - Image & Tagline */}
      <div className="relative flex-1 bg-[#F5F1ED] p-6 md:p-12 flex flex-col items-center justify-center">

        {/* Mobile Tagline */}
        <div className="md:hidden text-center mb-6 z-10 relative">
          <div className="inline-block bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/60 shadow-sm">
            <h2 className="text-2xl text-[#2D5A3D] italic font-medium" style={{ fontFamily: 'Lora, serif' }}>
              {product.tagline.join(" ")}
            </h2>
          </div>
        </div>

        {/* Plant Image & Desktop Tagline */}
        <div className="flex-1 w-full flex items-center justify-center relative my-6 md:my-0">
          <div className="relative w-[90%] sm:w-[80%] lg:w-[75%] max-w-lg aspect-[4/5]">
            {/* Tagline Box */}
            <Motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -left-8 md:-left-16 lg:-left-24 top-1/2 -translate-y-1/2 z-10 hidden md:block bg-white/40 backdrop-blur-2xl p-6 lg:p-8 rounded-3xl border border-white/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_8px_40px_rgba(0,0,0,0.03)] duration-700 hover:scale-[1.02] cursor-default"
            >
              <h2 className="text-2xl lg:text-4xl text-[#2D5A3D] italic leading-tight font-medium opacity-90" style={{ fontFamily: 'Lora, serif' }}>
                {product.tagline.map((word, i) => (
                  <span key={i} className="block">
                    {word}
                  </span>
                ))}
              </h2>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full overflow-hidden rounded-[2rem] shadow-sm bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105 ease-out"
              />
            </Motion.div>
          </div>
        </div>

        {/* Rating & Social Links */}
        <Motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-4 mt-6 w-full"
        >
          <RatingStars rating={product.rating} />
        </Motion.div>
      </div>

      {/* Right Section - Product Details */}
      <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start z-20">
        <div className="max-w-md w-full">
          {/* Product Name */}
          <Motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl text-[#2D5A3D] mb-4 text-center lg:text-left text-balance font-bold tracking-tight" style={{ fontFamily: 'Lora, serif' }}
          >
            {product.promoTitle}
          </Motion.h3>

          {/* Description */}
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-500 font-light text-base lg:text-lg leading-[1.8] mb-10 text-center lg:text-left"
          >
            {product.promoDescription}
          </Motion.p>

          {/* Feature Cards */}
          <div className="space-y-6 mb-12">
            {product.features.map((feature, idx) => (
              <Motion.div
                key={feature.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeatureCard feature={feature} />
              </Motion.div>
            ))}
          </div>

          {/* Price & CTA */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100"
          >
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] tracking-widest uppercase text-gray-400 font-medium mb-1">Total Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-3xl font-normal text-gray-900" style={{ fontFamily: 'Lora, serif' }}>
                  रू {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm font-light">
                    रू {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Motion.button
                whileHover={{ y: -2, boxShadow: '0 14px 30px rgba(45,122,78,0.18)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToBag(product)}
                className="w-full rounded-full bg-[#2D7A4E] px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white shadow-lg shadow-[#2D7A4E]/15 transition-colors duration-200 hover:bg-[#235F3D] sm:w-auto"
              >
                Add to Bag
              </Motion.button>
              <button
                type="button"
                onClick={() => wishlist.toggleWishlist(product)}
                className={`flex h-[48px] w-full items-center justify-center rounded-full border transition-all duration-300 sm:w-[54px] ${saved
                    ? 'border-[#139D60]/20 bg-white shadow-[0_4px_12px_rgba(19,157,96,0.12)]'
                    : 'border-[#0F3A3A]/25 bg-white text-[#0F3A3A] hover:border-[#0F3A3A]'
                  }`}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                title={saved ? 'Saved to wishlist' : 'Save to wishlist'}
              >
                <span className={`material-symbols-outlined text-[20px] transition-all duration-300 ${saved ? 'text-[#139D60] fill-1 scale-110' : 'text-[#0F3A3A]'}`}>
                  {saved ? 'favorite' : 'favorite_border'}
                </span>
              </button>
            </div>
          </Motion.div>
        </div>
      </div>
    </Motion.section>
  );
}
