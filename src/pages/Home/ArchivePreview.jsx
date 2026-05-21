import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../supabase';
import { fallbackCatalogImage } from '../../lib/localImages';
import { getEffectivePrice, hasActiveSale } from '../../lib/pricing';

const Archive = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching featured products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const normalizeProduct = (item) => ({
    id: item.id,
    name: item.name,
    price: getEffectivePrice(item).toLocaleString('en-NP', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    originalPrice: hasActiveSale(item)
      ? Number(item.price || 0).toLocaleString('en-NP', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      : null,
    rawPrice: getEffectivePrice(item),
    isOnSale: hasActiveSale(item),
    saleEndsAt: item.sale_ends_at,
    category: item.category || item.description || 'Indoor Plant',
    image: item.images?.[0] || fallbackCatalogImage,
  });

  return (
    <section className="pt-20 md:pt-24 pb-24 md:pb-28 page-gutter-tight bg-[#fbf9f4]">
      <div className="page-shell">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12 md:mb-14">
          <div className="lg:col-span-8 max-w-[760px] text-left">
            <Motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-label text-[10px] tracking-[0.26em] uppercase text-[#785A1A] font-bold inline-block mb-6"
            >
              Fresh From The Shop
            </Motion.span>
            <Motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline text-[46px] md:text-[66px] xl:text-[76px] leading-[0.94] tracking-tight text-[#31332c]"
            >
              Plants, care tools, and gifts ready to take home.
            </Motion.h2>
          </div>
          <div className="lg:col-span-4 flex flex-col md:flex-row lg:flex-col xl:flex-row md:items-center lg:items-start xl:items-center justify-between gap-6">
            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[#5e6058] leading-relaxed text-[15px] max-w-[390px]"
            >
              Browse recent arrivals across living plants, care essentials, vessels, and gift-ready pieces.
            </Motion.p>
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 4 }}
            >
              <Link
                to="/discovery"
                className="font-label text-[10px] uppercase font-bold tracking-[0.22em] border-b border-[#31332c] pb-1.5 hover:opacity-60 transition-all text-[#31332c] flex items-center gap-3 shrink-0"
              >
                Shop All Products
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </Motion.div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#e8e9e0] h-[420px] w-full mb-6" />
                <div className="bg-[#e8e9e0] h-4 w-3/4 mb-3" />
                <div className="bg-[#e8e9e0] h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-[#5e6058] font-label text-[11px] uppercase tracking-widest">
            No products found. Add plants, care tools, or gifts from the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={normalizeProduct(p)} delay={i * 0.15} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Archive;
