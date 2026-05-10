import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';

const money = (value) => `रू ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const isCurrentMonth = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const MetricsGrid = ({ orders = [], loading }) => {
  const metrics = useMemo(() => {
    const completedOrders = orders.filter((order) => order.payment_status === 'completed');
    const pendingOrders = orders.filter((order) => order.payment_status === 'pending');
    const cancelledOrders = orders.filter((order) => (
      order.status === 'cancelled'
      || ['cancelled', 'refunded', 'failed'].includes(order.payment_status)
    ));
    const monthlyOrders = completedOrders.filter((order) => isCurrentMonth(order.created_at));

    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const pendingPayments = pendingOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const cancelledValue = cancelledOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    return [
      {
        label: 'Total Revenue',
        value: money(totalRevenue),
        helper: `${completedOrders.length} completed payment${completedOrders.length === 1 ? '' : 's'}`,
        icon: 'payments',
        tone: 'text-[#31332C]',
      },
      {
        label: 'Pending Payments',
        value: money(pendingPayments),
        helper: `${pendingOrders.length} awaiting settlement`,
        icon: 'pending_actions',
        tone: 'text-[#785A1A]',
      },
      {
        label: 'Monthly Revenue',
        value: money(monthlyRevenue),
        helper: `${monthlyOrders.length} paid order${monthlyOrders.length === 1 ? '' : 's'} this month`,
        icon: 'monitoring',
        tone: 'text-[#2F4F4F]',
      },
      {
        label: 'Refunded / Cancelled',
        value: money(cancelledValue),
        helper: `${cancelledOrders.length} order${cancelledOrders.length === 1 ? '' : 's'} affected`,
        icon: 'undo',
        tone: 'text-[#9F403D]',
      },
    ];
  }, [orders]);

  return (
    <section className="mb-16 grid w-full grid-cols-1 border-l border-t border-[#B1B3A9]/20 bg-white shadow-xl shadow-black/5 sm:grid-cols-2 lg:mb-24 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="group border-b border-r border-[#B1B3A9]/20 p-6 transition-colors hover:bg-[#FBF9F4] md:p-8 lg:p-10"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#5E6058]">{metric.label}</p>
            <span className={`material-symbols-outlined text-[20px] ${metric.tone}`}>{metric.icon}</span>
          </div>
          <Motion.h3
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`mb-5 truncate font-headline text-[34px] tracking-tight md:text-[40px] ${metric.tone}`}
          >
            {loading ? '...' : metric.value}
          </Motion.h3>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#5E6058]/75">
            {loading ? 'Reading database' : metric.helper}
          </p>
        </Motion.div>
      ))}
    </section>
  );
};

export default MetricsGrid;
