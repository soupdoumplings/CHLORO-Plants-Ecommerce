import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0F3A3A] pt-12 pb-6 px-12 border-t border-[#FBF9F4]/10 relative z-10 transition-colors duration-1000">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Identification */}
        <div className="col-span-1 md:col-span-2 space-y-12">
          <h2 className="font-headline text-5xl text-[#FBF9F4] tracking-tighter">CHLORO</h2>
          <p className="font-body text-base text-[#FBF9F4]/70 leading-relaxed max-w-sm">
            A high-end Himalayan specimen collection. Dedicated to the documentation and preservation of rare indoor-adapted flora from the roof of the world.
          </p>
          <div className="flex gap-6 items-center text-[#FBF9F4]/60">
            <a href="#" className="material-symbols-outlined text-xs hover:text-[#c6e9e9] transition-colors">language</a>
            <a href="#" className="font-label text-xs uppercase tracking-widest hover:text-[#c6e9e9] transition-colors">Kathmandu, NP</a>
          </div>
        </div>

        {/* Global Navigation */}
        <div className="space-y-12">
          <h4 className="font-label text-[11px] uppercase tracking-[0.2em] font-black text-[#FBF9F4]">Internal Navigation</h4>
          <ul className="space-y-3 font-label text-[11px] uppercase tracking-[0.15em] text-[#FBF9F4]/80">
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">The Journal</li>
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Care Guides</li>
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Sustainability</li>
          </ul>
        </div>

        {/* Client Support */}
        <div className="space-y-12">
          <h4 className="font-label text-[11px] uppercase tracking-[0.2em] font-black text-[#FBF9F4]">Support</h4>
          <ul className="space-y-3 font-label text-[11px] uppercase tracking-[0.15em] text-[#FBF9F4]/80">
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Shipping & Returns</li>
            <li className="hover:text-[#c6e9e9] cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>
      </div>

      {/* Editorial Legal Row */}
      <div className="max-w-[1440px] mx-auto pt-6 border-t border-[#FBF9F4]/10 flex flex-col md:flex-row justify-between items-center gap-6 font-label text-[10px] tracking-widest uppercase text-[#FBF9F4]/60 font-black">
        <p>© 2024 Chloro Himalayan Specimen Collection</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#c6e9e9] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#c6e9e9] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
