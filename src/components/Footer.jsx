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
  { label: 'Admin Access', to: '/archive' },
];

const FooterNavLink = ({ to, children }) => (
  <Link
    to={to}
    className="block font-headline text-[19px] md:text-[21px] leading-tight text-[#FBF9F4]/82 hover:text-[#FBF9F4] transition-colors"
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
      className="w-full bg-[#0F3A3A] text-[#FBF9F4] page-gutter pt-14 md:pt-16 pb-7 border-t border-[#FBF9F4]/10 cursor-auto"
    >
      <div className="page-shell flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="font-label text-[9px] uppercase tracking-[0.26em] text-[#C6E9E9]/75 font-bold mb-5">
              Botanical Ecommerce Studio
            </p>
            <h2 className="font-headline italic text-[58px] sm:text-[78px] lg:text-[96px] leading-[0.86] tracking-tight">
              CHLORO
            </h2>
            <p className="font-body text-[14px] md:text-[15px] leading-relaxed text-[#FBF9F4]/72 max-w-[460px] mt-6">
              Shop living specimens, tools, vessels, and care support from our Kathmandu botanical studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <Link
                to="/discovery"
                className="bg-[#FBF9F4] text-[#0F3A3A] px-6 py-3.5 font-label text-[9px] uppercase tracking-[0.18em] font-bold text-center hover:bg-[#C6E9E9] transition-colors"
              >
                Shop Collection
              </Link>
              <a
                href="mailto:hello@chloro.studio"
                className="border border-[#FBF9F4]/35 text-[#FBF9F4] px-6 py-3.5 font-label text-[9px] uppercase tracking-[0.18em] font-bold text-center hover:bg-[#FBF9F4] hover:text-[#0F3A3A] transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 pt-2 lg:pt-6">
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
          <div className="bg-[#0F3A3A] p-5 md:p-6 min-h-[126px]">
            <span className="material-symbols-outlined text-[#C6E9E9] text-[21px] mb-4 block">mail</span>
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-2">
              Contact Us
            </p>
            <a href="mailto:hello@chloro.studio" className="font-headline text-[22px] leading-tight hover:text-[#C6E9E9] transition-colors">
              hello@chloro.studio
            </a>
            <p className="font-body text-[13px] leading-relaxed text-[#FBF9F4]/58 mt-3">
              Orders, care questions, availability, and consultation requests.
            </p>
          </div>

          <div className="bg-[#0F3A3A] p-5 md:p-6 min-h-[126px]">
            <span className="material-symbols-outlined text-[#C6E9E9] text-[21px] mb-4 block">storefront</span>
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-2">
              Please Visit Us
            </p>
            <p className="font-headline text-[22px] leading-tight">
              Lazimpat, Kathmandu
            </p>
            <p className="font-body text-[13px] leading-relaxed text-[#FBF9F4]/58 mt-3">
              Studio visits and plant consultations are available by appointment.
            </p>
          </div>

          <div className="bg-[#0F3A3A] p-5 md:p-6 min-h-[126px]">
            <span className="material-symbols-outlined text-[#C6E9E9] text-[21px] mb-4 block">schedule</span>
            <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#FBF9F4]/45 font-bold mb-2">
              Shopping Hours
            </p>
            <p className="font-headline text-[22px] leading-tight">
              Sun-Fri / 10:00-18:00
            </p>
            <p className="font-body text-[13px] leading-relaxed text-[#FBF9F4]/58 mt-3">
              Delivery and pickup coordination happens after order confirmation.
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
