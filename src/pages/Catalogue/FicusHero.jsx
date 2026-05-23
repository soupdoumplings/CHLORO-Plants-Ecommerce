import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';
import { getProductImage, fallbackHeroImage } from '../../lib/localImages';
import { formatRupees, getEffectivePrice, hasActiveSale } from '../../lib/pricing';
import { getProductType, productTypeLabels } from '../../lib/productTypes';

const FicusHero = ({ product }) => {
  const { addToBag } = useCart();
  const wishlist = useWishlist();
  const [added, setAdded] = useState(false);
  const name = product?.name || 'Unknown Product';
  const scientificName = product?.description || '';
  const info = product?.info || 'No product description available yet.';
  const isPlantProduct = Boolean(product) && getProductType(product) === productTypeLabels.plants;
  const provenance = product?.provenance || (isPlantProduct ? 'Origin unknown' : product?.category || 'Catalogue item');
  const onSale = hasActiveSale(product);
  const price = product?.price ? formatRupees(getEffectivePrice(product)) : 'Price on request';
  const originalPrice = onSale ? formatRupees(product.price) : null;
  const heroImage = getProductImage(product, fallbackHeroImage);
  const curatorQuote = product?.curator_quote || (isPlantProduct
    ? '"A beautiful plant for homes that can offer steady light, patient watering, and a little care rhythm."'
    : '"A useful catalogue piece for considered gifting, practical routines, and plant care support."');

  // Split the name into two lines if it has multiple words
  const nameParts = name.split(' ');
  const nameFirstLine = nameParts.slice(0, Math.ceil(nameParts.length / 2)).join(' ');
  const nameSecondLine = nameParts.slice(Math.ceil(nameParts.length / 2)).join(' ');

  const handleAddToBag = async () => {
    if (!product) return;
    try {
      const result = await addToBag({
        ...product,
        effectivePrice: getEffectivePrice(product),
        salePrice: onSale ? Number(product.sale_price) : null,
      });
      if (result?.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      } else if (result?.error) {
        alert(result.error);
      }
    } catch (err) {
      console.error('Add to bag failed:', err);
    }
  };

  const saved = wishlist.isWishlisted(product?.id);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-32 pt-16">
      {/* Left Column: Identity */}
      <Motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-6 lg:sticky lg:top-32 order-2 lg:order-1 text-left pr-8"
      >
          {product?.tags && product.tags.length > 0 && (
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {product.tags.map(tag => (
                <span key={tag} className="inline-block bg-[#0D3535] text-[#FBF9F4] font-label text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 font-medium shadow-sm max-w-[150px] truncate">
                  {tag}
                </span>
              ))}
            </Motion.div>
          )}
          <Motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-label text-[10px] tracking-[0.2rem] uppercase text-[#785A1A] mb-6 font-bold"
          >
            {scientificName || product?.category || 'Plant & Gift Shop'}
          </Motion.p>
          <Motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline text-8xl md:text-[7.5rem] leading-[0.8] mb-12 tracking-tighter text-[#31332C]"
          >
            {nameFirstLine} {nameSecondLine && <><br />{nameSecondLine}</>}
          </Motion.h1>
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[#5E6058] leading-relaxed mb-12 max-w-sm text-lg opacity-90 transition-opacity hover:opacity-100"
          >
              {info}
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 w-full"
          >
            <div>
              <p className="font-label text-[10px] tracking-[0.1rem] uppercase opacity-50 mb-2 font-black">{isPlantProduct ? 'Provenance' : 'Category'}</p>
              <p className="font-body text-sm italic text-[#31332C]">{provenance}</p>
            </div>

            <div className="pt-12 border-t border-[#B1B3A9]/20 flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-end">
              <div>
                <p className="font-label text-[10px] tracking-[0.1rem] uppercase opacity-50 mb-2 font-black">Price</p>
                <p className="font-headline text-4xl text-[#31332C]">
                  {originalPrice && <span className="mb-1 block font-body text-sm text-[#5E6058]/50 line-through">{originalPrice}</span>}
                  {price}
                </p>
                {onSale && (
                  <p className="mt-2 font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#785A1A]">
                    Limited sale
                  </p>
                )}
              </div>
              <div className="flex w-full gap-3 sm:w-auto">
                <Motion.button
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToBag}
                  className="flex-1 bg-[#5F5E5E] px-8 py-5 font-label text-[11px] font-bold uppercase tracking-[0.2rem] text-[#FAF7F6] shadow-2xl shadow-black/5 transition-all hover:bg-[#31332C] sm:w-[190px] sm:flex-none"
                >
                    {added ? 'Added' : 'Add to Bag'}
                </Motion.button>
                <button
                  type="button"
                  onClick={() => wishlist.toggleWishlist(product)}
                  className={`flex h-[58px] w-[58px] items-center justify-center border transition-colors ${
                    saved
                      ? 'border-[#0F3A3A] bg-[#0F3A3A] text-white'
                      : 'border-[#5F5E5E]/30 text-[#0F3A3A] hover:border-[#0F3A3A]'
                  }`}
                  aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <span className="material-symbols-outlined text-[22px]">{saved ? 'favorite' : 'favorite_border'}</span>
                </button>
              </div>
            </div>
          </Motion.div>
      </Motion.div>

      {/* Right Column: Visual Focus */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.97, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F4ED]">
          <img
            src={heroImage}
            alt={name}
            className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-transform duration-[10s] hover:scale-105"
          />
          <Motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-12 -left-6 hidden lg:block bg-white p-8 w-72 shadow-2xl border border-[#B1B3A9]/5 z-20"
          >
            <p className="font-body text-xs italic leading-relaxed text-[#5E6058] opacity-80">
              {curatorQuote}
            </p>
          </Motion.div>
        </div>
      </Motion.div>
    </section>
  );
};

export default FicusHero;
