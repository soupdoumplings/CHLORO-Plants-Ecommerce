import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { supabase } from '../../supabase';
import { useAuth } from '../../lib/AuthContext';
import { useCart } from '../../lib/CartContext';
import { useWishlist } from '../../lib/WishlistContext';

const statusStyles = {
  pending: 'bg-[#FBD185]/35 text-[#785A1A]',
  processing: 'bg-[#C6E9E9]/45 text-[#244545]',
  shipping: 'bg-[#E5E2E1] text-[#525151]',
  delivered: 'bg-[#D2E7E4] text-[#2F4F4F]',
  cancelled: 'bg-[#F8D8D6] text-[#9F403D]',
};

const money = (value) => `रू ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const dateLabel = (value) => {
  if (!value) return 'Pending';
  return new Intl.DateTimeFormat('en-NP', { dateStyle: 'medium' }).format(new Date(value));
};

const RecentOrders = () => {
  const { user } = useAuth();
  const { addToBag } = useCart();
  const wishlist = useWishlist();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      setOrderError('');

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        if (active) setOrders(data || []);
      } catch (err) {
        if (active) setOrderError(err.message || 'Could not load recent orders.');
      } finally {
        if (active) setLoadingOrders(false);
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, [user]);

  const wishlistItems = useMemo(() => wishlist.items.slice(0, 4), [wishlist.items]);

  return (
    <Motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 lg:mt-24"
    >
      <div className="mb-8 flex flex-col gap-5 border-b border-[#B0B0A8]/20 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-8">
          {[
            ['orders', 'Recent Orders'],
            ['wishlist', 'Wishlist'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative pb-4 font-headline text-[22px] transition-colors lg:text-[26px] ${
                activeTab === key ? 'text-[#1A1A1A]' : 'text-[#B0B0A8] hover:text-[#6B6B6B]'
              }`}
            >
              {label}
              {activeTab === key && <Motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A1A1A]" />}
            </button>
          ))}
        </div>
        <Link
          to={activeTab === 'orders' ? '/orders' : '/wishlist'}
          className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#785A1A] underline underline-offset-4"
        >
          View All
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <Motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="divide-y divide-[#B0B0A8]/12 border border-[#B0B0A8]/15 bg-white"
          >
            {loadingOrders ? (
              <div className="p-8 font-label text-[10px] uppercase tracking-[0.18em] text-[#5E6058]">Loading orders...</div>
            ) : orderError ? (
              <div className="p-8 font-body text-sm text-[#9F403D]">{orderError}</div>
            ) : orders.length === 0 ? (
              <div className="p-8">
                <p className="font-headline text-[24px] text-[#1A1A1A]">No orders yet.</p>
                <Link to="/discovery" className="mt-4 inline-flex font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#0F3A3A]">Start Shopping</Link>
              </div>
            ) : (
              orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders?order=${order.id}`}
                  className="grid gap-4 p-5 transition-colors hover:bg-[#FBF9F4] sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className={`px-2.5 py-1 font-label text-[8px] font-bold uppercase tracking-[0.14em] ${statusStyles[order.status] || statusStyles.pending}`}>
                        {order.status || 'pending'}
                      </span>
                      <span className="font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#797C73]">{dateLabel(order.created_at)}</span>
                    </div>
                    <h4 className="font-headline text-[20px] leading-tight text-[#1A1A1A]">
                      Order #{String(order.id).slice(0, 8)}
                    </h4>
                    <p className="mt-2 font-body text-[13px] leading-6 text-[#5E6058]">
                      {(order.order_items || []).slice(0, 2).map((item) => item.product_name || 'Product').join(', ') || 'Items pending'}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-headline text-[21px] text-[#1A1A1A]">{money(order.total_amount)}</p>
                    <p className="mt-2 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#5E6058]">
                      {order.payment_method || 'cod'} / {order.payment_status || 'pending'}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </Motion.div>
        ) : (
          <Motion.div
            key="wishlist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="divide-y divide-[#B0B0A8]/12 border border-[#B0B0A8]/15 bg-white"
          >
            {wishlist.loading ? (
              <div className="p-8 font-label text-[10px] uppercase tracking-[0.18em] text-[#5E6058]">Loading wishlist...</div>
            ) : wishlist.error ? (
              <div className="p-8 font-body text-sm text-[#9F403D]">{wishlist.error}</div>
            ) : wishlistItems.length === 0 ? (
              <div className="p-8">
                <p className="font-headline text-[24px] text-[#1A1A1A]">Your wishlist is empty.</p>
                <Link to="/discovery" className="mt-4 inline-flex font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#0F3A3A]">Browse Plants</Link>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-5 p-5 transition-colors hover:bg-[#FBF9F4]">
                  <Link to={`/catalogue/${item.productId}`} className="h-16 w-16 shrink-0 overflow-hidden bg-[#EDEBE4]">
                    <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/catalogue/${item.productId}`} className="font-headline text-[19px] leading-tight text-[#1A1A1A] hover:text-[#785A1A]">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#6B6B6B]">
                      {item.product.category}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-headline text-[17px] text-[#1A1A1A]">{item.product.displayPrice}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToBag(item.product)}
                    className="shrink-0 bg-[#0F3A3A] px-4 py-3 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-white"
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.section>
  );
};

export default RecentOrders;
