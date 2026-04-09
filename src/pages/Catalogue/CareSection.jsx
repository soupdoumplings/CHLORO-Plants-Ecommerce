import React from 'react';

const CareSection = () => {
  return (
    <section className="mb-32">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-[#B1B3A9]/10 pb-8 gap-8">
        <h2 className="font-headline text-5xl italic text-[#31332C]">Cultivation & Preservation</h2>
        <p className="font-label text-[11px] tracking-[0.1rem] uppercase text-[#5E6058] mt-4 md:mt-0 font-bold opacity-80">Technical Care Specifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-[#B1B3A9]/10">
        
        {/* Illumination Section */}
        <div className="p-16 bg-[#F5F4ED] border-r border-[#B1B3A9]/10 text-left group">
          <span className="material-symbols-outlined text-[#785A1A] mb-8 text-3xl group-hover:rotate-45 transition-transform" data-icon="wb_sunny">
            wb_sunny
          </span>
          <h3 className="font-label text-xs tracking-[0.15rem] uppercase mb-8 font-black text-[#31332C]">Illumination</h3>
          <p className="font-body text-sm leading-relaxed text-[#5E6058] mb-12 opacity-90 transition-opacity group-hover:opacity-100">
              Thrives in bright, filtered light. Direct sun may scorch the delicate broad-leaf membranes, while deep shade will cause the specimen to stretch and lose its sculptural density.
          </p>
          <div className="flex items-center gap-4 text-xs font-label tracking-widest uppercase text-[#456565] font-black">
            <span className="w-2.5 h-2.5 bg-[#456565] rounded-full drop-shadow-sm"></span>
            Bright Indirect
          </div>
        </div>

        {/* Hydration Section */}
        <div className="p-16 bg-[#E8E9E0] border-r border-[#B1B3A9]/10 text-left group">
          <span className="material-symbols-outlined text-[#785A1A] mb-8 text-3xl group-hover:scale-y-125 transition-transform" data-icon="water_drop">
            water_drop
          </span>
          <h3 className="font-label text-xs tracking-[0.15rem] uppercase mb-8 font-black text-[#31332C]">Hydration</h3>
          <p className="font-body text-sm leading-relaxed text-[#5E6058] mb-12 opacity-90 transition-opacity group-hover:opacity-100 italic">
              Water only when the top two inches of soil feel parched. Consistency is the hallmark of health for the Lyrata.
          </p>
          
          <div className="bg-white p-10 border border-[#B1B3A9]/15 shadow-2xl shadow-black/5 transform group-hover:-translate-y-2 transition-transform duration-500">
             <p className="font-label text-[9px] tracking-[0.1rem] uppercase mb-6 opacity-60 font-black text-[#31332C]">Botanical Management</p>
             <h4 className="font-headline italic text-2xl text-[#31332C] mb-6">Set Hydration Schedule</h4>
             <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[#B1B3A9]/10 pb-3">
                   <span className="text-xs font-body text-[#31332C]">Frequency</span>
                   <span className="text-xs font-label uppercase text-[#785A1A] font-black tracking-widest">Every 10 Days</span>
                </div>
                <button className="w-full py-4 text-[10px] font-label tracking-widest uppercase border border-[#5F5E5E] text-[#5F5E5E] hover:bg-[#5F5E5E] hover:text-white transition-all font-bold active:scale-95">
                   Sync to Calendar
                </button>
             </div>
          </div>
        </div>

        {/* Environment Section */}
        <div className="p-16 bg-[#E2E3D9] text-left group overflow-hidden">
          <span className="material-symbols-outlined text-[#785A1A] mb-8 text-3xl group-hover:scale-150 transition-transform" data-icon="grid_view">
            grid_view
          </span>
          <h3 className="font-label text-xs tracking-[0.15rem] uppercase mb-8 font-black text-[#31332C]">Environment</h3>
          <p className="font-body text-sm leading-relaxed text-[#5E6058] mb-12 opacity-90 transition-opacity group-hover:opacity-100">
              The Lyrata loathes drafts and sudden temperature shifts. Place in a stable, humid corner away from vents or doorways. It is a creature of habit.
          </p>
          <ul className="space-y-4 font-body text-xs text-[#31332C] font-bold">
            <li className="flex items-center gap-3 active:text-[#785A1A] transition-colors">
               <span className="material-symbols-outlined scale-[0.6] bg-[#31332c] text-white rounded-full p-2 border border-[#31332c]" data-icon="check">check</span> 
               Humidity: 60%+
            </li>
            <li className="flex items-center gap-3 active:text-[#785A1A] transition-colors">
               <span className="material-symbols-outlined scale-[0.6] bg-[#31332c] text-white rounded-full p-2 border border-[#31332c]" data-icon="check">check</span> 
               Temp: 65°F - 85°F
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default CareSection;
