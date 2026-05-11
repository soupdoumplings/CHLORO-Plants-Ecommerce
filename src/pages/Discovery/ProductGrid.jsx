import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';

const money = (value) => `रू ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const refCode = (product) => `REF. ${String(product.id || product.name || 'CHLORO')
  .replace(/-/g, '')
  .slice(0, 6)
  .toUpperCase()}`;

const SkeletonCard = ({ index }) => (
  <div className="border border-[#11110E]/12 bg-[#FFFEFA] p-5">
    <div className="aspect-[1/1.08] animate-pulse bg-[#E8E8E0]" />
    <div className="mt-5 h-7 w-2/3 animate-pulse bg-[#E8E8E0]" />
    <div className="mt-4 h-4 w-full animate-pulse bg-[#E8E8E0]" />
    <div className="mt-2 h-4 w-3/4 animate-pulse bg-[#E8E8E0]" />
    <div className="mt-5 h-11 animate-pulse bg-[#E8E8E0]" />
    <span className="sr-only">Loading product {index + 1}</span>
  </div>
);

const DiscoveryProductCard = ({ product, index }) => {
  const { addToBag } = useCart();
  const wishlist = useWishlist();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const saved = wishlist.isWishlisted(product.id);
  const stock = Number(product.stock ?? 1);
  const isSoldOut = stock <= 0;
  const lowStock = stock > 0 && stock <= 3;
  const displayPrice = money(product.rawPrice);
  const tags = product.tags || [];

  const handleAddToBag = async () => {
    if (isSoldOut) return;

    try {
      const result = await addToBag(product);
      if (result?.success) {
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      } else if (result?.error) {
        window.alert(result.error);
      }
    } catch (err) {
      console.error('Add to bag failed:', err);
    }
  };

  const handleWishlist = async () => {
    await wishlist.toggleWishlist(product);
  };

  return (
    <Motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.72, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group border border-[#11110E]/12 bg-[#FFFEFA] p-5 transition-colors hover:border-[#11110E]/32"
    >
      <div className="relative aspect-[1/1.08] overflow-hidden bg-[#E8E8E0]">
        <Link to={`/catalogue/${product.id}`} className="block h-full">
          <Motion.img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-[filter] duration-500 group-hover:grayscale-0 sm:grayscale-[18%]"
            whileHover={{ scale: 1.025 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </Link>

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <span className="border border-[#11110E]/14 bg-[#FFFEFA]/92 px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.18em] text-[#11110E] backdrop-blur-sm">
            {refCode(product)}
          </span>
          {product.type && (
            <span className="w-max bg-[#0F3A3A] px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-white">
              {product.type}
            </span>
          )}
          {product.isOnSale && (
            <span className="w-max bg-[#785A1A] px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-white">
              Sale
            </span>
          )}
          {lowStock && (
            <span className="w-max border border-[#9F403D]/25 bg-[#FFFEFA]/92 px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.14em] text-[#9F403D]">
              Low Stock
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center border transition-colors ${
            saved
              ? 'border-[#0F3A3A] bg-[#0F3A3A] text-white'
              : 'border-[#11110E]/14 bg-[#FFFEFA]/90 text-[#11110E] hover:border-[#11110E]'
          }`}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className="material-symbols-outlined text-[20px]">{saved ? 'favorite' : 'favorite_border'}</span>
        </button>
      </div>

      <div className="mt-5 border-t border-[#11110E]/12 pt-4">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <Link to={`/catalogue/${product.id}`} className="font-headline text-[29px] leading-[0.96] text-[#11110E] transition-colors hover:text-[#785A1A]">
              {product.name}
            </Link>
            <p className="mt-2 font-label text-[8px] uppercase tracking-[0.2em] text-[#6D695F]">
              {product.category} / {product.season}
            </p>
          </div>
          <div className="shrink-0 text-right">
            {product.isOnSale && product.originalPrice ? (
              <>
                <p className="font-label text-[8px] uppercase tracking-[0.12em] text-[#9F403D]">Sale</p>
                <p className="font-headline text-[17px] leading-none text-[#11110E]">{displayPrice}</p>
                <p className="mt-1 font-body text-[11px] text-[#6D695F]/55 line-through">{money(product.originalPrice)}</p>
              </>
            ) : (
              <p className="font-headline text-[18px] leading-none text-[#11110E]">{displayPrice}</p>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-[#11110E]/10 py-4">
          <div>
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-[#6D695F]">Stock</p>
            <p className="mt-1 font-body text-[12px] text-[#11110E]">{isSoldOut ? 'Sold out' : `${stock} available`}</p>
          </div>
          <div>
            <p className="font-label text-[8px] uppercase tracking-[0.2em] text-[#6D695F]">Best For</p>
            <p className="mt-1 font-body text-[12px] text-[#11110E]">{product.type || tags[0] || 'Easy placement'}</p>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={`${product.id}-${tag}`} className="bg-[#E8E8E0] px-2.5 py-1 font-label text-[8px] uppercase tracking-[0.14em] text-[#4F4B43]">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate(`/catalogue/${product.id}`)}
            className="border border-[#11110E] px-4 py-3 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FBF9F4]"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={isSoldOut}
            className="bg-[#0F3A3A] px-4 py-3 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#11110E] disabled:cursor-not-allowed disabled:bg-[#B1B3A9]"
          >
            {isSoldOut ? 'Sold Out' : added ? 'Added' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </Motion.article>
  );
};

const ProductGrid = ({ products, loading, error, activeCategory }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = products.length > visibleCount;

  return (
    <section className="w-full bg-[#EFEFEA]">
      <div className="page-shell page-gutter py-16 md:py-20">
        <div className="mb-10 flex flex-col gap-5 border-b border-[#11110E]/12 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-label text-[9px] uppercase tracking-[0.32em] text-[#6D695F]">Shop Collection</p>
            <h2 className="mt-3 font-headline text-[42px] leading-none text-[#11110E] md:text-[58px]">
              {activeCategory || 'Products'}
            </h2>
          </div>
          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#6D695F]">
            {loading ? 'Loading products' : `${products.length} products available`}
          </p>
        </div>

        {error && (
          <div className="border border-[#9F403D]/20 bg-[#FAF2F2] p-6 font-body text-sm text-[#9F403D]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => <SkeletonCard key={item} index={item} />)}
          </div>
        ) : !products.length ? (
          <div className="border border-[#11110E]/12 bg-[#FFFEFA] px-6 py-16 text-center">
            <p className="font-label text-[9px] uppercase tracking-[0.28em] text-[#6D695F]">No Matching Products</p>
            <h3 className="mx-auto mt-4 max-w-xl font-headline text-[42px] leading-none text-[#11110E]">
              Try another category or search term.
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product, i) => (
                <DiscoveryProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-14 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 6)}
                  className="border border-[#11110E] px-8 py-4 font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#11110E] transition-colors hover:bg-[#11110E] hover:text-[#FBF9F4]"
                >
                  Load More Products [{visibleCount}/{products.length}]
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
