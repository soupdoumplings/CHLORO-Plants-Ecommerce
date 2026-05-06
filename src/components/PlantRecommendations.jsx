import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { supabase } from '../supabase';
import { useAuth } from '../lib/AuthContext';
import { usePlantPreferences } from '../lib/PlantPreferencesContext';
import { DEFAULT_PLANT_PREFERENCES, getRecommendedPlants } from '../lib/plantPreferences';

const fallbackImage = 'https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg';

const normalizeProduct = (product) => ({
  ...product,
  image: product.images?.[0] || fallbackImage,
  rawPrice: Number(product.price || 0),
  displayPrice: `NPR ${Number(product.price || 0).toLocaleString('en-NP', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
});

const PlantRecommendations = ({ surface = 'home' }) => {
  const { user } = useAuth();
  const { preferences, hasPreferences, loading: preferencesLoading } = usePlantPreferences();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && isMounted) {
        setProducts((data || []).map(normalizeProduct));
      }
      if (isMounted) setLoadingProducts(false);
    };

    fetchProducts();

    const channel = supabase
      .channel(`recommendation-products-${surface}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products',
      }, fetchProducts)
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [surface]);

  const activePreferences = preferences || DEFAULT_PLANT_PREFERENCES;
  const recommendations = useMemo(() => (
    getRecommendedPlants(products, activePreferences, 5)
  ), [activePreferences, products]);

  if (!user || (!preferencesLoading && !hasPreferences && surface === 'home')) return null;

  const isCompact = surface === 'dashboard';
  const loading = preferencesLoading || loadingProducts;

  return (
    <Motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`${isCompact ? 'mt-12 bg-[#F3F1EA] border border-[#B0B0A8]/20 p-6 lg:p-8' : 'bg-[#F3F1EA] py-20 px-6 md:px-12'}`}
    >
      <div className={isCompact ? 'w-full' : 'max-w-[1440px] mx-auto'}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#785A1A] font-bold mb-3">
              Personal Recommendations
            </p>
            <h2 className={`font-headline text-[#1A1A1A] leading-none ${isCompact ? 'text-[30px]' : 'text-[42px] md:text-[56px]'}`}>
              Plants matched to your space.
            </h2>
          </div>
          <Link
            to="/dashboard"
            className="font-label text-[10px] uppercase tracking-[0.18em] text-[#0F3A3A] font-bold border-b border-[#0F3A3A] pb-1 w-max"
          >
            Update preferences
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[0, 1, 2].map((item) => (
              <div key={item} className="min-w-[260px] h-[360px] bg-white/70 animate-pulse" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white p-8 text-[#5E6058] font-body text-sm">
            No safe matches yet. Add more plant tags or adjust your preferences.
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
            {recommendations.map((product, index) => (
              <Link
                key={product.id}
                to={`/catalogue/${product.id}`}
                className={`group bg-white border border-[#B0B0A8]/20 snap-start shrink-0 transition-transform hover:-translate-y-1 ${isCompact ? 'w-[240px]' : 'w-[280px] md:w-[320px]'}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEBE4]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute left-4 top-4 bg-[#0F3A3A] text-[#FBF9F4] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.16em] font-bold">
                    Match {index + 1}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-headline text-[22px] leading-tight text-[#1A1A1A]">
                        {product.name}
                      </h3>
                      <p className="mt-1 font-label text-[8px] uppercase tracking-[0.15em] text-[#5E6058] font-bold">
                        {product.category || 'Indoor Plant'}
                      </p>
                    </div>
                    <span className="font-headline text-[15px] text-[#1A1A1A] whitespace-nowrap">
                      {product.displayPrice}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(product.recommendationReasons || ['Preference match']).map((reason) => (
                      <span
                        key={`${product.id}-${reason}`}
                        className="bg-[#F3F1EA] text-[#0F3A3A] px-2.5 py-1 font-label text-[8px] uppercase tracking-[0.12em] font-bold"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Motion.section>
  );
};

export default PlantRecommendations;
