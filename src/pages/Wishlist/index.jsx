import React from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EditorialHero from '../../components/EditorialHero';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';
import { productAssetImages } from '../../lib/localImages';

const WishlistPage = () => {
  const wishlist = useWishlist();
  const { addToBag } = useCart();

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-screen flex-col bg-[#FBF9F4]"
    >
      <Navbar />
      <main className="w-full flex-grow page-shell page-gutter pb-24 mt-[82px]">
        <EditorialHero
          eyebrow="Member Area"
          title="Saved"
          italic="Wishlist"
          copy="Keep plants, tools, and gifts close while you compare care needs, prices, and future room plans."
          image={productAssetImages.lycaste}
          imageAlt="Lycaste orchid"
          actions={(
            <Link to="/orders" className="w-max border border-[#FBF9F4]/65 px-6 py-4 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#FBF9F4] hover:text-[#0F3A3A]">
              My Orders
            </Link>
          )}
          meta={[
            { label: 'Saved', value: wishlist.loading ? '...' : wishlist.items.length.toString().padStart(2, '0') },
            { label: 'Signal', value: 'Preferences' },
          ]}
        />

        <section className="pt-14 lg:pt-16">
        {wishlist.loading ? (
          <div className="border border-[#B0B0A8]/20 bg-white p-12 text-center font-label text-[10px] uppercase tracking-[0.2em] text-[#5E6058]">
            Loading wishlist...
          </div>
        ) : wishlist.error ? (
          <div className="border border-[#D94F4F]/20 bg-[#FAF2F2] p-8 font-body text-sm text-[#9F403D]">
            {wishlist.error}
          </div>
        ) : wishlist.items.length === 0 ? (
          <div className="grid gap-8 border border-[#B0B0A8]/20 bg-white p-8 md:grid-cols-[1fr_auto] md:items-center lg:p-12">
            <div>
              <h2 className="font-headline text-[34px] leading-tight text-[#1A1A1A]">No saved plants yet.</h2>
              <p className="mt-3 max-w-xl font-body text-sm leading-7 text-[#5E6058]">
                Save products while browsing. Wishlist signals also help tune your recommendations.
              </p>
            </div>
            <Link to="/discovery" className="bg-[#0F3A3A] px-6 py-4 text-center font-label text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.items.map((item, index) => (
              <Motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: (index % 4) * 0.08 }}
                className="group"
              >
                <Link to={`/catalogue/${item.productId}`} className="block">
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden bg-[#EDEBE4]">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute left-4 top-4 bg-[#0F3A3A] px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-white">
                      Saved
                    </div>
                  </div>
                </Link>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link to={`/catalogue/${item.productId}`} className="font-headline text-[24px] leading-tight text-[#1A1A1A] transition-colors hover:text-[#785A1A]">
                      {item.product.name}
                    </Link>
                    <p className="mt-2 font-label text-[8px] font-bold uppercase tracking-[0.15em] text-[#6B6B6B]">{item.product.category}</p>
                  </div>
                  <p className="shrink-0 font-headline text-[18px] text-[#1A1A1A]">{item.product.displayPrice}</p>
                </div>
                <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                  <button
                    type="button"
                    onClick={() => addToBag(item.product)}
                    className="bg-[#0F3A3A] px-4 py-3.5 font-label text-[9px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#1A2F2F]"
                  >
                    Add to Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => wishlist.removeFromWishlist(item.productId)}
                    className="border border-[#B0B0A8]/40 px-4 py-3.5 font-label text-[9px] font-bold uppercase tracking-[0.15em] text-[#5E6058] transition-colors hover:border-[#9F403D] hover:text-[#9F403D]"
                  >
                    Remove
                  </button>
                </div>
              </Motion.article>
            ))}
          </div>
        )}
        </section>
      </main>
      <Footer />
    </Motion.div>
  );
};

export default WishlistPage;
