import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Navbar = () => {
  const location = useLocation();
<<<<<<< HEAD
  const { isAdmin } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 h-[82px] bg-[#FBF9F4] border-b border-[#31332c]/10 z-50 flex items-center justify-between px-12 transition-all duration-500"
    >
=======
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
>>>>>>> origin/UI-refinement
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
<<<<<<< HEAD
          <a href="#" className="text-[#31332c]/70 hover:text-[#31332c] transition-colors">The Journal</a>
          <a href="#" className="text-[#31332c]/70 hover:text-[#31332c] transition-colors">Care Guides</a>
          {isAdmin && (
            <Link 
              to="/archive" 
              className={`transition-all duration-300 ${location.pathname === '/archive' ? 'text-[#785a1a] border-b border-[#785a1a]' : 'text-[#785a1a]/70 hover:text-[#785a1a]'}`}
            >
              ADMIN
            </Link>
          )}
=======
          <Link to="/login" className={`${textDim} hover:${text}`}>Login</Link>
          <a href="#" className={`${textDim} hover:${text}`}>Care Guides</a>
          <Link 
            to="/archive" 
            className={`transition-all duration-300 ${location.pathname === '/archive' ? `text-white border-b border-white` : `${textDim} hover:text-white`}`}
          >
            Archive
          </Link>
>>>>>>> origin/UI-refinement
        </div>
      </div>

      {/* AI Diagnosis Center */}
      <Link to="/ai-diagnosis" className="absolute left-1/2 -translate-x-1/2 hidden xl:flex items-center gap-3 cursor-pointer group">
        <motion.div 
          whileHover={{ scale: 1.05, backgroundColor: '#31332C' }}
          className="w-10 h-10 border border-[#31332c]/20 flex items-center justify-center transition-all duration-500 rounded-sm bg-transparent group-hover:bg-[#31332C]"
        >
          <span className="material-symbols-outlined text-[#31332c] group-hover:text-[#FBF9F4] transition-colors text-[18px]">
            camera
          </span>
        </motion.div>
        <div className="flex flex-col justify-center">
          <span className="font-label text-[8px] uppercase tracking-[0.2em] text-[#31332c]/50 font-bold leading-none mb-1">AI Powered</span>
          <span className="font-headline italic text-[15px] text-[#31332c] leading-none">AI Diagnosis</span>
        </div>
      </Link>

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
<<<<<<< HEAD
           <Link to="/dashboard" className="material-symbols-outlined text-[#31332c] hover:text-[#785a1a] transition-colors">
              person
           </Link>
           <Link to="/cart" className="material-symbols-outlined text-[#31332c] hover:text-[#785a1a] transition-colors relative">
              shopping_bag
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 500 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-[#785a1a] rounded-full"
              />
           </Link>
=======
           <Link to="/catalogue" className={`material-symbols-outlined ${text} hover:${accentText} transition-colors`}>
              person
           </Link>
           <button className={`material-symbols-outlined ${text} hover:${accentText} transition-colors relative`}>
              shopping_bag
              <span className={`absolute -top-1 -right-1 w-2 h-2 bg-[#c6e9e9] rounded-full`}></span>
           </button>
>>>>>>> origin/UI-refinement
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
