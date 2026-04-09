import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FicusHero from './FicusHero';
import CareSection from './CareSection';
import HeritageSection from './HeritageSection';
import AnatomySection from './AnatomySection';

const CataloguePage = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center overflow-x-hidden w-full relative">
      <Navbar />
      
      <main className="w-full max-w-[1920px] mx-auto flex-grow mt-[81px] px-6 md:px-12 pt-12">
        <FicusHero />
        <CareSection />
        <HeritageSection />
        <AnatomySection />
      </main>

      <Footer />
    </div>
  );
};

export default CataloguePage;
