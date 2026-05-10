import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const isHome = location.pathname === '/';
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close search and mobile menu on route change
  useEffect(() => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Escape key closes search
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Consistently apply dark theme
  const bg = "bg-[#0F3A3A]";
  const text = "text-[#FBF9F4]";
  const textDim = "text-[#FBF9F4]/70";
  const border = "border-[#FBF9F4]/20";
  const accentText = "text-[#c6e9e9]";
  const hoverAccent = "hover:text-[#F58700]";

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 h-[82px] ${bg} border-b ${border} z-40 flex items-center justify-between px-4 md:px-12 transition-all duration-500 cursor-auto`}
      >
        <div className="flex items-center gap-12">
          {/* Branding */}
          <Link to={isAdmin ? "/archive" : "/"} className={`font-headline text-2xl ${text} hover:opacity-70 transition-opacity`}>
            CHLORO
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 font-headline text-[13px] tracking-tight uppercase">
            {!isAdmin && (
              <>
                <Link
                  to="/"
                  className={`transition-all duration-300 ${location.pathname === '/' ? `${text} border-b ${border}` : `${textDim} hover:text-[#628141]`}`}
                >
                  Home
                </Link>
                <Link
                  to="/discovery"
                  className={`transition-all duration-300 ${location.pathname === '/discovery' ? `${text} border-b ${border}` : `${textDim} hover:text-[#628141]`}`}
                >
                  Shop
                </Link>
                {user && (
                  <Link to="/journal" className={`${location.pathname === '/journal' ? text : textDim} hover:text-[#628141] transition-colors`}>The Journal</Link>
                )}
              </>
            )}
            {isAdmin && (
              <Link
                to="/archive"
                className={`transition-all duration-300 ${location.pathname === '/archive' ? `${text} border-b ${border}` : `${textDim} ${hoverAccent}`}`}
              >
                ADMIN
              </Link>
            )}
          </div>
        </div>

        {/* AI Diagnosis Center */}
        {!isAdmin && (
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
        )}

        {/* Utilities */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Hamburger Icon for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`md:hidden material-symbols-outlined ${text} flex items-center justify-center min-h-[44px] min-w-[44px]`}
            aria-label="Open Menu"
          >
            menu
          </button>

          {!isAdmin && (
            <motion.button
              onClick={() => setSearchOpen(true)}
              whileHover={{ borderColor: 'rgba(251,249,244,0.6)' }}
              className={`hidden lg:flex items-center gap-2 border ${border} px-3 py-1.5 bg-transparent transition-all group`}
              title="Search catalogue"
            >
              <span className={`font-label text-[10px] tracking-widest uppercase ${textDim} group-hover:${text} transition-colors whitespace-nowrap`}>
                Search Catalogue...
              </span>
              <span className={`material-symbols-outlined text-sm ${textDim} group-hover:text-[#628141] transition-colors`}>search</span>
            </motion.button>
          )}

          <div className="flex items-center gap-4">
            {!isAdmin && (
              <Link to="/cart" className={`material-symbols-outlined ${text} hover:text-[#628141] transition-colors relative flex items-center justify-center`} title="Cart">
                shopping_bag
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      className={`absolute -top-1.5 -right-2 w-[18px] h-[18px] bg-[#C5A059] text-[#FBF9F4] rounded-full font-body text-[11px] font-extrabold flex items-center justify-center shadow-md border-[1.5px] border-[#0F3A3A]`}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}
            {!user ? (
              <Link to="/login" className={`font-headline text-[13px] tracking-tight uppercase ${textDim} hover:text-[#628141] transition-colors ml-2`}>
                LOGIN
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className={`material-symbols-outlined ${text} hover:text-[#628141] transition-colors ml-2`} title="Dashboard">
                  person
                </Link>
                <button
                  onClick={handleLogout}
                  className={`material-symbols-outlined ${text} hover:text-[#628141] transition-colors`}
                  title="Logout"
                >
                  logout
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Search Overlay — rendered outside nav so it covers full screen */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#0e0e0c]/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-[300px] h-full bg-[#0F3A3A] shadow-2xl flex flex-col pt-20 px-8"
            >
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-6 right-6 material-symbols-outlined text-[#FBF9F4] flex items-center justify-center min-h-[44px] min-w-[44px]"
              >
                close
              </button>

              <div className="flex flex-col gap-8 font-headline text-[18px] tracking-tight uppercase">
                {!isAdmin && (
                  <>
                    <Link to="/" className={`${text} hover:text-[#628141] transition-colors border-b border-[#FBF9F4]/10 pb-4 min-h-[44px] flex items-center`}>Home</Link>
                    <Link to="/discovery" className={`${text} hover:text-[#628141] transition-colors border-b border-[#FBF9F4]/10 pb-4 min-h-[44px] flex items-center`}>Shop</Link>
                    <Link to="/ai-diagnosis" className={`${text} hover:text-[#628141] transition-colors border-b border-[#FBF9F4]/10 pb-4 min-h-[44px] flex items-center`}>AI Diagnosis</Link>
                    {user && (
                      <Link to="/journal" className={`${text} hover:text-[#628141] transition-colors border-b border-[#FBF9F4]/10 pb-4 min-h-[44px] flex items-center`}>The Journal</Link>
                    )}
                  </>
                )}
                {isAdmin && (
                  <Link to="/archive" className={`${text} hover:text-[#F58700] transition-colors border-b border-[#FBF9F4]/10 pb-4 min-h-[44px] flex items-center`}>Admin Archive</Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
