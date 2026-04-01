import React from 'react';
import heroImage from '../../assets/discovery-hero.png';

const DiscoveryHero = () => {
  return (
    <section className="w-full pt-[82px]">
      <div className="max-w-[1440px] mx-auto px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[75vh] items-center">
          {/* Left — Editorial Copy */}
          <div className="flex flex-col justify-center py-20 lg:py-32 lg:pr-16">
            <p className="font-label text-[10px] tracking-[0.2em] uppercase text-[#2F4F4F] font-semibold mb-6">
              Summer Collection / Vol. 04
            </p>

            <h1 className="font-headline text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-tight text-[#1A1A1A] mb-8">
              Living{' '}
              <br />
              <span className="italic font-light">Sculpture</span>
            </h1>

            <p className="font-body text-[15px] text-[#4A4A4A] leading-[1.75] max-w-[380px]">
              A meticulous collection of rare botanical specimens
              and artisan-crafted vessels, designed to transform
              domestic spaces into living galleries.
            </p>
          </div>

          {/* Right — Editorial Image */}
          <div className="relative h-full min-h-[400px] lg:min-h-[600px] overflow-hidden">
            <img
              src={heroImage}
              alt="Summer collection — Living Sculpture"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryHero;
