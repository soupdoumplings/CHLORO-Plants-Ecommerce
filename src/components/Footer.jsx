import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F4ED] pt-32 pb-16 px-12 border-t border-[#B1B3A9]/10 relative z-10 transition-colors duration-1000">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
        {/* Brand Identification */}
        <div className="col-span-1 md:col-span-2 space-y-12">
          <h2 className="font-headline text-5xl text-[#31332C] tracking-tighter">CHLORO</h2>
          <p className="font-body text-base text-[#5E6058] opacity-70 leading-relaxed max-w-sm">
             A high-end Himalayan specimen collection. Dedicated to the documentation and preservation of rare indoor-adapted flora from the roof of the world.
          </p>
          <div className="flex gap-10 items-center opacity-60">
             <a href="#" className="material-symbols-outlined text-sm hover:opacity-100 transition-opacity">language</a>
             <a href="#" className="font-label text-xs uppercase tracking-widest hover:opacity-100 transition-opacity">Kathmandu, NP</a>
          </div>
        </div>

        {/* Global Navigation */}
        <div className="space-y-12">
          <h4 className="font-label text-[11px] uppercase tracking-[0.2em] font-black text-[#31332C]">Internal Navigation</h4>
          <ul className="space-y-6 font-label text-[11px] uppercase tracking-[0.15em] text-[#5E6058] opacity-80">
            <li className="hover:text-[#785A1A] cursor-pointer transition-colors">The Journal</li>
            <li className="hover:text-[#785A1A] cursor-pointer transition-colors">Care Guides</li>
            <li className="hover:text-[#785A1A] cursor-pointer transition-colors">Sustainability</li>
          </ul>
        </div>

        {/* Client Support */}
        <div className="space-y-12">
           <h4 className="font-label text-[11px] uppercase tracking-[0.2em] font-black text-[#31332C]">Support</h4>
           <ul className="space-y-6 font-label text-[11px] uppercase tracking-[0.15em] text-[#5E6058] opacity-80">
            <li className="hover:text-[#785A1A] cursor-pointer transition-colors">Shipping & Returns</li>
            <li className="hover:text-[#785A1A] cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>
      </div>

      {/* Editorial Legal Row */}
      <div className="max-w-[1440px] mx-auto pt-12 border-t border-[#B1B3A9]/10 flex flex-col md:flex-row justify-between items-center gap-12 font-label text-[10px] tracking-widest uppercase text-[#5E6058]/60 font-black">
        <p>© 2024 Chloro Himalayan Specimen Collection</p>
        <div className="flex gap-12">
           <a href="#" className="hover:text-[#31332C] transition-colors">Privacy Policy</a>
           <a href="#" className="hover:text-[#31332C] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
