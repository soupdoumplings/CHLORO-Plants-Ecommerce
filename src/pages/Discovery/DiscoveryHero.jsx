import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { productAssetImages } from '../../lib/localImages';

const formatPrice = (product) => {
  if (!product) return 'Shop';
  const value = Number(product.rawPrice || product.salePrice || 0);
  if (!value) return product.price || 'View';
  return `रू ${value.toLocaleString('en-NP')}`;
};

const productCode = (product) => {
  if (!product?.id) return 'ITEM 042';
  return `ITEM ${String(product.id).replace(/-/g, '').slice(0, 3).toUpperCase()}`;
};

const DiscoveryHero = ({ featuredProduct, totalCount = 0, onBrowse }) => {
  const heroImage = featuredProduct?.image || productAssetImages.monstera;
  const heroName = featuredProduct?.name || 'Plants & Gifts';
  const heroCategory = featuredProduct?.category || 'Shop Collection';
  const heroSeason = featuredProduct?.season || 'All Year';
  const heroTags = featuredProduct?.tags || [];

  return (
    <section className="relative overflow-hidden border-b border-[#11110E]/10 bg-[#F8F6F1] pt-[82px] text-[#11110E]">
      <div className="mx-auto grid min-h-[calc(100vh-82px)] w-[90vw] max-w-[1720px] grid-cols-1 lg:grid-cols-[78px_minmax(0,0.94fr)_minmax(540px,1.06fr)]">
        <aside className="hidden border-x border-[#11110E]/10 lg:flex lg:flex-col lg:items-center lg:justify-end lg:gap-12 lg:pb-20">
          {['Plants', 'Care Tools', 'Pots & Gifts'].map((item) => (
            <span key={item} className="rotate-180 font-label text-[10px] uppercase tracking-[0.34em] text-[#11110E]/58 [writing-mode:vertical-rl]">
              {item}
            </span>
          ))}
        </aside>

        <div className="flex flex-col justify-center px-6 py-16 md:px-10 lg:px-16 lg:py-20">
          <Motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-label text-[10px] uppercase tracking-[0.32em] text-[#6D695F]"
          >
            Shop Plants, Tools & Gifts
          </Motion.p>

          <Motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[620px] font-headline text-[64px] leading-[0.86] tracking-tight md:text-[96px] lg:text-[112px]"
          >
            Discover
            <span className="block italic font-light">Plants</span>
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-[560px] font-body text-[17px] leading-8 text-[#4F4B43]"
          >
            Shop indoor plants, care tools, pots, and gift-ready picks selected for Nepal homes, balconies, and everyday plant care.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={onBrowse}
              className="border border-[#11110E] px-7 py-4 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FBF9F4]"
            >
              Shop Collection
            </button>
            {featuredProduct?.id && (
              <Link
                to={`/catalogue/${featuredProduct.id}`}
                className="bg-[#0F3A3A] px-7 py-4 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBF9F4] transition-colors hover:bg-[#11110E]"
              >
                View Featured Item
              </Link>
            )}
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid max-w-[430px] grid-cols-[120px_1fr] border border-[#11110E]/12 bg-[#FFFEFA] p-4"
          >
            <img src={productAssetImages.monstera} alt="" className="h-24 w-full object-cover grayscale" />
            <div className="flex flex-col justify-center px-4">
              <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#6D695F]">Shopping Help</p>
              <p className="mt-2 font-body text-[14px] leading-relaxed text-[#4F4B43]">
                Compare light needs, care level, stock, and price before adding anything to your bag.
              </p>
            </div>
          </Motion.div>
        </div>

        <Motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[560px] overflow-hidden border-t border-[#11110E]/10 bg-[#E8E8E0] lg:min-h-0 lg:border-l lg:border-t-0"
        >
          <img
            src={heroImage}
            alt={heroName}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F1]/12 via-transparent to-[#F8F6F1]/8" />

          <div className="absolute bottom-8 right-6 w-[min(320px,calc(100%-48px))] border border-[#11110E]/18 bg-[#FFFEFA]/96 p-5 shadow-[0_24px_70px_rgba(17,17,14,0.16)] backdrop-blur-sm md:right-10">
            <div className="flex items-start justify-between gap-5">
              <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#6D695F]">{productCode(featuredProduct)}</p>
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-[#0F3A3A]">{formatPrice(featuredProduct)}</p>
            </div>
            <h2 className="mt-4 font-headline text-[34px] leading-[0.95] text-[#11110E]">{heroName}</h2>
            <p className="mt-3 font-label text-[10px] uppercase tracking-[0.18em] text-[#6D695F]">
              {heroCategory} // {heroSeason}
            </p>
            {heroTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {heroTags.slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-[#E8E8E0] px-2.5 py-1 font-label text-[9px] uppercase tracking-[0.14em] text-[#4F4B43]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {featuredProduct?.id && (
              <Link
                to={`/catalogue/${featuredProduct.id}`}
                className="mt-5 flex w-full items-center justify-center bg-[#11110E] px-5 py-3.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBF9F4] transition-colors hover:bg-[#0F3A3A]"
              >
                View Details
              </Link>
            )}
          </div>

          <div className="absolute left-6 top-6 border border-[#11110E]/12 bg-[#FFFEFA]/88 px-4 py-3 backdrop-blur-sm md:left-10">
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#6D695F]">
              {String(totalCount || 0).padStart(2, '0')} products available
            </p>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default DiscoveryHero;
