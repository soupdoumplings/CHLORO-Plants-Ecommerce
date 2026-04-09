import React from 'react';

const SystemLog = () => {
  const logs = [
    { time: "09:42:12", title: "Curation Cycle Initiated", desc: "Automated hydration sensor activated for Specimen 842 (Ficus Lyrata)." },
    { time: "08:15:00", title: "Inventory Audit Completed", desc: "Catalog synchronization successful across all Himalayan nodes." },
    { time: "Yesterday", title: "Valuation Recalculated", desc: "Asset value for Monastera Deliciosa adjusted by +3.2% based on market demand." }
  ];

  return (
    <section className="mb-32 px-12 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 py-12 border-t border-[#B1B3A9]/20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Stock Health Insights */}
      <div className="space-y-12">
        <h3 className="font-headline text-4xl text-[#31332C] tracking-tighter">Stock Health</h3>
        <div className="space-y-10">
          {[
            { label: "Hydration Balance", value: 85, color: "bg-[#456565]" },
            { label: "Nutrient Density", value: 68, color: "bg-[#456565]" },
            { label: "Light Exposure", value: 12, color: "bg-[#9F403D]" }
          ].map((stat, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between font-label text-[11px] uppercase tracking-[0.1em] text-[#31332C] font-black">
                <span>{stat.label}</span>
                <span className={stat.value < 20 ? 'text-[#9F403D]' : 'text-[#31332C]'}>{stat.value}%</span>
              </div>
              <div className="w-full bg-[#E2E3D9] h-1 overflow-hidden relative">
                 <div className={`absolute left-0 top-0 bottom-0 ${stat.color} transition-all duration-1000 delay-300`} style={{ width: `${stat.value}%` }}></div>
              </div>
              <p className="font-body text-[10px] text-[#5E6058] uppercase tracking-widest opacity-70">
                 {stat.value < 20 ? 'Critical intervention required' : 'Optimal range maintained'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Log History */}
      <div className="bg-[#F5F4ED] p-16 rounded-sm space-y-12 shadow-inner border border-[#B1B3A9]/10">
        <h3 className="font-headline text-4xl text-[#31332C] tracking-tighter">System Log</h3>
        <div className="space-y-10">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-10 border-b border-[#B1B3A9]/10 pb-8 last:border-0 group cursor-help">
               <span className="font-label text-xs uppercase tracking-widest text-[#5E6058] w-24 opacity-60 group-hover:opacity-100 transition-opacity">{log.time}</span>
               <div className="space-y-3">
                  <p className="font-body text-sm font-bold text-[#31332C] group-hover:text-[#785A1A] transition-colors uppercase tracking-tight">{log.title}</p>
                  <p className="font-body text-xs leading-relaxed text-[#5E6058] opacity-80 group-hover:opacity-100 transition-opacity">{log.desc}</p>
               </div>
            </div>
          ))}
          <button className="flex items-center gap-4 font-label text-xs uppercase tracking-[0.2em] text-[#785A1A] font-bold mt-12 hover:gap-6 transition-all group">
             Full System Manifest
             <span className="material-symbols-outlined text-sm">east</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SystemLog;
