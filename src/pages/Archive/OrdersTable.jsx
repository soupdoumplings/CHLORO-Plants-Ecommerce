import React, { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { supabase } from '../../supabase';

const statusOptions = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];

const statusStyles = {
  pending: 'bg-[#FBD185]/35 text-[#785A1A]',
  processing: 'bg-[#C6E9E9]/45 text-[#244545]',
  shipping: 'bg-[#E5E2E1] text-[#525151]',
  delivered: 'bg-[#D2E7E4] text-[#2F4F4F]',
  cancelled: 'bg-[#F8D8D6] text-[#9F403D]',
};

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return `NPR ${amount.toLocaleString('en-NP', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return 'Pending';
  return new Intl.DateTimeFormat('en-NP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const OrdersTable = ({ orders, loading, onRefresh }) => {
  const [updatingId, setUpdatingId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = async (orderId, nextStatus) => {
    setUpdatingId(orderId);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId);

      if (error) throw error;
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Order status update failed:', err.message);
      alert('Failed to update order status.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <Motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24 px-12 max-w-[1440px] mx-auto w-full"
    >
      <div className="mb-10 flex flex-col gap-5 border-b border-[#B1B3A9]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">
            Fulfillment Queue
          </p>
          <h2 className="mt-2 font-headline text-4xl tracking-tight text-[#31332C]">
            Customer Orders
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', ...statusOptions].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 font-label text-[9px] font-bold uppercase tracking-[0.14em] transition-colors ${
                statusFilter === status
                  ? 'bg-[#31332C] text-white'
                  : 'bg-white text-[#5E6058] hover:bg-[#F5F4ED]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden border border-[#B1B3A9]/20 bg-white shadow-xl shadow-black/5">
        {loading ? (
          <div className="p-12 text-center font-label text-[11px] uppercase tracking-widest text-[#5E6058]">
            Loading Orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center font-label text-[11px] uppercase tracking-widest text-[#5E6058]">
            No orders in this queue.
          </div>
        ) : (
          <div className="divide-y divide-[#B1B3A9]/15">
            {filteredOrders.map((order) => (
              <div key={order.id} className="grid gap-6 p-6 transition-colors hover:bg-[#FBF9F4] lg:grid-cols-[1.2fr_1fr_220px] lg:p-8">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1.5 font-label text-[8px] font-bold uppercase tracking-[0.14em] ${statusStyles[order.status] || statusStyles.pending}`}>
                      {order.status}
                    </span>
                    <span className="font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#797C73]">
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <h3 className="font-headline text-2xl leading-tight text-[#31332C]">
                    {order.customer_name}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-6 text-[#5E6058]">
                    {order.customer_phone} - {order.customer_email}
                  </p>
                  <p className="mt-3 max-w-xl font-body text-sm leading-6 text-[#31332C]">
                    {order.shipping_address}
                  </p>
                </div>

                <div>
                  <p className="mb-3 font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#785A1A]">
                    Items
                  </p>
                  <div className="space-y-2">
                    {(order.order_items || []).map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-4 font-body text-sm text-[#31332C]">
                        <span>{item.product_name || 'Product'} x {item.quantity}</span>
                        <span className="shrink-0 text-[#5E6058]">{formatMoney(item.price_at_time)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-[#B1B3A9]/15 pt-4">
                    <p className="font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#5E6058]">
                      {order.payment_method} - {order.payment_status}
                    </p>
                    <p className="mt-2 font-headline text-2xl text-[#31332C]">
                      {formatMoney(order.total_amount)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">
                      Delivery Status
                    </span>
                    <select
                      value={order.status || 'pending'}
                      disabled={updatingId === order.id}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                      className="border border-[#B1B3A9]/30 bg-[#FBF9F4] px-4 py-3 font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#31332C] outline-none transition-colors focus:border-[#785A1A] disabled:opacity-50"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="font-body text-xs leading-5 text-[#797C73]">
                    Ref: {order.payment_reference || order.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Motion.section>
  );
};

export default OrdersTable;
