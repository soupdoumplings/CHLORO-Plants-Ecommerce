import { supabase } from '../supabase';
import { DEFAULT_PLANT_PREFERENCES, scorePlantForPreferences } from './plantPreferences';

const fallbackImage = 'https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg';
const CACHE_PREFIX = 'chloro-seasonal-recommendations';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;

export const FALLBACK_REGION = 'Kathmandu';

const normalize = (value) => String(value || '').trim();
const normalizeSearch = (value) => normalize(value).toLowerCase();

export const getCurrentMonth = () => new Date().getMonth() + 1;

export const getSeasonForMonth = (month = getCurrentMonth()) => {
  const normalizedMonth = Number(month);

  if ([3, 4, 5].includes(normalizedMonth)) {
    return { label: 'Spring Pick', season: 'Spring', keywords: ['spring', 'spring/summer', 'all year'] };
  }

  if ([6, 7, 8, 9].includes(normalizedMonth)) {
    return { label: 'Monsoon Ready', season: 'Monsoon', keywords: ['monsoon', 'summer', 'spring/summer', 'all year'] };
  }

  if ([10, 11].includes(normalizedMonth)) {
    return { label: 'Autumn Ready', season: 'Autumn', keywords: ['autumn', 'autumn/winter', 'all year'] };
  }

  return { label: 'Winter Ready', season: 'Winter', keywords: ['winter', 'autumn/winter', 'all year'] };
};

export const getRecommendationRegion = (location) => {
  const address = location?.address;
  return normalize(address?.city)
    || normalize(address?.neighbourhood)
    || normalize(address?.country)
    || FALLBACK_REGION;
};

const getRegionalKeywords = (location, region) => {
  const country = normalizeSearch(location?.address?.country);
  const regionText = normalizeSearch(region);

  if (country.includes('nepal') || ['kathmandu', 'lalitpur', 'bhaktapur', 'pokhara'].some((term) => regionText.includes(term))) {
    return ['nepal', 'himalayan', 'subtropical', 'monsoon', 'kathmandu', 'indoor', 'humidity'];
  }

  if (country) return [country, 'indoor', 'adaptable'];
  return ['kathmandu', 'nepal', 'indoor', 'adaptable'];
};

export const normalizeSeasonalProduct = (product) => ({
  ...product,
  image: product.images?.[0] || product.image || fallbackImage,
  rawPrice: Number(product.rawPrice || product.price || 0),
  displayPrice: product.displayPrice || `NPR ${Number(product.rawPrice || product.price || 0).toLocaleString('en-NP', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
});

const productSearchText = (product) => [
  product.name,
  product.description,
  product.info,
  product.category,
  product.optimal_place,
  product.water_frequency,
  product.provenance,
  product.season,
  ...(product.tags || []),
].map(normalizeSearch).join(' ');

export const scorePlantForSeasonAndLocation = ({ product, preferences, location, month }) => {
  const season = getSeasonForMonth(month);
  const region = getRecommendationRegion(location);
  const text = productSearchText(product);
  const preferenceScore = scorePlantForPreferences(product, preferences || DEFAULT_PLANT_PREFERENCES);
  const reasons = [...(preferenceScore.reasons || [])];
  let score = preferenceScore.score;

  if (preferenceScore.excluded) {
    return { score: -1, reasons, excluded: true, seasonBadge: season.label, region };
  }

  if (season.keywords.some((keyword) => text.includes(keyword))) {
    score += 32;
    reasons.unshift(season.label);
  } else if (!product.season || normalizeSearch(product.season).includes('all year')) {
    score += 18;
    reasons.unshift('All-season fit');
  }

  const regionalKeywords = getRegionalKeywords(location, region);
  if (regionalKeywords.some((keyword) => text.includes(keyword))) {
    score += 24;
    reasons.unshift(`${region} fit`);
  } else {
    score += 8;
    reasons.unshift('Region fallback');
  }

  if (product.is_featured) score += 6;

  return {
    score,
    reasons: [...new Set(reasons)].slice(0, 4),
    excluded: false,
    seasonBadge: season.label,
    region,
  };
};

const normalizeSignalSet = (values = []) => new Set((values || []).map((value) => normalizeSearch(value)).filter(Boolean));

const getCommerceSignalScore = (product, signals = {}) => {
  const productId = normalizeSearch(product.id);
  const category = normalizeSearch(product.category);
  const wishlistProductIds = normalizeSignalSet(signals.wishlistProductIds);
  const wishlistCategories = normalizeSignalSet(signals.wishlistCategories);
  const orderedProductIds = normalizeSignalSet(signals.orderedProductIds);
  const orderedCategories = normalizeSignalSet(signals.orderedCategories);
  const reasons = [];
  let score = 0;

  if (wishlistProductIds.has(productId)) {
    score += 10;
    reasons.push('Saved to wishlist');
  }

  if (wishlistCategories.has(category)) {
    score += 14;
    reasons.push('Wishlist style match');
  }

  if (orderedCategories.has(category)) {
    score += 12;
    reasons.push('Based on orders');
  }

  if (orderedProductIds.has(productId)) {
    score -= 18;
  }

  return { score, reasons };
};

export const rankSeasonalProducts = ({ products, preferences, location, month = getCurrentMonth(), limit = 6, signals = {} }) => (
  (products || [])
    .map((product) => {
      const normalizedProduct = normalizeSeasonalProduct(product);
      const result = scorePlantForSeasonAndLocation({
        product: normalizedProduct,
        preferences,
        location,
        month,
      });
      const commerceSignal = getCommerceSignalScore(normalizedProduct, signals);

      return {
        ...normalizedProduct,
        recommendationScore: result.score + commerceSignal.score,
        recommendationReasons: [...new Set([...(commerceSignal.reasons || []), ...(result.reasons || [])])].slice(0, 4),
        seasonBadge: result.seasonBadge,
        recommendationRegion: result.region,
        excluded: result.excluded,
      };
    })
    .filter((product) => !product.excluded && product.recommendationScore >= 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit)
);

const buildCacheKey = ({ region, month, preferences, signals }) => {
  const preferenceFingerprint = JSON.stringify({
    light: preferences?.light,
    care: preferences?.care,
    watering: preferences?.watering,
    space: preferences?.space,
    hasPets: Boolean(preferences?.hasPets),
    style: preferences?.style || [],
    wishlistCategories: signals?.wishlistCategories || [],
    orderedCategories: signals?.orderedCategories || [],
  });

  return `${CACHE_PREFIX}:${normalizeSearch(region) || FALLBACK_REGION}:${month}:${preferenceFingerprint}`;
};

const readLocalCache = (key) => {
  try {
    const cached = JSON.parse(localStorage.getItem(key) || 'null');
    if (!cached || Date.now() - cached.createdAt > CACHE_TTL_MS) return null;
    return cached.value;
  } catch {
    return null;
  }
};

const writeLocalCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify({ createdAt: Date.now(), value }));
  } catch {
    // Cache is helpful, not required.
  }
};

const fetchProductsFallback = async ({ preferences, location, month, limit, signals }) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return rankSeasonalProducts({
    products: data || [],
    preferences,
    location,
    month,
    limit,
    signals,
  });
};

const applySignalsToPlants = ({ plants, signals, limit }) => (
  (plants || [])
    .map((product) => {
      const normalizedProduct = normalizeSeasonalProduct(product);
      const commerceSignal = getCommerceSignalScore(normalizedProduct, signals);
      return {
        ...normalizedProduct,
        recommendationScore: Number(normalizedProduct.recommendationScore || 0) + commerceSignal.score,
        recommendationReasons: [...new Set([...(commerceSignal.reasons || []), ...(normalizedProduct.recommendationReasons || [])])].slice(0, 4),
      };
    })
    .sort((a, b) => Number(b.recommendationScore || 0) - Number(a.recommendationScore || 0))
    .slice(0, limit)
);

export const fetchSeasonalRecommendations = async ({
  preferences = DEFAULT_PLANT_PREFERENCES,
  location,
  month = getCurrentMonth(),
  limit = 6,
  signals = {},
}) => {
  const region = getRecommendationRegion(location);
  const cacheKey = buildCacheKey({ region, month, preferences, signals });
  const cached = readLocalCache(cacheKey);

  if (cached) return { ...cached, source: `${cached.source}:local-cache` };

  try {
    const { data, error } = await supabase.functions.invoke('get_seasonal_plants', {
      body: {
        location,
        region,
        month,
        limit,
        preferences,
        signals,
      },
    });

    if (error) throw error;

    const value = {
      plants: applySignalsToPlants({ plants: data?.plants || [], signals, limit }),
      region: data?.region || region,
      season: data?.season || getSeasonForMonth(month),
      source: data?.source || 'edge',
    };

    writeLocalCache(cacheKey, value);
    return value;
  } catch (edgeError) {
    console.warn('Seasonal Edge Function unavailable, using product fallback:', edgeError);
    const plants = await fetchProductsFallback({ preferences, location, month, limit, signals });
    const value = {
      plants,
      region,
      season: getSeasonForMonth(month),
      source: 'client-fallback',
    };

    writeLocalCache(cacheKey, value);
    return value;
  }
};
