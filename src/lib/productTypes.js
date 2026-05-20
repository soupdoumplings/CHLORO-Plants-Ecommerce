const normalizeText = (value) => String(value || '').toLowerCase();

const includesAny = (value, needles) => {
  const text = normalizeText(value);
  return needles.some((needle) => text.includes(needle));
};

const productText = (product) => [
  product?.name,
  product?.category,
  product?.description,
  product?.info,
  product?.provenance,
  ...(product?.tags || []),
].join(' ');

export const productTypeLabels = {
  all: 'All Products',
  plants: 'Plants',
  care: 'Care Tools',
  gifts: 'Gifts',
  vessels: 'Pots & Vessels',
};

export const getProductType = (product) => {
  const text = productText(product);

  if (includesAny(text, ['care tool', 'plant care', 'watering', 'mist', 'spray', 'neem', 'soil', 'fertilizer', 'feed', 'meter', 'scissor', 'pruning', 'secateur', 'root-care', 'pest-care'])) {
    return productTypeLabels.care;
  }

  if (includesAny(text, ['gift', 'bundle', 'crate', 'terrarium', 'bouquet', 'fresh cut', 'ceramic', 'vessel', 'pot', 'planter'])) {
    return productTypeLabels.gifts;
  }

  return productTypeLabels.plants;
};

export const productMatchesType = (product, type) => (
  type === productTypeLabels.all || getProductType(product) === type
);
