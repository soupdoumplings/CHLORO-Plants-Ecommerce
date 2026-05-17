import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { usePlantPreferences } from '../lib/PlantPreferencesContext';
import { DEFAULT_PLANT_PREFERENCES } from '../lib/plantPreferences';
import { useGeoLocation } from '../lib/useGeoLocation';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { useWishlist } from '../lib/WishlistContext';
import { supabase } from '../supabase';
import {
  FALLBACK_REGION,
  fetchSeasonalRecommendations,
  getCurrentMonth,
  getRecommendationRegion,
  getSeasonForMonth,
} from '../lib/seasonalRecommendations';

const LOCATION_PROMPT_KEY = 'chloro-location-prompt-seen';

const canUseStorage = () => typeof window !== 'undefined' && window.localStorage;

const getLocationPromptSeen = () => {
  if (!canUseStorage()) return true;
  return window.localStorage.getItem(LOCATION_PROMPT_KEY) === 'true';
};

const setLocationPromptSeen = () => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LOCATION_PROMPT_KEY, 'true');
};

const PlantRecommendations = ({ surface = 'home' }) => {
  const { preferences, hasPreferences, loading: preferencesLoading } = usePlantPreferences();
  const { user } = useAuth();
  const wishlist = useWishlist();
  const { location, error: locationError, isSupported, loading: locating, requestLocation } = useGeoLocation();
  const { addToBag } = useCart();
  const carouselRef = useRef(null);
  const [recommendationState, setRecommendationState] = useState({
    plants: [],
    loading: true,
    error: '',
    region: FALLBACK_REGION,
    season: getSeasonForMonth(),
    source: '',
  });
  const [locationReady, setLocationReady] = useState(() => Boolean(location) || getLocationPromptSeen());
  const [activeSlide, setActiveSlide] = useState(0);
  const [addedProductId, setAddedProductId] = useState(null);
  const [orderSignals, setOrderSignals] = useState({ orderedProductIds: [], orderedCategories: [] });
  const isCompact = surface === 'dashboard';
  const shouldPersonalize = isCompact || (surface === 'home' && hasPreferences);

  useEffect(() => {
    setLocationReady(true);
  }, [location, surface]);

  const activePreferences = useMemo(() => (
    shouldPersonalize ? (preferences || DEFAULT_PLANT_PREFERENCES) : DEFAULT_PLANT_PREFERENCES
  ), [preferences, shouldPersonalize]);

  useEffect(() => {
    let active = true;

    const fetchOrderSignals = async () => {
      if (!shouldPersonalize || !user) {
        setOrderSignals({ orderedProductIds: [], orderedCategories: [] });
        return;
      }

      try {
        const { data, error } = await supabase
          .from('order_items')
          .select('product_id, products(category)')
          .limit(50);

        if (error) throw error;
        if (!active) return;

        setOrderSignals({
          orderedProductIds: [...new Set((data || []).map((item) => item.product_id).filter(Boolean))],
          orderedCategories: [...new Set((data || []).map((item) => item.products?.category).filter(Boolean))],
        });
      } catch (err) {
        console.warn('Could not load order signals for recommendations:', err.message);
      }
    };

    fetchOrderSignals();

    return () => {
      active = false;
    };
  }, [shouldPersonalize, user]);

  const commerceSignals = useMemo(() => ({
    wishlistProductIds: shouldPersonalize ? wishlist.items.map((item) => item.productId) : [],
    wishlistCategories: shouldPersonalize ? wishlist.items.map((item) => item.product?.category).filter(Boolean) : [],
    orderedProductIds: shouldPersonalize ? orderSignals.orderedProductIds : [],
    orderedCategories: shouldPersonalize ? orderSignals.orderedCategories : [],
  }), [orderSignals, shouldPersonalize, wishlist.items]);

  const getRecommendations = useCallback(async () => {
    return fetchSeasonalRecommendations({
      preferences: activePreferences,
      location,
      month: getCurrentMonth(),
      limit: surface === 'dashboard' ? 5 : 6,
      signals: commerceSignals,
    });
  }, [activePreferences, commerceSignals, location, surface]);

  useEffect(() => {
    if ((shouldPersonalize && preferencesLoading) || !locationReady) return undefined;

    let isCancelled = false;

    setRecommendationState((current) => ({
      ...current,
      loading: true,
      error: '',
      region: getRecommendationRegion(location),
      season: getSeasonForMonth(getCurrentMonth()),
    }));

    getRecommendations()
      .then((result) => {
        if (isCancelled) return;
        setRecommendationState({
          plants: result.plants,
          loading: false,
          error: '',
          region: result.region,
          season: result.season,
          source: result.source,
        });
      })
      .catch((err) => {
        if (isCancelled) return;
        setRecommendationState((current) => ({
          ...current,
          plants: [],
          loading: false,
          error: err.message || 'Unable to load seasonal recommendations.',
        }));
      });

    return () => {
      isCancelled = true;
    };
  }, [getRecommendations, location, locationReady, preferencesLoading, shouldPersonalize]);

  const handleUseLocation = async () => {
    setRecommendationState((current) => ({ ...current, loading: true, error: '' }));
    const result = await requestLocation();
    setLocationPromptSeen();
    setLocationReady(true);

    if (!result.success) {
      try {
        const fallback = await getRecommendations();
        setRecommendationState({
          plants: fallback.plants,
          loading: false,
          error: '',
          region: fallback.region,
          season: fallback.season,
          source: fallback.source,
        });
      } catch (err) {
        setRecommendationState((current) => ({
          ...current,
          plants: [],
          loading: false,
          error: err.message || 'Unable to load seasonal recommendations.',
        }));
      }
    }
  };

  const recommendations = recommendationState.plants;
  const loading = (shouldPersonalize && preferencesLoading) || !locationReady || recommendationState.loading || locating;
  const usingFallbackRegion = !location;
  const regionLabel = recommendationState.region || getRecommendationRegion(location);
  const sectionLabel = shouldPersonalize ? 'Recommended For You' : 'Seasonal Picks';
  const sectionTitle = shouldPersonalize ? 'Picked from your plant preferences.' : 'Popular picks for this season.';
  const seasonalLine = shouldPersonalize
    ? isCompact
      ? 'Personalized with your plant preferences, wishlist signals, and order history.'
      : 'Your homepage now uses your saved plant preferences, wishlist signals, and seasonal fit.'
    : usingFallbackRegion
      ? `${recommendationState.season.season} picks selected for ${FALLBACK_REGION}.`
      : `${recommendationState.season.season} picks selected for ${regionLabel}.`;
  const carouselPages = Math.max(1, recommendations.length);

  useEffect(() => {
    setActiveSlide(0);
    if (carouselRef.current) carouselRef.current.scrollTo({ left: 0 });
  }, [recommendations.length]);

  const scrollToSlide = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const clampedIndex = Math.max(0, Math.min(index, recommendations.length - 1));
    const target = carousel.children[clampedIndex];
    if (!target) return;

    carousel.scrollTo({
      left: target.offsetLeft - carousel.offsetLeft,
      behavior: 'smooth',
    });
    setActiveSlide(clampedIndex);
  };

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel || recommendations.length === 0) return;

    const closestIndex = Array.from(carousel.children).reduce((closest, child, index) => {
      const distance = Math.abs((child.offsetLeft - carousel.offsetLeft) - carousel.scrollLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;

    setActiveSlide(closestIndex);
  };

  const handleAddToBag = async (product) => {
    const result = await addToBag(product);

    if (result?.success) {
      setAddedProductId(product.id);
      window.setTimeout(() => setAddedProductId(null), 1600);
    }
  };

  return (
    <Motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`${isCompact ? 'mt-12 bg-[#F3F1EA] border border-[#B0B0A8]/20 p-6 lg:p-8' : 'bg-[#FBF9F4] pt-24 md:pt-28 pb-16 md:pb-20 page-gutter border-y border-[#31332C]/5 overflow-hidden'}`}
    >
      <div className={isCompact ? 'w-full' : 'page-shell'}>
        <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-12">
          <div className="lg:col-span-8 max-w-[860px]">
            <p className="font-label text-[10px] uppercase tracking-[0.26em] text-[#785A1A] font-bold mb-6">
              {sectionLabel}
            </p>
            <h2 className={`font-headline text-[#1A1A1A] leading-[0.92] tracking-tight ${isCompact ? 'text-[30px]' : 'text-[52px] md:text-[72px] xl:text-[84px]'}`}>
              {sectionTitle}
            </h2>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <p className="font-body text-[15px] leading-relaxed text-[#5E6058] max-w-[420px]">
              {seasonalLine}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {(!location || locationError) && (
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={!isSupported || locating}
                  className="border border-[#0F3A3A] text-[#0F3A3A] px-5 py-4 font-label text-[10px] uppercase tracking-[0.16em] font-bold hover:bg-[#0F3A3A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[15px]">my_location</span>
                  {locating ? 'Locating...' : 'Use location'}
                </button>
              )}
              {!hasPreferences ? (
                <Link
                  to="/dashboard?tab=preferences"
                  className="border border-[#B0B0A8]/40 bg-white/70 px-5 py-4 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F3A3A] transition-colors hover:border-[#0F3A3A] hover:bg-[#0F3A3A] hover:text-white"
                >
                  Want better matches? Set plant preferences
                </Link>
              ) : (
                <Link
                  to="/dashboard?tab=preferences"
                  className="font-label text-[10px] uppercase tracking-[0.18em] text-[#0F3A3A] font-bold border-b border-[#0F3A3A] pb-1 w-max self-center"
                >
                  Adjust preferences
                </Link>
              )}
            </div>
          </div>
        </div>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[0, 1, 2].map((item) => (
              <div key={item} className="w-full sm:w-[calc((100%_-_1.75rem)/2)] lg:w-[calc((100%_-_3.5rem)/3)] min-w-[280px] h-[520px] bg-white/60 border border-[#B0B0A8]/15 animate-pulse shrink-0" />
            ))}
          </div>
        ) : recommendationState.error ? (
          <div className="bg-white p-8 text-[#5E6058] font-body text-sm">
            {recommendationState.error}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white p-8 text-[#5E6058] font-body text-sm">
            No seasonal matches yet. Add season tags to plants or adjust your preferences.
          </div>
        ) : (
          <>
            <div className="relative w-full">
              <div
                ref={carouselRef}
                onScroll={handleCarouselScroll}
                className="no-scrollbar flex gap-5 md:gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth"
              >
                {recommendations.map((product) => (
                  <Motion.article
                    key={product.id}
                    className={`group bg-white border border-[#B0B0A8]/20 snap-start shrink-0 transition-transform duration-500 hover:-translate-y-1 ${isCompact ? 'w-[280px]' : 'w-full sm:w-[calc((100%_-_1.75rem)/2)] lg:w-[calc((100%_-_3.5rem)/3)]'}`}
                  >
                    <Link to={`/catalogue/${product.id}`} className="block">
                      <div className="relative aspect-[5/6] max-h-[520px] overflow-hidden bg-[#EDEBE4]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F3A3A]/74 via-transparent to-transparent" />
                        <div className="absolute left-5 top-5 bg-[#FBF9F4] text-[#0F3A3A] px-3.5 py-2 font-label text-[9px] uppercase tracking-[0.15em] font-bold">
                          {product.seasonBadge || recommendationState.season.label}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                          <p className="font-label text-[9px] uppercase tracking-[0.2em] text-[#C6E9E9] font-bold mb-3">
                            {product.category || 'Indoor Plant'}
                          </p>
                          <h3 className="font-headline text-[32px] md:text-[36px] leading-[0.96] text-[#FBF9F4] max-w-[320px]">
                            {product.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                    <div className="p-5 border-t border-[#B0B0A8]/10">
                      <div className="flex items-start justify-between gap-5 mb-4">
                        <div>
                          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#5E6058] font-bold mb-2">
                            Recommended for {product.recommendationRegion || regionLabel}
                          </p>
                          <span className="font-headline text-[23px] text-[#1A1A1A] whitespace-nowrap">
                            {product.displayPrice}
                          </span>
                        </div>
                        <Link
                          to={`/catalogue/${product.id}`}
                          className="font-label text-[9px] uppercase tracking-[0.18em] text-[#785A1A] font-bold border-b border-[#785A1A] pb-1"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => wishlist.toggleWishlist(product)}
                          className={`h-10 w-10 shrink-0 border flex items-center justify-center transition-colors ${
                            wishlist.isWishlisted(product.id)
                              ? 'border-[#0F3A3A] bg-[#0F3A3A] text-white'
                              : 'border-[#B0B0A8]/35 text-[#0F3A3A] hover:border-[#0F3A3A]'
                          }`}
                          aria-label={wishlist.isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <span className="material-symbols-outlined text-[18px]">{wishlist.isWishlisted(product.id) ? 'favorite' : 'favorite_border'}</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4 min-h-[30px]">
                        {(product.recommendationReasons || ['Seasonal fit']).slice(0, 2).map((reason) => (
                          <span
                            key={`${product.id}-${reason}`}
                            className="bg-[#F3F1EA] text-[#0F3A3A] px-3 py-1.5 font-label text-[8px] uppercase tracking-[0.12em] font-bold"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToBag(product)}
                        className="w-full bg-[#0F3A3A] text-[#FBF9F4] px-5 py-4 font-label text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#1A2F2F] transition-colors inline-flex items-center justify-center gap-3"
                      >
                        <span className="material-symbols-outlined text-[17px]">
                          {addedProductId === product.id ? 'check' : 'shopping_bag'}
                        </span>
                        {addedProductId === product.id ? 'Added' : 'Add to Bag'}
                      </button>
                    </div>
                  </Motion.article>
                ))}
              </div>

              {!isCompact && recommendations.length > 1 && (
                <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => scrollToSlide(activeSlide - 1)}
                    disabled={activeSlide === 0}
                    className="pointer-events-auto -ml-5 h-14 w-14 border border-[#B0B0A8]/30 bg-[#FBF9F4]/95 text-[#0F3A3A] shadow-sm flex items-center justify-center transition-colors hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Previous recommendation"
                  >
                    <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSlide(activeSlide + 1)}
                    disabled={activeSlide >= recommendations.length - 1}
                    className="pointer-events-auto -mr-5 h-14 w-14 border border-[#B0B0A8]/30 bg-[#FBF9F4]/95 text-[#0F3A3A] shadow-sm flex items-center justify-center transition-colors hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Next recommendation"
                  >
                    <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                  </button>
                </div>
              )}
            </div>

            {recommendations.length > 1 && (
              <div className="flex items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-2">
                  {Array.from({ length: carouselPages }).map((_, index) => (
                    <button
                      key={`recommendation-slide-${index}`}
                      type="button"
                      onClick={() => scrollToSlide(index)}
                      className={`h-1 transition-all ${activeSlide === index ? 'w-12 bg-[#0F3A3A]' : 'w-7 bg-[#B0B0A8]/60 hover:bg-[#785A1A]'}`}
                      aria-label={`Show recommendation ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="flex md:hidden items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollToSlide(activeSlide - 1)}
                    disabled={activeSlide === 0}
                    className="h-12 w-12 border border-[#B0B0A8]/30 bg-[#FBF9F4] text-[#0F3A3A] flex items-center justify-center disabled:opacity-30"
                    aria-label="Previous recommendation"
                  >
                    <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSlide(activeSlide + 1)}
                    disabled={activeSlide >= recommendations.length - 1}
                    className="h-12 w-12 border border-[#B0B0A8]/30 bg-[#FBF9F4] text-[#0F3A3A] flex items-center justify-center disabled:opacity-30"
                    aria-label="Next recommendation"
                  >
                    <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {recommendationState.source && (
          <p className="font-label text-[9px] uppercase tracking-[0.16em] text-[#6B6B6B]/70 mt-4">
            Results cached by region and month.
          </p>
        )}
      </div>
    </Motion.section>
  );
};

export default PlantRecommendations;
