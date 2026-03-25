import { RatingStars } from "./rating-stars";
import { SocialLinks } from "./social-links";
import { FeatureCard } from "./feature-card";

export function ProductHero({ product }) {
  return (
    <section className="min-h-[70vh] lg:min-h-[700px] bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex flex-col lg:flex-row overflow-hidden border border-gray-100">
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
        <div className="flex-1 w-full flex items-center justify-center relative mt-4 md:mt-0">
          <div className="relative w-[90%] sm:w-[80%] max-w-2xl aspect-square">
            {/* Tagline Box - Anchored to Image Edge */}
            <div className="absolute -left-8 md:-left-16 lg:-left-24 top-1/2 -translate-y-1/2 z-10 hidden md:block bg-white/70 backdrop-blur-xl p-5 lg:p-7 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <h2 className="text-xl lg:text-3xl text-[#2D5A3D] italic leading-tight font-medium" style={{ fontFamily: 'Lora, serif' }}>
                {product.tagline.map((word, i) => (
                  <span key={i} className="block">
                    {word}
                  </span>
                ))}
              </h2>
            </div>

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Rating & Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full">
          <RatingStars rating={product.rating} />
          <SocialLinks />
        </div>
      </div>

      {/* Right Section - Product Details */}
      <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start z-20">
        <div className="max-w-md w-full">
          {/* Product Name */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl text-[#2D5A3D] mb-4 text-center lg:text-left text-balance font-bold tracking-tight" style={{ fontFamily: 'Lora, serif' }}>
            {product.promoTitle}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 text-center lg:text-left">
            {product.promoDescription}
          </p>

          {/* Feature Cards */}
          <div className="space-y-3">
            {product.features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          {/* Price & CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-gray-900">
                ₹{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#2D7A4E] text-white text-base font-medium rounded-full hover:bg-[#235F3D] shadow-lg shadow-[#2D7A4E]/20 transition-all hover:-translate-y-0.5 active:scale-95">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
