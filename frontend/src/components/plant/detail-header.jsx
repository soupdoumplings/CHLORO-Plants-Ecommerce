import { Search, User, ShoppingCart, ChevronDown, ArrowLeft } from "lucide-react";
import { useState } from "react";

export function DetailHeader({ onBack, onNavigate }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const navItems = [
    {
      label: 'PLANTS',
      items: ['All Plants', 'Low Light', 'Pet-Friendly', 'Easy Care', 'Hanging Plants']
    },
    {
      label: 'CARE TOOLS',
      items: ['Watering', 'Fertilizer', 'Pots & Planters', 'Soil & Amendments']
    },
    {
      label: 'GUIDES',
      items: null
    },
    {
      label: 'ABOUT US',
      items: null
    }
  ];

  return (
    <>
      {/* Main Header — matches homepage exactly */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full mx-auto px-6 md:px-12 xl:px-20 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[#2D7A4E] hover:text-[#2D5A3D] transition-colors group"
                aria-label="Go back to home"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('home'); else onBack(); }} className="flex flex-col items-center hover:opacity-80 transition-opacity">
                <h1 className="text-4xl tracking-tight text-[#2D7A4E]" style={{ fontFamily: '"Ingrid Darling", cursive', fontWeight: 300 }}>Petals and Pots</h1>
              </button>
            </div>

            {/* Navigation — same as homepage */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.items && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 text-sm hover:text-gray-600 transition-colors"
                    onClick={(e) => {
                      if (item.label === 'ABOUT US') {
                        e.preventDefault();
                        if (onNavigate) onNavigate('about');
                      } else if (!item.items) {
                        onBack();
                      }
                    }}
                  >
                    {item.label}
                    {item.items && <ChevronDown className="w-4 h-4" />}
                  </button>

                  {/* Dropdown */}
                  {item.items && openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md py-2 z-50">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem}
                          href="#"
                          className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons — same as homepage */}
            <div className="flex items-center gap-4">
              <button className="hover:text-gray-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="hover:text-gray-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="hover:text-gray-600 transition-colors relative">
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
