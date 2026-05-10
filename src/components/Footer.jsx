import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const shopLinks = [
  { label: 'Shop Collection', to: '/discovery' },
  { label: 'Products & Gifts', to: '/products-gifts' },
  { label: 'Plant Catalogue', to: '/catalogue' },
  { label: 'Plant Care', to: '/journal' },
  { label: 'AI Diagnosis', to: '/ai-diagnosis' },
];

const accountLinks = [
  { label: 'My Bag', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Sign In', to: '/login' },
];

const supportLinks = [
  { label: 'Order Help', to: '/dashboard' },
  { label: 'Care Reminders', to: '/my-plants' },
];

const FooterNavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block font-headline text-[17px] md:text-[18px] leading-tight text-[#FBF9F4]/65 hover:text-[#FBF9F4] transition-colors"
  >
    {children}
  </Link>
);

const Footer = () => {
  return (
    <Motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-[#0F3A3A] text-[#FBF9F4] page-gutter pt-8 md:pt-10 pb-6 border-t border-[#FBF9F4]/10 cursor-auto"
    >
      <div className="page-shell flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-label text-[8px] uppercase tracking-[0.26em] text-[#C6E9E9]/75 font-bold mb-3">
              Botanical Ecommerce Studio
            </p>
            <h2 className="font-headline italic text-[38px] sm:text-[48px] lg:text-[56px] leading-[0.86] tracking-tight">
              CHLORO
            </h2>
            <p className="font-body text-[13px] md:text-[14px] leading-relaxed text-[#FBF9F4]/72 max-w-[400px] mt-4">
              Shop living specimens, tools, vessels, and care support from our Kathmandu botanical studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-5">
              <Link
                to="/discovery"
                className="bg-[#FBF9F4] text-[#0F3A3A] px-5 py-2.5 font-label text-[8px] uppercase tracking-[0.18em] font-bold text-center hover:bg-[#C6E9E9] transition-colors"
              >
                Shop Collection
              </Link>
              <a
                href="mailto:hello@chloro.studio"
                className="border border-[#FBF9F4]/35 text-[#FBF9F4] px-5 py-2.5 font-label text-[8px] uppercase tracking-[0.18em] font-bold text-center hover:bg-[#FBF9F4] hover:text-[#0F3A3A] transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 pt-2 lg:pt-4">
            <div>
              <h3 className="font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-4">
                Shop
              </h3>
              <nav className="space-y-3">
                {shopLinks.map((item) => (
                  <FooterNavLink key={item.to} to={item.to}>{item.label}</FooterNavLink>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-4">
                Account
              </h3>
              <nav className="space-y-3">
                {accountLinks.map((item) => (
                  <FooterNavLink key={item.to} to={item.to}>{item.label}</FooterNavLink>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-4">
                Support
              </h3>
              <nav className="space-y-3">
                {supportLinks.map((item) => (
                  <FooterNavLink key={item.to} to={item.to}>{item.label}</FooterNavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#FBF9F4]/12 border border-[#FBF9F4]/12">
          <div className="bg-[#0F3A3A] p-4 md:p-5 min-h-[90px]">
            <span className="material-symbols-outlined text-[#C6E9E9] text-[18px] mb-2.5 block">mail</span>
            <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-1">
              Contact Us
            </p>
            <a href="mailto:hello@chloro.studio" className="font-headline text-[16px] leading-tight hover:text-[#C6E9E9] transition-colors">
              hello@chloro.studio
            </a>
            <p className="font-body text-[11px] leading-relaxed text-[#FBF9F4]/58 mt-1.5">
              Orders, care questions, and availability.
            </p>
          </div>

          <div className="bg-[#0F3A3A] p-4 md:p-5 min-h-[90px]">
            <span className="material-symbols-outlined text-[#C6E9E9] text-[18px] mb-2.5 block">storefront</span>
            <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-1">
              Please Visit Us
            </p>
            <p className="font-headline text-[16px] leading-tight">
              Lazimpat, Kathmandu
            </p>
            <p className="font-body text-[11px] leading-relaxed text-[#FBF9F4]/58 mt-1.5">
              Studio visits are available by appointment.
            </p>
          </div>

          <div className="bg-[#0F3A3A] p-4 md:p-5 min-h-[90px]">
            <span className="material-symbols-outlined text-[#C6E9E9] text-[18px] mb-2.5 block">schedule</span>
            <p className="font-label text-[8px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-1">
              Shopping Hours
            </p>
            <p className="font-headline text-[16px] leading-tight">
              Sun-Fri / 10:00-18:00
            </p>
            <p className="font-body text-[11px] leading-relaxed text-[#FBF9F4]/58 mt-1.5">
              Delivery happens after order confirmation.
            </p>
          </div>
        </div>

        <div className="border-t border-[#FBF9F4]/12 pt-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/42">
            (c) {new Date().getFullYear()} CHLORO. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/45">
            <Link to="/discovery" className="hover:text-[#FBF9F4] transition-colors">Kathmandu, NP</Link>
            <a href="tel:+9779800000000" className="hover:text-[#FBF9F4] transition-colors">+977 980-0000000</a>
          </div>
        </div>
      </div>
    </Motion.footer>
  );
};

export default Footer;
