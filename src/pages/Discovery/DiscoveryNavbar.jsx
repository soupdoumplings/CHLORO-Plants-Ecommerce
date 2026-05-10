import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DiscoveryNavbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  const navLinks = [
    { label: 'Collections', href: '#collections' },
    { label: 'Care Guides', href: '#care-guides' },
    { label: 'Journal', href: '#journal' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] bg-[#FBF9F4] border-b border-[#31332C]/8 z-50 flex items-center justify-between px-10 lg:px-14">
      {/* Left: Brand + Nav Links */}
      <div className="flex items-center gap-10">
        <Link
          to="/"
          className="font-headline text-[22px] text-[#31332C] tracking-tight hover:opacity-70 transition-opacity"
        >
          Petals & Pots
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-label text-[11px] tracking-[0.06em] uppercase text-[#5E6058] hover:text-[#31332C] transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Center: AI Diagnosis CTA */}
      <div className="hidden lg:flex items-center gap-2.5 cursor-pointer group">
        <div className="w-8 h-8 rounded-full bg-[#31332C] flex items-center justify-center group-hover:bg-[#785A1A] transition-colors duration-300">
          <span className="material-symbols-outlined text-white text-[16px]">
            eco
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label text-[9px] tracking-[0.12em] uppercase text-[#5E6058]/60 font-medium">
            AI Powered
          </span>
          <span className="font-headline text-[14px] text-[#31332C] italic leading-tight">
            AI Diagnosis
          </span>
        </div>
      </div>

      {/* Right: Search + Icons */}
      <div className="flex items-center gap-5">
        <div
          className={`hidden lg:flex items-center border px-3 py-1.5 transition-all duration-300 ${
            searchFocused
              ? 'border-[#785A1A]/50 bg-white'
              : 'border-[#31332C]/12 bg-transparent'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#5E6058]/50 mr-2">
            search
          </span>
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent border-none outline-none font-label text-[10px] tracking-[0.08em] uppercase w-32 placeholder:text-[#5E6058]/40 text-[#31332C]"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <div className="flex items-center gap-3.5">
          <button className="material-symbols-outlined text-[22px] text-[#31332C]/70 hover:text-[#31332C] transition-colors">
            shopping_bag
          </button>
          <button className="material-symbols-outlined text-[22px] text-[#31332C]/70 hover:text-[#31332C] transition-colors">
            person
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DiscoveryNavbar;
