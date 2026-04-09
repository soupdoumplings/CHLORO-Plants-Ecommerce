import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Hero from './Hero';
import Philosophy from './Philosophy';
import ArchivePreview from './ArchivePreview';
import VisualBreak from './VisualBreak';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center overflow-x-hidden w-full relative">
      <Navbar />
      
      <main className="w-full flex-grow">
        <Hero />
        <ArchivePreview />
        <Philosophy />
        <VisualBreak />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
