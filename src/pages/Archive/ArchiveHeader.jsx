import React from 'react';

const ArchiveHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-end gap-12 w-full max-w-[1440px] mx-auto px-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Primary Context */}
      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="flex flex-col gap-0 items-start">
           <span className="font-label text-[11px] tracking-[0.2em] uppercase text-[#785A1A]">Botanical Asset Management</span>
           <h1 className="font-headline text-6xl leading-tight text-[#31332C] tracking-tight -ml-1">Active Portfolio</h1>
        </div>
        <p className="font-body text-lg leading-relaxed text-[#5E6058] opacity-90">
             Real-time monitoring of Himalayan species inventory, curation health, and global distribution logistics.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex gap-4 items-center">
        <button className="bg-[#5F5E5E] text-[#FAF7F6] px-8 py-3 font-label text-[12px] tracking-[1.2px] uppercase flex items-center gap-2 hover:bg-[#31332C] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-black/5">
           <span className="w-2 h-2 bg-[#FAF7F6] rounded-full"></span>
           Acquire Specimen
        </button>
        <button className="bg-[#E8E9E0] border border-[#797c73]/10 text-[#31332C] px-8 py-3 font-label text-[12px] tracking-[1.2px] uppercase hover:bg-[#dbddd0] transition-all transform hover:-translate-y-0.5 active:scale-95">
           Generate Report
        </button>
      </div>
    </div>
  );
};

export default ArchiveHeader;
