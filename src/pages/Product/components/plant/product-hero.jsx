import { motion } from "framer-motion";
import { RatingStars } from "./rating-stars";
import { SocialLinks } from "./social-links";
import { FeatureCard } from "./feature-card";

export function ProductHero({ product }) {
  return (
    <motion.section 
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
            <motion.div 
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
            </motion.div>

            <motion.div 
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
            </motion.div>
          </div>
        </div>

        {/* Rating & Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full"
        >
          <RatingStars rating={product.rating} />
          <SocialLinks />
        </motion.div>
      </div>

      {/* Right Section - Product Details */}
      <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start z-20">
        <div className="max-w-md w-full">
          {/* Product Name */}
          <motion.h3 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl text-[#2D5A3D] mb-4 text-center lg:text-left text-balance font-bold tracking-tight" style={{ fontFamily: 'Lora, serif' }}
          >
            {product.promoTitle}
          </motion.h3>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-500 font-light text-base lg:text-lg leading-[1.8] mb-10 text-center lg:text-left"
          >
            {product.promoDescription}
          </motion.p>

          {/* Feature Cards */}
          <div className="space-y-6 mb-12">
            {product.features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>

          {/* Price & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100"
          >
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] tracking-widest uppercase text-gray-400 font-medium mb-1">Total Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-3xl font-normal text-gray-900" style={{ fontFamily: 'Lora, serif' }}>
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm font-light">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <motion.button 
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(45,122,78,0.25)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-10 py-4 bg-[#2D7A4E] text-white text-xs tracking-[0.2em] font-medium uppercase rounded-full hover:bg-[#235F3D] shadow-lg shadow-[#2D7A4E]/20 transition-all duration-500 active:scale-95"
            >
              Add to Cart
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
