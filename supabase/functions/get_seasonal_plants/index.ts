// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const CACHE_HOURS = Number(Deno.env.get('SEASONAL_RECOMMENDATION_CACHE_HOURS') || 12);
const FALLBACK_REGION = 'Kathmandu';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const normalize = (value) => String(value || '').trim();
const normalizeSearch = (value) => normalize(value).toLowerCase();

const getSeasonForMonth = (month) => {
  if ([3, 4, 5].includes(month)) {
    return { label: 'Spring Pick', season: 'Spring', keywords: ['spring', 'spring/summer', 'all year'] };
  }

  if ([6, 7, 8, 9].includes(month)) {
    return { label: 'Monsoon Ready', season: 'Monsoon', keywords: ['monsoon', 'summer', 'spring/summer', 'all year'] };
  }

  if ([10, 11].includes(month)) {
    return { label: 'Autumn Ready', season: 'Autumn', keywords: ['autumn', 'autumn/winter', 'all year'] };
  }

  return { label: 'Winter Ready', season: 'Winter', keywords: ['winter', 'autumn/winter', 'all year'] };
};

const resolveRegionFromLocation = (location, explicitRegion) => (
  normalize(explicitRegion)
  || normalize(location?.address?.city)
  || normalize(location?.address?.neighbourhood)
  || normalize(location?.address?.country)
);

const reverseGeocodeRegion = async (location) => {
  const latitude = location?.coordinates?.latitude;
  const longitude = location?.coordinates?.longitude;
  if (!latitude || !longitude) return '';

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: 'en',
  });

  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`);
  if (!response.ok) return '';

  const place = await response.json();
  return normalize(place.city) || normalize(place.locality) || normalize(place.principalSubdivision) || normalize(place.countryName);
};

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

const hasAny = (text, terms) => terms.some((term) => text.includes(term));

const getWateringBand = (product) => {
  const text = normalizeSearch(product.water_frequency);
  if (text.includes('3') || text.includes('mist') || text.includes('frequent')) return 'frequent';
  if (text.includes('10') || text.includes('14') || text.includes('dry')) return 'sparse';
  return 'weekly';
};

const isPetUnsafeProduct = (product) => {
  const text = productSearchText(product);
  const tags = (product.tags || []).map(normalizeSearch);

  if (tags.some((tag) => tag.includes('pet-friendly') || tag.includes('pet safe') || tag.includes('non-toxic'))) {
    return false;
  }

  return ['toxic', 'not pet', 'pet unsafe', 'lily', 'monstera', 'ficus', 'pothos', 'philodendron'].some((signal) => text.includes(signal));
};

const scorePreferences = (product, preferences = {}) => {
  const prefs = {
    light: 'bright-indirect',
    care: 'easy',
    watering: 'weekly',
    space: 'medium',
    hasPets: false,
    style: ['lush'],
    ...preferences,
  };
  const text = productSearchText(product);
  const reasons = [];
  let score = 0;

  if (prefs.hasPets && isPetUnsafeProduct(product)) {
    return { score: -1, reasons: ['Filtered for pet safety'], excluded: true };
  }

  if (prefs.light === 'low' && hasAny(text, ['low light', 'shade', 'indirect'])) {
    score += 28;
    reasons.push('Low light match');
  } else if (prefs.light === 'bright-indirect' && hasAny(text, ['bright indirect', 'indirect', 'filtered'])) {
    score += 28;
    reasons.push('Bright indirect light');
  } else if (prefs.light === 'direct' && hasAny(text, ['direct sun', 'full sun', 'bright'])) {
    score += 24;
    reasons.push('Sun-loving');
  }

  if (getWateringBand(product) === prefs.watering) {
    score += 22;
    reasons.push(prefs.watering === 'sparse' ? 'Forgiving watering' : 'Watering rhythm match');
  }

  if (prefs.care === 'easy' && hasAny(text, ['low-maintenance', 'low maintenance', 'easy', 'hardy', 'beginner'])) {
    score += 22;
    reasons.push('Low maintenance');
  } else if (prefs.care === 'steady' && !hasAny(text, ['rare', 'expert'])) {
    score += 14;
    reasons.push('Steady care fit');
  } else if (prefs.care === 'hands-on' && hasAny(text, ['rare', 'orchid', 'humidity', 'misting', 'collector'])) {
    score += 18;
    reasons.push('Rewarding care ritual');
  }

  const styles = Array.isArray(prefs.style) ? prefs.style : [prefs.style].filter(Boolean);
  styles.forEach((style) => {
    if (style === 'lush' && hasAny(text, ['tropical', 'lush', 'monstera', 'fern', 'leaf'])) score += 14;
    if (style === 'sculptural' && hasAny(text, ['sculptural', 'succulent', 'cactus', 'ficus', 'architectural'])) score += 14;
    if (style === 'flowering' && hasAny(text, ['flower', 'orchid', 'bloom'])) score += 14;
    if (style === 'minimal' && hasAny(text, ['minimal', 'clean', 'simple', 'snake', 'zz'])) score += 14;
  });

  return { score, reasons: [...new Set(reasons)].slice(0, 3), excluded: false };
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

const normalizeProduct = (product) => ({
  ...product,
  image: product.images?.[0] || 'https://images.pexels.com/photos/7627358/pexels-photo-7627358.jpeg',
  rawPrice: Number(product.price || 0),
  displayPrice: `रू ${Number(product.price || 0).toLocaleString('en-NP', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
});

const rankProducts = ({ products, preferences, location, region, month, limit }) => {
  const season = getSeasonForMonth(month);

  return (products || [])
    .map((product) => {
      const normalizedProduct = normalizeProduct(product);
      const text = productSearchText(normalizedProduct);
      const preferenceScore = scorePreferences(normalizedProduct, preferences);
      const reasons = [...(preferenceScore.reasons || [])];
      let score = preferenceScore.score;

      if (preferenceScore.excluded) {
        return { ...normalizedProduct, recommendationScore: -1, excluded: true };
      }

      if (season.keywords.some((keyword) => text.includes(keyword))) {
        score += 32;
        reasons.unshift(season.label);
      } else if (!normalizedProduct.season || normalizeSearch(normalizedProduct.season).includes('all year')) {
        score += 18;
        reasons.unshift('All-season fit');
      }

      if (getRegionalKeywords(location, region).some((keyword) => text.includes(keyword))) {
        score += 24;
        reasons.unshift(`${region} fit`);
      } else {
        score += 8;
        reasons.unshift('Region fallback');
      }

      if (normalizedProduct.is_featured) score += 6;

      return {
        ...normalizedProduct,
        recommendationScore: score,
        recommendationReasons: [...new Set(reasons)].slice(0, 4),
        seasonBadge: season.label,
        recommendationRegion: region,
        excluded: false,
      };
    })
    .filter((product) => !product.excluded && product.recommendationScore >= 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

const sha256 = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const month = Math.min(12, Math.max(1, Number(body.month || new Date().getMonth() + 1)));
    const limit = Math.min(12, Math.max(1, Number(body.limit || 6)));
    const location = body.location || null;
    const region = resolveRegionFromLocation(location, body.region) || await reverseGeocodeRegion(location) || FALLBACK_REGION;
    const season = getSeasonForMonth(month);
    const cacheKey = await sha256(JSON.stringify({
      region: normalizeSearch(region),
      month,
      limit,
      preferences: body.preferences || {},
    }));

    const { data: cached } = await supabase
      .from('seasonal_recommendation_cache')
      .select('payload')
      .eq('cache_key', cacheKey)
      .gt('cached_until', new Date().toISOString())
      .maybeSingle();

    if (cached?.payload) {
      return new Response(JSON.stringify({ ...cached.payload, source: 'edge-cache' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const payload = {
      plants: rankProducts({
        products,
        preferences: body.preferences || {},
        location,
        region,
        month,
        limit,
      }),
      region,
      season,
    };

    await supabase
      .from('seasonal_recommendation_cache')
      .upsert({
        cache_key: cacheKey,
        region,
        month,
        payload,
        cached_until: new Date(Date.now() + CACHE_HOURS * 60 * 60 * 1000).toISOString(),
      });

    return new Response(JSON.stringify({ ...payload, source: 'edge' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Unable to get seasonal plants.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
