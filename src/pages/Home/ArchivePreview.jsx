import React, { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../supabase';

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

  // Normalize DB product shape to what ProductCard expects
  const normalizeProduct = (item) => ({
    id: item.id,
    name: item.name,
    price: parseFloat(item.price).toLocaleString('en-US'),
    category: item.description || 'Himalayan Specimen',
    image: item.images?.[0] || 'https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg',
  });

  return (
    <section className="py-32 px-12 bg-[#fbf9f4]">
        <div className="flex justify-between items-end mb-20">
          <div className="max-w-2xl text-left">
            <Motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline text-5xl md:text-6xl mb-8 leading-tight text-[#31332c]"
            >
              Personalized Archive Recommendations
            </Motion.h2>
            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[#5e6058] leading-relaxed text-lg tracking-wide opacity-90 mb-4"
            >
              Curated by our proprietary growth algorithms, these specimens are selected based on your local micro-climate in the Kathmandu Valley.
            </Motion.p>
          </div>
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ x: 4 }}
          >
            <Link
              to="/catalogue"
              className="font-label text-[10px] uppercase font-bold tracking-[0.25em] border-b border-[#31332c] pb-1.5 mb-2 hover:opacity-50 transition-all text-[#31332c] flex items-center gap-3 shrink-0"
            >
               View Full Collection
               <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </Motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#e8e9e0] h-[420px] w-full mb-6 rounded-sm" />
                <div className="bg-[#e8e9e0] h-4 w-3/4 mb-3 rounded" />
                <div className="bg-[#e8e9e0] h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-[#5e6058] font-label text-[11px] uppercase tracking-widest">
            No products found. Add plants from the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={normalizeProduct(p)} delay={i * 0.15} />
            ))}
          </div>
        )}
      </section>
  );
};

export default Archive;
