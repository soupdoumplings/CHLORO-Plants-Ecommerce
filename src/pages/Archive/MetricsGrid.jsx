import React from 'react';

const MetricsGrid = () => {
  return (
    <section className="mb-24 px-12 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#B1B3A9]/20 bg-white shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Metric 1: Total Catalog Value */}
      <div className="p-10 border-b lg:border-b-0 lg:border-r border-[#B1B3A9]/20 group hover:bg-[#FBF9F4] transition-colors">
        <p className="font-label text-xs tracking-widest text-[#5E6058] uppercase mb-4">Total Catalog Value</p>
        <h3 className="font-headline text-5xl text-[#31332C] mb-6 tracking-tight">रू 142,850.00</h3>
        <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
          <span className="material-symbols-outlined text-[#456565] text-sm font-bold">trending_up</span>
          <p className="font-label text-xs font-bold text-[#456565] tracking-tight uppercase">+8.4% last quarter</p>
        </div>
      </div>

      {/* Metric 2: Active Listings */}
      <div className="p-10 border-b lg:border-b-0 lg:border-r border-[#B1B3A9]/20 group hover:bg-[#FBF9F4] transition-colors">
        <p className="font-label text-xs tracking-widest text-[#5E6058] uppercase mb-4">Active Listings</p>
        <h3 className="font-headline text-5xl text-[#31332C] mb-6 tracking-tight">284</h3>
        <div className="flex items-center gap-2 text-[#5E6058]">
          <span className="material-symbols-outlined text-sm font-bold opacity-60">inventory_2</span>
          <p className="font-label text-xs font-medium tracking-tight uppercase opacity-80">Distribution: Global</p>
        </div>
      </div>

      {/* Metric 3: Critical Stock */}
      <div className="p-10 border-b lg:border-b-0 lg:border-r border-[#B1B3A9]/20 group hover:bg-[#FBF9F4] transition-colors">
        <p className="font-label text-xs tracking-widest text-[#5E6058] uppercase mb-4">Critical Stock</p>
        <h3 className="font-headline text-5xl text-[#9F403D] mb-6 tracking-tight">08</h3>
        <div className="flex items-center gap-2 text-[#9F403D]">
          <span className="material-symbols-outlined text-sm font-bold animate-pulse">report</span>
          <p className="font-label text-xs font-bold tracking-tight uppercase">Low inventory alert</p>
        </div>
      </div>

      {/* Metric 4: Curation Velocity */}
      <div className="p-10 group hover:bg-[#FBF9F4] transition-colors relative h-full">
        <p className="font-label text-xs tracking-widest text-[#5E6058] uppercase mb-4">Curation Velocity</p>
        <div className="flex items-end justify-between mb-6">
           <h3 className="font-headline text-5xl text-[#31332C] tracking-tight">88%</h3>
        </div>
        <div className="w-full bg-[#EFEEE6] h-1 relative rounded-full overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 bg-[#785A1A] transition-all duration-1000 group-hover:opacity-80" style={{ width: '88%' }}></div>
        </div>
      </div>
    </section>
  );
};

export default MetricsGrid;
