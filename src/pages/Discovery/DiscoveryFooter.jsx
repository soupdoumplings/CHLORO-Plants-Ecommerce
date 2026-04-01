import React from 'react';

const footerColumns = [
  {
    title: 'Shop',
    links: ['Collections', 'Rare Finds', 'Gift Guide'],
  },
  {
    title: 'Info',
    links: ['Privacy Policy', 'Terms of Service', 'Shipping & Returns', 'Sustainability', 'Contact'],
  },
  {
    title: 'Social',
    links: [],
  },
];

const DiscoveryFooter = () => {
  return (
    <footer className="w-full bg-[#F3F1EA] border-t border-[#B0B0A8]/15 pt-20 pb-14 px-10 lg:px-14">
      <div className="max-w-[1440px] mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20 mb-20">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <h3 className="font-headline text-[22px] text-[#1A1A1A] tracking-tight">
              Petals & Pots
            </h3>
            <p className="font-body text-[13px] text-[#4A4A4A]/70 leading-relaxed max-w-[240px]">
              Curating life's botanical masterworks since 2012.
            </p>
          </div>

          {/* Shop column */}
          <div className="space-y-5">
            <h4 className="font-label text-[10px] tracking-[0.15em] uppercase font-bold text-[#1A1A1A]">
              {footerColumns[0].title}
            </h4>
            <ul className="space-y-3">
              {footerColumns[0].links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-label text-[11px] tracking-[0.04em] uppercase text-[#4A4A4A]/70 hover:text-[#C5A059] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info column */}
          <div className="space-y-5">
            <h4 className="font-label text-[10px] tracking-[0.15em] uppercase font-bold text-[#1A1A1A]">
              {footerColumns[1].title}
            </h4>
            <ul className="space-y-3">
              {footerColumns[1].links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-label text-[11px] tracking-[0.04em] uppercase text-[#4A4A4A]/70 hover:text-[#C5A059] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social column */}
          <div className="space-y-5">
            <h4 className="font-label text-[10px] tracking-[0.15em] uppercase font-bold text-[#1A1A1A]">
              Social
            </h4>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-2 font-label text-[11px] tracking-[0.04em] uppercase text-[#4A4A4A]/70 hover:text-[#C5A059] transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                Petals & Pots Official
              </a>
              <a
                href="#"
                className="flex items-center gap-2 font-label text-[11px] tracking-[0.04em] uppercase text-[#4A4A4A]/70 hover:text-[#C5A059] transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                @petalsandpots
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#B0B0A8]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-label text-[9px] tracking-[0.12em] uppercase text-[#4A4A4A]/40 font-medium">
            © 2024 Petals & Pots. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a
              href="#"
              className="font-label text-[9px] tracking-[0.12em] uppercase text-[#4A4A4A]/40 hover:text-[#1A1A1A] transition-colors font-medium"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-label text-[9px] tracking-[0.12em] uppercase text-[#4A4A4A]/40 hover:text-[#1A1A1A] transition-colors font-medium"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DiscoveryFooter;
