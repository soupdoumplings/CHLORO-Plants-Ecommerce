export const hasActiveSale = (product = {}) => {
  if (!product?.is_on_sale || product?.sale_price == null) return false;
  if (!product.sale_ends_at) return true;
  return new Date(product.sale_ends_at).getTime() > Date.now();
};

export const getEffectivePrice = (product = {}) => {
  if (hasActiveSale(product)) return Number(product.sale_price || 0);
  return Number(product.rawPrice ?? product.price ?? 0);
};

export const formatRupees = (value) => `रू ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;
