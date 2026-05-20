import React, { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';

const money = (value) => `रू ${Number(value || 0).toLocaleString('en-NP', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

const StockInfoBar = ({ products = [], loading }) => {
  const stats = useMemo(() => {
    const totalUnits = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const inventoryValue = products.reduce((sum, product) => (
      sum + Number(product.price || 0) * Number(product.stock || 0)
    ), 0);
    const activeUnits = products
      .filter((product) => product.is_active)
      .reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) < 10).length;
    const outOfStock = products.filter((product) => Number(product.stock || 0) <= 0).length;
    const averagePrice = totalUnits ? inventoryValue / totalUnits : 0;
    const activeShare = totalUnits ? Math.round((activeUnits / totalUnits) * 100) : 0;

    return { totalUnits, inventoryValue, lowStock, outOfStock, averagePrice, activeShare };
  }, [products]);

  const cards = [
    {
      label: 'Stock Units',
      value: loading ? '...' : stats.totalUnits.toLocaleString('en-NP'),
      helper: 'Total units in inventory',
      icon: 'inventory_2',
      tone: 'text-[#31332C]',
    },
    {
      label: 'Low Stock',
      value: loading ? '...' : stats.lowStock.toString().padStart(2, '0'),
      helper: 'Listings below 10 units',
      icon: 'priority_high',
      tone: stats.lowStock ? 'text-[#9F403D]' : 'text-[#2F4F4F]',
    },
    {
      label: 'Out of Stock',
      value: loading ? '...' : stats.outOfStock.toString().padStart(2, '0'),
      helper: 'Needs restock or review',
      icon: 'production_quantity_limits',
      tone: stats.outOfStock ? 'text-[#9F403D]' : 'text-[#2F4F4F]',
    },
    {
      label: 'Inventory Value',
      value: loading ? '...' : money(stats.inventoryValue),
      helper: `Average unit ${loading ? '...' : money(stats.averagePrice)}`,
      icon: 'payments',
      tone: 'text-[#785A1A]',
    },
    {
      label: 'Active Stock',
      value: loading ? '...' : `${stats.activeShare}%`,
      helper: 'Units live for shoppers',
      icon: 'monitoring',
      tone: 'text-[#2F4F4F]',
    },
  ];

  return (
    <Motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20 w-full"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#785A1A]">Inventory Intelligence</p>
          <h2 className="mt-3 font-headline text-4xl tracking-tighter text-[#31332C]">Stock Overview</h2>
        </div>
        <p className="max-w-[380px] font-body text-[13px] leading-relaxed text-[#5E6058]">
          Quick stock health before the inventory table: restock risk, total quantity, and the value currently sitting in inventory.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 border-l border-t border-[#B1B3A9]/20 bg-white shadow-xl shadow-black/5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => (
          <Motion.div
            key={card.label}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="group border-b border-r border-[#B1B3A9]/20 p-6 transition-colors hover:bg-[#FBF9F4] md:p-8"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#5E6058]">{card.label}</p>
              <span className={`material-symbols-outlined text-[20px] ${card.tone}`}>{card.icon}</span>
            </div>
            <Motion.h3
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`mb-5 truncate font-headline text-[34px] tracking-tight ${card.tone}`}
            >
              {card.value}
            </Motion.h3>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#5E6058]/75">
              {loading ? 'Reading database' : card.helper}
            </p>
          </Motion.div>
        ))}
      </div>
    </Motion.section>
  );
};

export default StockInfoBar;
