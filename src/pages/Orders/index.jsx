import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EditorialHero from '../../components/EditorialHero';
import { supabase } from '../../supabase';
import { useAuth } from '../../lib/AuthContext';
import { productAssetImages } from '../../lib/localImages';

const statusStyles = {
  pending: 'bg-[#FBD185]/35 text-[#785A1A]',
  processing: 'bg-[#C6E9E9]/45 text-[#244545]',
  shipping: 'bg-[#E5E2E1] text-[#525151]',
  delivered: 'bg-[#D2E7E4] text-[#2F4F4F]',
  cancelled: 'bg-[#F8D8D6] text-[#9F403D]',
};

const paymentStyles = {
  pending: 'text-[#785A1A]',
  completed: 'text-[#2F4F4F]',
  refunded: 'text-[#9F403D]',
  cancelled: 'text-[#9F403D]',
  failed: 'text-[#9F403D]',
};

const money = (value) => `रू ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const dateTime = (value) => {
  if (!value) return 'Pending';
  return new Intl.DateTimeFormat('en-NP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const selectedOrderId = searchParams.get('order');

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      setError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (active) setOrders(data || []);
      } catch (err) {
        if (active) setError(err.message || 'Could not load your orders.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, [user]);

  const selectedOrder = useMemo(() => (
    orders.find((order) => String(order.id) === String(selectedOrderId))
  ), [orders, selectedOrderId]);

  const closeDetails = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('order');
    setSearchParams(nextParams);
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-screen flex-col bg-[#FBF9F4]"
    >
      <Navbar />
      <main className="w-full flex-grow page-shell page-gutter pb-24 mt-[82px]">
        <EditorialHero
          eyebrow="Member Area"
          title="My"
          italic="Orders"
          copy="Track payment state, delivery progress, order totals, and item details from one quiet ledger."
          image={productAssetImages.terrarium}
          imageAlt="Glass terrarium"
          actions={(
            <Link to="/wishlist" className="w-max border border-[#FBF9F4]/65 px-6 py-4 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#FBF9F4] hover:text-[#0F3A3A]">
              Open Wishlist
            </Link>
          )}
          meta={[
            { label: 'Orders', value: loading ? '...' : orders.length.toString().padStart(2, '0') },
            { label: 'Details', value: 'Receipts' },
          ]}
        />

        <section className="pt-14 lg:pt-16">
        {loading ? (
          <div className="border border-[#B0B0A8]/20 bg-white p-12 text-center font-label text-[10px] uppercase tracking-[0.2em] text-[#5E6058]">
            Loading your orders...
          </div>
        ) : error ? (
          <div className="border border-[#D94F4F]/20 bg-[#FAF2F2] p-8 font-body text-sm text-[#9F403D]">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="grid gap-8 border border-[#B0B0A8]/20 bg-white p-8 md:grid-cols-[1fr_auto] md:items-center lg:p-12">
            <div>
              <h2 className="font-headline text-[34px] leading-tight text-[#1A1A1A]">No orders yet.</h2>
              <p className="mt-3 max-w-xl font-body text-sm leading-7 text-[#5E6058]">
                Once you checkout, orders, payment status, and item details will live here.
              </p>
            </div>
            <Link to="/discovery" className="bg-[#0F3A3A] px-6 py-4 text-center font-label text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              Shop Plants
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => (
              <article key={order.id} className="grid gap-6 border border-[#B0B0A8]/20 bg-white p-5 shadow-sm transition-colors hover:bg-[#FDFBF6] lg:grid-cols-[1fr_260px] lg:p-7">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] ${statusStyles[order.status] || statusStyles.pending}`}>
                      {order.status || 'pending'}
                    </span>
                    <span className={`font-label text-[9px] font-bold uppercase tracking-[0.14em] ${paymentStyles[order.payment_status] || 'text-[#5E6058]'}`}>
                      {order.payment_status || 'pending'} payment
                    </span>
                    <span className="font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#797C73]">
                      {dateTime(order.created_at)}
                    </span>
                  </div>
                  <h2 className="font-headline text-[28px] leading-tight text-[#1A1A1A]">
                    Order #{String(order.id).slice(0, 8)}
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {(order.order_items || []).slice(0, 4).map((item) => (
                      <div key={item.id} className="border border-[#B0B0A8]/15 bg-[#FBF9F4] p-4">
                        <p className="font-headline text-[18px] leading-tight text-[#1A1A1A]">{item.product_name || 'Product'}</p>
                        <p className="mt-2 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#6B6B6B]">
                          Qty {item.quantity} / {money(item.price_at_time)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-5 border-t border-[#B0B0A8]/15 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <div>
                    <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">Total</p>
                    <p className="mt-2 font-headline text-[32px] leading-none text-[#1A1A1A]">{money(order.total_amount)}</p>
                    <p className="mt-4 font-body text-[13px] leading-6 text-[#5E6058]">
                      {order.payment_method || 'cod'} / Ref {order.payment_reference || String(order.id).slice(0, 8)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchParams({ order: order.id })}
                    className="bg-[#0F3A3A] px-5 py-3.5 font-label text-[9px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1A2F2F]"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0B2525]/55 p-4 backdrop-blur-sm cursor-auto">
            <Motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="max-h-[88vh] w-full max-w-[760px] overflow-y-auto border border-[#D9D6CA] bg-white p-6 shadow-2xl md:p-8"
            >
              <div className="mb-7 flex items-start justify-between gap-5">
                <div>
                  <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">Order Detail</p>
                  <h2 className="mt-2 font-headline text-[34px] leading-tight text-[#1A1A1A]">#{String(selectedOrder.id).slice(0, 8)}</h2>
                </div>
                <button onClick={closeDetails} className="material-symbols-outlined text-[#5E6058] hover:text-[#1A1A1A]">close</button>
              </div>

              <div className="grid gap-px overflow-hidden border border-[#B0B0A8]/20 bg-[#B0B0A8]/20 sm:grid-cols-2">
                {[
                  ['Status', selectedOrder.status || 'pending'],
                  ['Payment', `${selectedOrder.payment_method || 'cod'} / ${selectedOrder.payment_status || 'pending'}`],
                  ['Placed', dateTime(selectedOrder.created_at)],
                  ['Total', money(selectedOrder.total_amount)],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#FBF9F4] p-5">
                    <p className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">{label}</p>
                    <p className="mt-2 font-headline text-[21px] text-[#1A1A1A]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="mb-4 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">Items</h3>
                <div className="divide-y divide-[#B0B0A8]/15 border border-[#B0B0A8]/20">
                  {(selectedOrder.order_items || []).map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-5 p-5">
                      <div>
                        <p className="font-headline text-[21px] leading-tight text-[#1A1A1A]">{item.product_name || 'Product'}</p>
                        <p className="mt-2 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#6B6B6B]">Quantity {item.quantity}</p>
                      </div>
                      <p className="font-headline text-[18px] text-[#1A1A1A]">{money(Number(item.price_at_time) * Number(item.quantity || 1))}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border border-[#B0B0A8]/20 bg-[#F5F4ED] p-5">
                <p className="font-label text-[8px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">Shipping Address</p>
                <p className="mt-2 font-body text-sm leading-7 text-[#31332C]">{selectedOrder.shipping_address || 'Not provided'}</p>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default OrdersPage;
