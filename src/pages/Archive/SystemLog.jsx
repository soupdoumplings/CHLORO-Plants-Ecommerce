import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';

const money = (value) => `NPR ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const dateLabel = (value) => {
  if (!value) return 'Pending';
  return new Intl.DateTimeFormat('en-NP', { dateStyle: 'medium' }).format(new Date(value));
};

const statusLabels = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];

const SystemLog = ({ orders = [], loading }) => {
  const insights = useMemo(() => {
    const statusSummary = statusLabels.map((status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
    }));

    const itemMap = new Map();
    orders.forEach((order) => {
      (order.order_items || []).forEach((item) => {
        const key = item.product_id || item.product_name || item.id;
        const current = itemMap.get(key) || {
          name: item.product_name || 'Product',
          quantity: 0,
          revenue: 0,
        };
        current.quantity += Number(item.quantity || 0);
        current.revenue += Number(item.quantity || 0) * Number(item.price_at_time || 0);
        itemMap.set(key, current);
      });
    });

    const topItems = Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      statusSummary,
      topItems,
      recentTransactions: orders.slice(0, 6),
    };
  }, [orders]);

  return (
    <Motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24 grid grid-cols-1 gap-8 border-t border-[#B1B3A9]/20 py-12 lg:grid-cols-12"
    >
      <div className="lg:col-span-5">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#785A1A]">Finance Operations</p>
        <h3 className="mt-3 font-headline text-[44px] leading-[0.95] tracking-tight text-[#31332C]">
          Revenue and payment health.
        </h3>
        <p className="mt-6 max-w-md font-body text-sm leading-7 text-[#5E6058]">
          These panels read from the orders and order items tables, so finance now reflects the store instead of inventory-only system logs.
        </p>

        <div className="mt-10 space-y-5">
          {insights.statusSummary.map((item) => {
            const max = Math.max(1, ...insights.statusSummary.map((entry) => entry.count));
            const width = `${Math.round((item.count / max) * 100)}%`;
            return (
              <div key={item.status}>
                <div className="mb-2 flex justify-between font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#31332C]">
                  <span>{item.status}</span>
                  <span>{loading ? '...' : item.count}</span>
                </div>
                <div className="h-1 w-full overflow-hidden bg-[#E2E3D9]">
                  <Motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: loading ? 0 : width }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-[#0F3A3A]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:col-span-7">
        <div className="border border-[#B1B3A9]/20 bg-white p-6 shadow-xl shadow-black/5 md:p-8">
          <div className="mb-6 flex items-end justify-between gap-5">
            <div>
              <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">Payments</p>
              <h4 className="mt-2 font-headline text-[32px] leading-none text-[#31332C]">Recent Transactions</h4>
            </div>
            <span className="material-symbols-outlined text-[#0F3A3A]">receipt_long</span>
          </div>

          {loading ? (
            <div className="py-8 font-label text-[10px] uppercase tracking-[0.18em] text-[#5E6058]">Loading transactions...</div>
          ) : insights.recentTransactions.length === 0 ? (
            <div className="py-8 font-body text-sm text-[#5E6058]">No transactions yet.</div>
          ) : (
            <div className="divide-y divide-[#B1B3A9]/15">
              {insights.recentTransactions.map((order) => (
                <div key={order.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-headline text-[20px] leading-tight text-[#31332C]">
                      {order.customer_name || 'Customer'} / #{String(order.id).slice(0, 8)}
                    </p>
                    <p className="mt-1 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#5E6058]">
                      {dateLabel(order.created_at)} / {order.payment_method || 'cod'} / {order.payment_status || 'pending'}
                    </p>
                  </div>
                  <p className="font-headline text-[20px] text-[#31332C] sm:text-right">{money(order.total_amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-[#B1B3A9]/20 bg-[#F5F4ED] p-6 md:p-8">
          <div className="mb-6 flex items-end justify-between gap-5">
            <div>
              <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">Demand</p>
              <h4 className="mt-2 font-headline text-[32px] leading-none text-[#31332C]">Top Ordered Items</h4>
            </div>
            <span className="material-symbols-outlined text-[#0F3A3A]">leaderboard</span>
          </div>

          {loading ? (
            <div className="py-8 font-label text-[10px] uppercase tracking-[0.18em] text-[#5E6058]">Loading item data...</div>
          ) : insights.topItems.length === 0 ? (
            <div className="py-8 font-body text-sm text-[#5E6058]">No ordered items yet.</div>
          ) : (
            <div className="grid gap-3">
              {insights.topItems.map((item, index) => (
                <div key={item.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border border-[#B1B3A9]/15 bg-white p-4">
                  <span className="font-label text-[10px] font-bold text-[#785A1A]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-headline text-[20px] leading-tight text-[#31332C]">{item.name}</p>
                    <p className="mt-1 font-label text-[8px] font-bold uppercase tracking-[0.14em] text-[#5E6058]">
                      {item.quantity} ordered
                    </p>
                  </div>
                  <p className="font-headline text-[18px] text-[#31332C]">{money(item.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Motion.section>
  );
};

export default SystemLog;
