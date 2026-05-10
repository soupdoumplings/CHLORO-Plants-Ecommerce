import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';

const money = (value) => `Rs ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const StockInfoBar = ({ products = [], loading }) => {
  const stats = useMemo(() => {
    const totalUnits = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const inventoryValue = products.reduce((sum, product) => (
      sum + (Number(product.price || 0) * Number(product.stock || 0))
    ), 0);
    const activeUnits = products
      .filter((product) => product.is_active)
      .reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const lowStockItems = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) < 10);
    const outOfStockItems = products.filter((product) => Number(product.stock || 0) <= 0);
    const averageUnitPrice = totalUnits > 0 ? inventoryValue / totalUnits : 0;
    const activeShare = totalUnits > 0 ? Math.round((activeUnits / totalUnits) * 100) : 0;

    return {
      totalUnits,
      inventoryValue,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      averageUnitPrice,
      activeShare,
    };
  }, [products]);

  const tiles = [
    {
      label: 'Stock Units',
      value: loading ? '...' : stats.totalUnits.toLocaleString('en-NP'),
      note: 'Total quantity across all listings',
      icon: 'inventory_2',
      tone: 'text-[#31332C]',
    },
    {
      label: 'Low Stock',
      value: loading ? '...' : stats.lowStockCount.toString().padStart(2, '0'),
      note: 'Items below 10 units',
      icon: 'priority_high',
      tone: stats.lowStockCount ? 'text-[#9F403D]' : 'text-[#456565]',
    },
    {
      label: 'Out of Stock',
      value: loading ? '...' : stats.outOfStockCount.toString().padStart(2, '0'),
      note: 'Needs restock or archive decision',
      icon: 'production_quantity_limits',
      tone: stats.outOfStockCount ? 'text-[#9F403D]' : 'text-[#456565]',
    },
    {
      label: 'Inventory Value',
      value: loading ? '...' : money(stats.inventoryValue),
      note: `Avg unit price ${loading ? '...' : money(stats.averageUnitPrice)}`,
      icon: 'payments',
      tone: 'text-[#31332C]',
    },
    {
      label: 'Active Stock Share',
      value: loading ? '...' : `${stats.activeShare}%`,
      note: 'Units currently visible to shoppers',
      icon: 'show_chart',
      tone: 'text-[#785A1A]',
    },
  ];

  return (
    <Motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 px-12 max-w-[1440px] mx-auto w-full"
    >
      <div className="border border-[#B1B3A9]/20 bg-white shadow-2xl shadow-black/5">
        <div className="flex flex-col gap-4 border-b border-[#B1B3A9]/20 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#785A1A]">Inventory Intelligence</p>
            <h3 className="mt-2 font-headline text-3xl tracking-tight text-[#31332C]">Stock position before holdings</h3>
          </div>
          <p className="max-w-[360px] font-body text-[12px] leading-relaxed text-[#5E6058]">
            Fast read on restock risk, total stock value, and how much of the inventory is live for shoppers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
          {tiles.map((tile, index) => (
            <Motion.div
              key={tile.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`group p-6 transition-colors hover:bg-[#FBF9F4] ${index < tiles.length - 1 ? 'border-b md:border-r xl:border-b-0 border-[#B1B3A9]/20' : ''}`}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="font-label text-[9px] font-bold uppercase tracking-[0.22em] text-[#5E6058]">{tile.label}</span>
                <span className={`material-symbols-outlined text-[18px] ${tile.tone}`}>{tile.icon}</span>
              </div>
              <p className={`font-headline text-[34px] leading-none tracking-tight ${tile.tone}`}>{tile.value}</p>
              <p className="mt-4 min-h-[32px] font-body text-[12px] leading-relaxed text-[#5E6058]">{tile.note}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </Motion.section>
  );
};

export default StockInfoBar;
