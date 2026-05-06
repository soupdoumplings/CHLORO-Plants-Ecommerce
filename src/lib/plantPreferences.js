export const DEFAULT_PLANT_PREFERENCES = {
  light: 'bright-indirect',
  care: 'easy',
  watering: 'weekly',
  space: 'medium',
  hasPets: false,
  style: ['lush'],
  region: 'Kathmandu Valley',
};

export const preferenceOptions = {
  light: [
    { value: 'low', label: 'Low Light', icon: 'dark_mode' },
    { value: 'bright-indirect', label: 'Bright Indirect', icon: 'wb_sunny' },
    { value: 'direct', label: 'Direct Sun', icon: 'light_mode' },
  ],
  care: [
    { value: 'easy', label: 'Low Maintenance', icon: 'self_care' },
    { value: 'steady', label: 'Weekly Ritual', icon: 'water_drop' },
    { value: 'hands-on', label: 'Hands On', icon: 'science' },
  ],
  watering: [
    { value: 'sparse', label: 'Rare Watering', icon: 'opacity' },
    { value: 'weekly', label: 'Weekly Watering', icon: 'water' },
    { value: 'frequent', label: 'Frequent Care', icon: 'rainy' },
  ],
  space: [
    { value: 'compact', label: 'Shelf / Desk', icon: 'view_compact' },
    { value: 'medium', label: 'Room Corner', icon: 'weekend' },
    { value: 'statement', label: 'Statement Floor Plant', icon: 'yard' },
  ],
  style: [
    { value: 'lush', label: 'Lush & Tropical', icon: 'forest' },
    { value: 'sculptural', label: 'Sculptural', icon: 'architecture' },
    { value: 'flowering', label: 'Flowering', icon: 'local_florist' },
    { value: 'minimal', label: 'Minimal', icon: 'filter_vintage' },
  ],
};

const normalize = (value) => String(value || '').toLowerCase();

const productSearchText = (product) => [
  product.name,
  product.description,
  product.info,
  product.category,
  product.optimal_place,
  product.water_frequency,
  product.season,
  ...(product.tags || []),
].map(normalize).join(' ');

export const isPetUnsafeProduct = (product) => {
  const text = productSearchText(product);
  const tags = (product.tags || []).map(normalize);

  if (tags.some((tag) => tag.includes('pet-friendly') || tag.includes('pet safe') || tag.includes('non-toxic'))) {
    return false;
  }

  return [
    'toxic',
    'not pet',
    'pet unsafe',
    'keep away from pets',
    'dieffenbachia',
    'pothos',
    'philodendron',
    'lily',
    'alocasia',
    'monstera',
    'ficus',
  ].some((signal) => text.includes(signal));
};

const getWateringBand = (product) => {
  const text = normalize(product.water_frequency);
  if (text.includes('3') || text.includes('mist') || text.includes('frequent')) return 'frequent';
  if (text.includes('10') || text.includes('14') || text.includes('dry')) return 'sparse';
  return 'weekly';
};

const hasAny = (text, terms) => terms.some((term) => text.includes(term));

export const scorePlantForPreferences = (product, preferences = DEFAULT_PLANT_PREFERENCES) => {
  const prefs = { ...DEFAULT_PLANT_PREFERENCES, ...(preferences || {}) };
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

  const wateringBand = getWateringBand(product);
  if (wateringBand === prefs.watering) {
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

  if (prefs.space === 'compact' && hasAny(text, ['compact', 'desk', 'shelf', 'small', 'terrarium'])) {
    score += 18;
    reasons.push('Compact space');
  } else if (prefs.space === 'statement' && hasAny(text, ['large', 'statement', 'floor', 'monstera', 'ficus'])) {
    score += 18;
    reasons.push('Statement scale');
  } else if (prefs.space === 'medium') {
    score += 8;
  }

  const styles = Array.isArray(prefs.style) ? prefs.style : [prefs.style].filter(Boolean);
  styles.forEach((style) => {
    if (style === 'lush' && hasAny(text, ['tropical', 'lush', 'monstera', 'fern', 'leaf'])) {
      score += 14;
      reasons.push('Lush look');
    }
    if (style === 'sculptural' && hasAny(text, ['sculptural', 'succulent', 'cactus', 'ficus', 'architectural'])) {
      score += 14;
      reasons.push('Sculptural form');
    }
    if (style === 'flowering' && hasAny(text, ['flower', 'orchid', 'bloom'])) {
      score += 14;
      reasons.push('Flowering accent');
    }
    if (style === 'minimal' && hasAny(text, ['minimal', 'clean', 'simple', 'snake', 'zz'])) {
      score += 14;
      reasons.push('Minimal styling');
    }
  });

  if (prefs.hasPets) {
    score += 8;
    reasons.push(hasAny(text, ['pet-friendly', 'pet safe', 'non-toxic']) ? 'Pet safe' : 'Pet-conscious pick');
  }

  if (product.is_featured) score += 4;

  return {
    score,
    reasons: [...new Set(reasons)].slice(0, 3),
    excluded: false,
  };
};

export const getRecommendedPlants = (products, preferences, limit = 5) => {
  return (products || [])
    .map((product) => {
      const result = scorePlantForPreferences(product, preferences);
      return { ...product, recommendationScore: result.score, recommendationReasons: result.reasons, excluded: result.excluded };
    })
    .filter((product) => !product.excluded && product.recommendationScore >= 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};
