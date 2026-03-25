import { Search, User, ShoppingCart } from 'lucide-react';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export function Header() {
  const location = useLocation();

  const navItems = [
    { label: 'PLANTS', href: '/plants' },
    { label: 'CARE TOOLS', href: '/care-tools' },
    { label: 'GIFTS', href: '/gifts' },
    { label: 'LEARN', href: '/learn' },
    { label: 'CORPORATE GIFTS', href: '/corporate-gifts' }
  ];

  return (
    <>
      <header className="bg-[#DDF6D2]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="no-underline">
                <h1 className="text-4xl tracking-tight text-[#2D5A3D]" style={{ fontFamily: '"Ingrid Darling", cursive', fontWeight: 300 }}>Petals and Pots</h1>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm font-medium hover:text-[#2D7A4E] transition-colors ${
                    location.pathname === item.href ? 'text-[#2D5A3D]/50 underline underline-offset-4' : 'text-[#2D5A3D] no-underline'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 text-[#2D5A3D]">
              <button className="hover:text-[#2D7A4E] transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="hover:text-[#2D7A4E] transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="hover:text-[#2D7A4E] transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
