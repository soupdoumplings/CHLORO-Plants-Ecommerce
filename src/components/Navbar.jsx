import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 h-[82px] bg-[#FBF9F4] border-b border-[#31332c]/10 z-50 flex items-center justify-between px-12 transition-all duration-500">
      <div className="flex items-center gap-12">
        {/* Branding */}
        <Link to="/" className="font-headline text-2xl text-[#31332C] hover:opacity-70 transition-opacity">
          CHLORO
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 font-headline text-[13px] tracking-tight uppercase">
          <Link 
            to="/" 
            className={`transition-all duration-300 ${location.pathname === '/' ? 'text-[#31332c] border-b border-[#31332c]' : 'text-[#31332c]/70 hover:text-[#31332c]'}`}
          >
            Shop
          </Link>
          <a href="#" className="text-[#31332c]/70 hover:text-[#31332c]">The Journal</a>
          <a href="#" className="text-[#31332c]/70 hover:text-[#31332c]">Care Guides</a>
          <Link 
            to="/archive" 
            className={`transition-all duration-300 ${location.pathname === '/archive' ? 'text-[#785a1a] border-b border-[#785a1a]' : 'text-[#785a1a]/70 hover:text-[#785a1a]'}`}
          >
            Archive
          </Link>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center border border-[#797c73]/40 px-3 py-1 bg-transparent group focus-within:border-[#785a1a] transition-all">
           <input 
             type="text" 
             placeholder="Search Catalogue..." 
             className="bg-transparent border-none outline-none font-label text-[10px] tracking-widest uppercase w-40 placeholder:text-[#5E6058]/50 text-[#31332c]"
           />
           <span className="material-symbols-outlined text-sm text-[#31332c]/60 group-hover:text-[#31332c] transition-colors cursor-pointer">search</span>
        </div>
        
        <div className="flex items-center gap-4">
           <Link to="/catalogue" className="material-symbols-outlined text-[#31332c] hover:text-[#785a1a] transition-colors">
              person
           </Link>
           <Link to="/cart" className="material-symbols-outlined text-[#31332c] hover:text-[#785a1a] transition-colors relative">
              shopping_bag
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#785a1a] rounded-full"></span>
           </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
