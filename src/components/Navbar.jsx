import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // We use dark teal for home page or globally if preferred, but let's apply it conditionally based on user's 'in home page' request.
  // Actually, let's just make it globally so it matches the requested header/footer color consistently.
  const bg = isHome ? "bg-[#0F3A3A]" : "bg-[#0F3A3A]";
  const text = "text-[#FBF9F4]";
  const textDim = "text-[#FBF9F4]/70";
  const border = "border-[#FBF9F4]/20";
  const accentText = "text-[#c6e9e9]"; // lighter teal for active state
  const accentBorder = "border-[#c6e9e9]";

  return (
    <nav className={`fixed top-0 left-0 right-0 h-[82px] ${bg} ${border} border-b z-50 flex items-center justify-between px-12 transition-all duration-500`}>
      <div className="flex items-center gap-12">
        {/* Branding */}
        <Link to="/" className={`font-headline text-2xl ${text} hover:opacity-70 transition-opacity`}>
          CHLORO
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 font-headline text-[13px] tracking-tight uppercase">
          <Link 
            to="/" 
            className={`transition-all duration-300 ${location.pathname === '/' ? `${text} border-b ${border}` : `${textDim} hover:${text}`}`}
          >
            Shop
          </Link>
          <Link to="/login" className={`${textDim} hover:${text}`}>Login</Link>
          <a href="#" className={`${textDim} hover:${text}`}>Care Guides</a>
          <Link 
            to="/archive" 
            className={`transition-all duration-300 ${location.pathname === '/archive' ? `text-white border-b border-white` : `${textDim} hover:text-white`}`}
          >
            Archive
          </Link>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        <div className={`hidden lg:flex items-center border ${border} px-3 py-1 bg-transparent group focus-within:border-[#FBF9F4] transition-all`}>
           <input 
             type="text" 
             placeholder="Search Catalogue..." 
             className={`bg-transparent border-none outline-none font-label text-[10px] tracking-widest uppercase w-40 placeholder:${textDim} ${text}`}
           />
           <span className={`material-symbols-outlined text-sm ${textDim} group-hover:${text} transition-colors cursor-pointer`}>search</span>
        </div>
        
        <div className="flex items-center gap-4">
           <Link to="/catalogue" className={`material-symbols-outlined ${text} hover:${accentText} transition-colors`}>
              person
           </Link>
           <button className={`material-symbols-outlined ${text} hover:${accentText} transition-colors relative`}>
              shopping_bag
              <span className={`absolute -top-1 -right-1 w-2 h-2 bg-[#c6e9e9] rounded-full`}></span>
           </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
