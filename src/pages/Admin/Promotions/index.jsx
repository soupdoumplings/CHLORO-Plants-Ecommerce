import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EditorialHero from '../../../components/EditorialHero';
import { supabase } from '../../../supabase';
import { formatRupees } from '../../../lib/pricing';
import { productAssetImages } from '../../../lib/localImages';

const initialForm = {
  product_id: '',
  discount_percent: '',
  start_at: '',
  end_at: '',
};

const statusStyle = {
  active: 'bg-[#D2E7E4] text-[#2F4F4F]',
  scheduled: 'bg-[#FBD185]/35 text-[#785A1A]',
  expired: 'bg-[#E5E2E1] text-[#5E6058]',
};

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const selectedProduct = useMemo(() => (
    products.find((product) => String(product.id) === String(formData.product_id))
  ), [formData.product_id, products]);

  const previewSalePrice = useMemo(() => {
    const price = Number(selectedProduct?.price || 0);
    const discount = Number(formData.discount_percent || 0);
    if (!price || !discount) return 0;
    return price * (1 - discount / 100);
  }, [formData.discount_percent, selectedProduct?.price]);

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [promotionsResult, productsResult] = await Promise.all([
        supabase
          .from('promotions')
          .select('*, products(name, price)')
          .order('created_at', { ascending: false }),
        supabase
          .from('products')
          .select('id, name, price, is_on_sale, sale_price, sale_ends_at')
          .order('name', { ascending: true }),
      ]);

      if (promotionsResult.error) throw promotionsResult.error;
      if (productsResult.error) throw productsResult.error;
      setPromotions(promotionsResult.data || []);
      setProducts(productsResult.data || []);
    } catch (err) {
      setError(err.message || 'Could not load promotions. Run the sales schema patch first.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatus = (promotion) => {
    const now = Date.now();
    if (new Date(promotion.end_at).getTime() <= now) return 'expired';
    if (new Date(promotion.start_at).getTime() > now) return 'scheduled';
    return 'active';
  };

  const syncProductSale = async ({ productId, discountPercent, startAt, endAt }) => {
    const product = products.find((item) => String(item.id) === String(productId));
    if (!product) return;

    const startsNow = new Date(startAt).getTime() <= Date.now();
    const stillActive = new Date(endAt).getTime() > Date.now();
    const salePrice = Number(product.price || 0) * (1 - Number(discountPercent || 0) / 100);

    await supabase
      .from('products')
      .update({
        is_on_sale: startsNow && stillActive,
        sale_price: startsNow && stillActive ? salePrice : null,
        sale_ends_at: startsNow && stillActive ? endAt : null,
      })
      .eq('id', productId);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (new Date(formData.end_at).getTime() <= new Date(formData.start_at).getTime()) {
        throw new Error('Sale end time must be after the start time.');
      }

      const status = getStatus(formData);
      const { error: insertError } = await supabase.from('promotions').insert({
        product_id: formData.product_id,
        discount_percent: Number(formData.discount_percent),
        start_at: formData.start_at,
        end_at: formData.end_at,
        status,
      });

      if (insertError) throw insertError;
      await syncProductSale({
        productId: formData.product_id,
        discountPercent: formData.discount_percent,
        startAt: formData.start_at,
        endAt: formData.end_at,
      });

      setFormData(initialForm);
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Could not save promotion.');
    } finally {
      setSaving(false);
    }
  };

  const handleEndPromotion = async (promotion) => {
    setSaving(true);
    setError('');

    try {
      await supabase
        .from('products')
        .update({ is_on_sale: false, sale_price: null, sale_ends_at: null })
        .eq('id', promotion.product_id);

      await supabase
        .from('promotions')
        .update({ status: 'expired', end_at: new Date().toISOString() })
        .eq('id', promotion.id);

      await fetchData();
    } catch (err) {
      setError(err.message || 'Could not end promotion.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF9F4] text-[#31332C]">
      <Navbar />
      <main className="mt-[82px] flex-grow pb-24">
        <EditorialHero
          eyebrow="Sales Control"
          title="Scheduled"
          italic="Discounts"
          copy="Schedule product discounts, watch active offers, and end promotions cleanly without leaving the admin workspace."
          image={productAssetImages.protea}
          imageAlt="Protea product image"
          objectPosition="center"
          actions={(
            <>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-[#FBF9F4] px-7 py-4 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F3A3A] transition-colors hover:bg-[#C6E9E9]"
              >
                Schedule Sale
              </button>
              <Link to="/archive" className="border border-[#FBF9F4]/65 px-7 py-4 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#FBF9F4] hover:text-[#0F3A3A]">
                Back to Dashboard
              </Link>
            </>
          )}
          meta={[
            { label: 'Promos', value: loading ? '...' : promotions.length.toString().padStart(2, '0') },
            { label: 'Limit', value: '90%' },
          ]}
        />

        <div className="page-shell page-gutter pt-12">
          {error && (
            <div className="mb-8 border border-[#9F403D]/20 bg-[#FAF2F2] p-5 font-body text-sm text-[#9F403D]">
              {error}
            </div>
          )}

          <div className="overflow-hidden border border-[#B1B3A9]/20 bg-white shadow-xl shadow-black/5">
          {loading ? (
            <div className="p-12 text-center font-label text-[10px] uppercase tracking-[0.2em] text-[#5E6058]">Loading promotions...</div>
          ) : promotions.length === 0 ? (
            <div className="p-12 text-center font-label text-[10px] uppercase tracking-[0.2em] text-[#5E6058]">No sales scheduled yet.</div>
          ) : (
            <div className="divide-y divide-[#B1B3A9]/15">
              {promotions.map((promotion) => {
                const status = getStatus(promotion);
                return (
                  <article key={promotion.id} className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center lg:p-8">
                    <div>
                      <span className={`px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] ${statusStyle[status] || statusStyle.scheduled}`}>
                        {status}
                      </span>
                      <h2 className="mt-4 font-headline text-3xl leading-tight">{promotion.products?.name || 'Product'}</h2>
                      <p className="mt-2 font-body text-sm text-[#5E6058]">
                        {promotion.discount_percent}% off from {new Date(promotion.start_at).toLocaleString()} to {new Date(promotion.end_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#785A1A]">Sale Price</p>
                      <p className="mt-2 font-headline text-3xl">
                        {formatRupees(Number(promotion.products?.price || 0) * (1 - Number(promotion.discount_percent || 0) / 100))}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={saving || status === 'expired'}
                      onClick={() => handleEndPromotion(promotion)}
                      className="border border-[#31332C]/20 px-5 py-3 font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#31332C] transition-colors hover:border-[#9F403D] hover:text-[#9F403D] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      End Sale
                    </button>
                  </article>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
            <Motion.button
              type="button"
              aria-label="Close sale modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-[#0B2525]/45 backdrop-blur-sm"
            />
            <Motion.form
              onSubmit={handleCreate}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="relative w-full max-w-xl border border-[#D9D6CA] bg-[#FBF9F4] p-8 shadow-2xl"
            >
              <h2 className="font-headline text-4xl">New Sale</h2>
              <div className="mt-8 space-y-6">
                <label className="block">
                  <span className="font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#5E6058]">Product</span>
                  <select
                    required
                    value={formData.product_id}
                    onChange={(event) => setFormData({ ...formData, product_id: event.target.value })}
                    className="mt-2 w-full border border-[#B1B3A9]/30 bg-white px-4 py-3 font-body text-sm outline-none focus:border-[#785A1A]"
                  >
                    <option value="">Choose a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>{product.name} / {formatRupees(product.price)}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#5E6058]">Discount Percent</span>
                  <input
                    required
                    min="1"
                    max="90"
                    type="number"
                    value={formData.discount_percent}
                    onChange={(event) => setFormData({ ...formData, discount_percent: event.target.value })}
                    className="mt-2 w-full border border-[#B1B3A9]/30 bg-white px-4 py-3 font-body text-sm outline-none focus:border-[#785A1A]"
                    placeholder="25"
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#5E6058]">Start</span>
                    <input
                      required
                      type="datetime-local"
                      value={formData.start_at}
                      onChange={(event) => setFormData({ ...formData, start_at: event.target.value })}
                      className="mt-2 w-full border border-[#B1B3A9]/30 bg-white px-4 py-3 font-body text-sm outline-none focus:border-[#785A1A]"
                    />
                  </label>
                  <label className="block">
                    <span className="font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#5E6058]">End</span>
                    <input
                      required
                      type="datetime-local"
                      value={formData.end_at}
                      onChange={(event) => setFormData({ ...formData, end_at: event.target.value })}
                      className="mt-2 w-full border border-[#B1B3A9]/30 bg-white px-4 py-3 font-body text-sm outline-none focus:border-[#785A1A]"
                    />
                  </label>
                </div>

                {previewSalePrice > 0 && (
                  <div className="border border-[#785A1A]/15 bg-white p-4">
                    <p className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#785A1A]">Preview Sale Price</p>
                    <p className="mt-1 font-headline text-3xl">{formatRupees(previewSalePrice)}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-[#31332C]/20 px-5 py-4 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#31332C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#31332C] px-5 py-4 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Sale'}
                </button>
              </div>
            </Motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotionsPage;
