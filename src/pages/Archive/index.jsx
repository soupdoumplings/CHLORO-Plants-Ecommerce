import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ArchiveHeader from './ArchiveHeader';
import MetricsGrid from './MetricsGrid';
import InventoryTable from './InventoryTable';
import SystemLog from './SystemLog';

const ArchivePage = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative">
      <Navbar />
      
      <main className="w-full max-w-[1920px] mx-auto flex-grow mt-[82px] px-6 md:px-12 pt-16">
        <ArchiveHeader />
        <MetricsGrid />
        <InventoryTable />
        <SystemLog />
      </main>

      <Footer />
      
      {/* Editorial Vertical Detail */}
      <div className="hidden lg:block absolute left-12 top-[1200px] h-[500px] w-[1px] bg-[#B1B3A9]/10 pt-16 z-0 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#31332C]/20 vertical-text-rotate origin-center mt-32">Archival Manifest v.4.2</span>
      </div>
    </div>
  );
};

export default ArchivePage;
