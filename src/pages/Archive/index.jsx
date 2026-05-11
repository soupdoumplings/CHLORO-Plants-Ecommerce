import React, { useMemo, useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ArchiveHeader from './ArchiveHeader';
import BroadcastWidget from './BroadcastWidget';
import MetricsGrid from './MetricsGrid';
import OrdersTable from './OrdersTable';
import StockInfoBar from './StockInfoBar';
import InventoryTable from './InventoryTable';
import SystemLog from './SystemLog';
import { supabase } from '../../supabase';

const normalizeRpcOrder = (order) => ({
  ...order,
  order_items: Array.isArray(order.order_items) ? order.order_items : [],
});

const adminSections = [
  {
    id: 'orders',
    label: 'Customer Orders',
    eyebrow: 'Fulfillment',
    icon: 'receipt_long',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    eyebrow: 'Products',
    icon: 'inventory_2',
  },
  {
    id: 'statistics',
    label: 'Statistics',
    eyebrow: 'Finance',
    icon: 'monitoring',
  },
];

const getInitialSection = () => {
  if (typeof window === 'undefined') return 'orders';
  const hashSection = window.location.hash.replace('#', '');
  return adminSections.some((section) => section.id === hashSection) ? hashSection : 'orders';
};

const ArchivePage = () => {
  const [activeSection, setActiveSection] = useState(getInitialSection);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const sectionStats = useMemo(() => {
    const paidOrders = orders.filter((order) => order.payment_status === 'completed');
    const paidRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) < 10).length;

    return {
      orders: ordersLoading ? '...' : orders.length.toLocaleString('en-NP'),
      inventory: loading ? '...' : `${products.length.toLocaleString('en-NP')} items`,
      statistics: ordersLoading ? '...' : `रू ${paidRevenue.toLocaleString('en-NP')}`,
      inventoryHelper: loading ? 'Reading stock' : `${lowStock} low stock`,
    };
  }, [loading, orders, ordersLoading, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching inventory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError('');
      const { data, error, count } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if ((data || []).length > 0 || count === 0) {
        setOrders(data || []);
        return;
      }

      const { data: rpcData, error: rpcError } = await supabase.rpc('admin_order_queue');
      if (rpcError) throw rpcError;
      setOrders((rpcData || []).map(normalizeRpcOrder));
    } catch (err) {
      console.error('Error fetching orders:', err.message);
      setOrders([]);
      setOrdersError(
        `${err.message || 'Could not load customer orders.'} If customers can see orders but admin cannot, run supabase/admin_orders_visibility_patch.sql in Supabase SQL Editor.`
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleHashChange = () => setActiveSection(getInitialSection());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `${window.location.pathname}#${sectionId}`);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative"
    >
      <Navbar />
      <main className="w-full page-shell flex-grow mt-[82px] page-gutter pt-16">
        <ArchiveHeader />

        <section className="mb-12 grid w-full grid-cols-1 border-l border-t border-[#B1B3A9]/20 bg-white shadow-xl shadow-black/5 lg:grid-cols-3">
          {adminSections.map((section) => {
            const isActive = activeSection === section.id;
            const stat = section.id === 'orders'
              ? sectionStats.orders
              : section.id === 'inventory'
                ? sectionStats.inventory
                : sectionStats.statistics;
            const helper = section.id === 'orders'
              ? 'orders in queue'
              : section.id === 'inventory'
                ? sectionStats.inventoryHelper
                : 'paid revenue';

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSectionChange(section.id)}
                className={`group flex min-h-[132px] items-stretch justify-between gap-5 border-b border-r border-[#B1B3A9]/20 p-6 text-left transition-colors md:p-8 ${
                  isActive ? 'bg-[#31332C] text-white' : 'bg-white text-[#31332C] hover:bg-[#F5F4ED]'
                }`}
              >
                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <p className={`font-label text-[9px] font-bold uppercase tracking-[0.2em] ${
                      isActive ? 'text-[#D4B879]' : 'text-[#785A1A]'
                    }`}>
                      {section.eyebrow}
                    </p>
                    <h2 className="mt-2 font-headline text-[28px] leading-none tracking-tight md:text-[34px]">
                      {section.label}
                    </h2>
                  </div>
                  <p className={`font-label text-[9px] font-bold uppercase tracking-[0.14em] ${
                    isActive ? 'text-white/65' : 'text-[#5E6058]'
                  }`}>
                    {stat} / {helper}
                  </p>
                </div>
                <span className={`material-symbols-outlined mt-1 text-[24px] transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#D4B879]' : 'text-[#0F3A3A]'
                }`}>
                  {section.icon}
                </span>
              </button>
            );
          })}
        </section>

        {activeSection === 'orders' && (
          <OrdersTable orders={orders} loading={ordersLoading} error={ordersError} onRefresh={fetchOrders} />
        )}

        {activeSection === 'inventory' && (
          <>
            <StockInfoBar products={products} loading={loading} />
            <InventoryTable products={products} loading={loading} onRefresh={fetchProducts} />
          </>
        )}

        {activeSection === 'statistics' && (
          <>
            <BroadcastWidget />
            <MetricsGrid products={products} orders={orders} loading={loading || ordersLoading} />
            <SystemLog orders={orders} loading={ordersLoading} />
          </>
        )}
      </main>

      <Footer />


    </Motion.div>
  );
};

export default ArchivePage;
