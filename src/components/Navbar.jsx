import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isHome = location.pathname === '/';

  // Consistently apply dark theme
  const bg = "bg-[#0F3A3A]";
  const text = "text-[#FBF9F4]";
  const textDim = "text-[#FBF9F4]/70";
  const border = "border-[#FBF9F4]/20";
  const accentText = "text-[#c6e9e9]";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 h-[82px] ${bg} border-b ${border} z-50 flex items-center justify-between px-12 transition-all duration-500`}
    >
      <div className="flex items-center gap-12">
        {/* Branding */}
        <Link to="/journal" className={`font-headline text-2xl ${text} hover:opacity-70 transition-opacity`}>
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
          <Link to="/journal" className={`${location.pathname === '/journal' ? text : textDim} hover:${text} transition-colors`}>The Journal</Link>
          <a href="#" className={`${textDim} hover:${text} transition-colors`}>Care Guides</a>
          {isAdmin && (
            <Link
              to="/archive"
              className={`transition-all duration-300 ${location.pathname === '/archive' ? `${text} border-b ${border}` : `${textDim} hover:${text}`}`}
            >
              ADMIN
            </Link>
          )}
        </div>
      </div>

      {/* AI Diagnosis Center */}
      <Link to="/ai-diagnosis" className="absolute left-1/2 -translate-x-1/2 hidden xl:flex items-center gap-3 cursor-pointer group">
        <motion.div
          whileHover={{ scale: 1.05, backgroundColor: '#FBF9F4' }}
          className={`w-10 h-10 border ${border} flex items-center justify-center transition-all duration-500 rounded-sm bg-transparent group-hover:bg-[#FBF9F4]`}
        >
          <span className={`material-symbols-outlined ${text} group-hover:text-[#0F3A3A] transition-colors text-[18px]`}>
            psychiatry
          </span>
        </motion.div>
        <div className="flex flex-col justify-center">
          <span className={`font-label text-[8px] uppercase tracking-[0.2em] ${textDim} font-bold leading-none mb-1`}>AI Powered</span>
          <span className={`font-headline italic text-[15px] ${text} leading-none`}>AI Diagnosis</span>
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
          <Link to="/dashboard" className={`material-symbols-outlined ${text} hover:${accentText} transition-colors`}>
            person
          </Link>
          <Link to="/cart" className={`material-symbols-outlined ${text} hover:${accentText} transition-colors relative`}>
            shopping_bag
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 500 }}
              className={`absolute -top-1 -right-1 w-2 h-2 ${accentText} rounded-full`}
            />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
