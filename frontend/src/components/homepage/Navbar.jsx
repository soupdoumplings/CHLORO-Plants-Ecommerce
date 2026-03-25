import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const navItems = [
    { label: 'Shop All', href: '/plants' },
    { label: 'Plant Care', href: '/learn' },
    { label: 'Find Your Flat', href: '/gifts' },
    { label: 'Contact', href: '/corporate-gifts' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F1ED]/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-3xl tracking-tight text-[#2D5A3D]" style={{ fontFamily: '"Ingrid Darling", cursive' }}>
          Petals and Pots
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <Link key={item.label} to={item.href} className="text-sm font-medium tracking-wide hover:text-[#2D7A4E] transition-colors text-gray-700">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-700 hover:text-[#2D5A3D]"><Search className="w-5 h-5" /></button>
          <button className="text-gray-700 hover:text-[#2D5A3D]"><User className="w-5 h-5" /></button>
          <button className="text-gray-700 hover:text-[#2D5A3D] relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-[#2D5A3D] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
          <button className="lg:hidden text-gray-700"><Menu className="w-6 h-6" /></button>
        </div>
      </div>
    </nav>
  );
}
