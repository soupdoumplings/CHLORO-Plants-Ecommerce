import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useCart } from '../lib/CartContext';
import SearchOverlay from './SearchOverlay';
import { useNotifications } from '../lib/NotificationContext';

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const getIcon = (type) => {
  switch (type) {
    case 'PLANT_TIP': return 'local_florist';
    case 'DIAGNOSIS': return 'psychiatry';
    case 'SALE': return 'sell';
    case 'SYSTEM':
    default: return 'notifications';
  }
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications() || { notifications: [], unreadCount: 0 };
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close search on route change
  useEffect(() => {
    const closeRouteUi = window.setTimeout(() => {
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }, 0);
    return () => window.clearTimeout(closeRouteUi);
  }, [location.pathname]);

  // Escape key closes search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Consistently apply dark theme
  const bg = "bg-[#0F3A3A]";
  const text = "text-[#FBF9F4]";
  const textDim = "text-[#FBF9F4]/70";
  const border = "border-[#FBF9F4]/20";
  const accentText = "text-[#c6e9e9]";
  const hoverAccent = "hover:text-[#F58700]";
  const mobileLinks = isAdmin
    ? [{ label: 'Admin', to: '/archive', icon: 'admin_panel_settings' }]
    : [
      { label: 'Home', to: '/', icon: 'home' },
      { label: 'Shop', to: '/discovery', icon: 'local_florist' },
      { label: 'Gifts', to: '/products-gifts', icon: 'redeem' },
      { label: 'AI Diagnosis', to: '/ai-diagnosis', icon: 'psychiatry' },
      ...(user ? [{ label: 'Journal', to: '/journal', icon: 'article' }] : []),
    ];

  return (
    <>
      <Motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 h-[82px] ${bg} border-b ${border} z-50 flex items-center justify-between page-gutter-tight transition-all duration-500 cursor-auto`}
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
                <Link
                  to="/products-gifts"
                  className={`transition-all duration-300 ${location.pathname === '/products-gifts' ? `${text} border-b ${border}` : `${textDim} hover:text-[#628141]`}`}
                >
                  Gifts
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
            <Motion.div
              whileHover={{ scale: 1.05, backgroundColor: '#FBF9F4' }}
              className={`w-10 h-10 border ${border} flex items-center justify-center transition-all duration-500 rounded-sm bg-transparent group-hover:bg-[#FBF9F4]`}
            >
              <span className={`material-symbols-outlined ${text} group-hover:text-[#0F3A3A] transition-colors text-[18px]`}>
                psychiatry
              </span>
            </Motion.div>
            <div className="flex flex-col justify-center">
              <span className={`font-label text-[8px] uppercase tracking-[0.2em] ${textDim} font-bold leading-none mb-1`}>AI Powered</span>
              <span className={`font-headline italic text-[15px] ${text} leading-none`}>AI Diagnosis</span>
            </div>
          </Link>
        )}

        {/* Utilities */}
        <div className="flex items-center gap-6">
          {!isAdmin && (
            <Motion.button
              onClick={() => setSearchOpen(true)}
              whileHover={{ borderColor: 'rgba(251,249,244,0.6)' }}
              className={`hidden lg:flex items-center gap-2 border ${border} px-3 py-1.5 bg-transparent transition-all group`}
              title="Search catalogue"
            >
              <span className={`font-label text-[10px] tracking-widest uppercase ${textDim} group-hover:${text} transition-colors whitespace-nowrap`}>
                Search Catalogue...
              </span>
              <span className={`material-symbols-outlined text-sm ${textDim} group-hover:text-[#628141] transition-colors`}>search</span>
            </Motion.button>
          )}

          <div className="flex items-center gap-2 md:gap-4">
                {user && (
                  <div className="relative flex items-center justify-center" ref={notificationsRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`${text} hover:${accentText} transition-colors relative flex h-9 w-9 items-center justify-center outline-none`}
                      title="Notifications"
                    >
                      <span className="material-symbols-outlined text-[24px]">notifications</span>
                      <AnimatePresence>
                        {unreadCount > 0 && (
                          <Motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                            className={`absolute -top-1.5 -right-2 w-[18px] h-[18px] bg-[#F58700] text-[#FBF9F4] rounded-full font-body text-[11px] font-extrabold flex items-center justify-center shadow-md border-[1.5px] border-[#0F3A3A]`}
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </Motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    <AnimatePresence>
                      {showNotifications && (
                        <Motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-12 right-0 w-80 bg-[#0F3A3A] border border-[#FBF9F4]/20 shadow-2xl overflow-hidden flex flex-col z-50 cursor-auto"
                        >
                          <div className="flex items-center justify-between p-4 border-b border-[#FBF9F4]/20 bg-[#0A2E2E]">
                            <h3 className="font-headline text-[#FBF9F4] text-sm uppercase tracking-wider">Notifications</h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="font-label text-[#c6e9e9] hover:text-[#F58700] text-[10px] uppercase tracking-widest transition-colors"
                              >
                                Mark all as read
                              </button>
                            )}
                          </div>

                          <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-[#FBF9F4]/50 font-label text-xs uppercase tracking-widest">
                                No notifications yet
                              </div>
                            ) : (
                              notifications.slice(0, 10).map((notif) => (
                                <div
                                  key={notif.id}
                                  onClick={() => !notif.is_read && markAsRead(notif.id)}
                                  className={`p-4 border-b border-[#FBF9F4]/10 last:border-b-0 flex gap-3 transition-colors ${!notif.is_read ? 'bg-[#FBF9F4]/5 cursor-pointer hover:bg-[#FBF9F4]/10' : 'bg-transparent'}`}
                                >
                                  <span className="material-symbols-outlined text-[20px] text-[#c6e9e9] flex-shrink-0 mt-0.5">
                                    {getIcon(notif.type)}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm mb-1 ${!notif.is_read ? 'text-[#FBF9F4] font-medium' : 'text-[#FBF9F4]/70 font-normal'}`}>
                                      {notif.message}
                                    </p>
                                    <div className="flex items-center justify-between mt-1.5">
                                      <span className="font-label text-[9px] uppercase tracking-wider text-[#FBF9F4]/40">
                                        {timeAgo(notif.created_at)}
                                      </span>
                                      {notif.link && (
                                        <a
                                          href={notif.link}
                                          onClick={(e) => e.stopPropagation()}
                                          className="font-label text-[9px] text-[#c6e9e9] hover:text-[#F58700] uppercase tracking-wider transition-colors"
                                        >
                                          View
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                  {!notif.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-[#F58700] flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                          {notifications.length > 10 && (
                            <div className="p-3 text-center border-t border-[#FBF9F4]/20 bg-[#0A2E2E]">
                              <span className="font-label text-[10px] text-[#FBF9F4]/50 uppercase tracking-widest">
                                Showing latest 10
                              </span>
                            </div>
                          )}
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

            {!isAdmin && (
              <Link to="/cart" className={`${text} hover:text-[#628141] transition-colors relative flex h-9 w-9 items-center justify-center`} title="Cart">
                <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <Motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                      className={`absolute -top-1.5 -right-2 w-[18px] h-[18px] bg-[#C5A059] text-[#FBF9F4] rounded-full font-body text-[11px] font-extrabold flex items-center justify-center shadow-md border-[1.5px] border-[#0F3A3A]`}
                    >
                      {cartCount}
                    </Motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}

            <div className="hidden items-center gap-4 md:flex">
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

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={`md:hidden ${text} hover:text-[#C6E9E9] transition-colors flex h-9 w-9 items-center justify-center`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </Motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 right-0 top-[82px] z-40 border-b border-[#FBF9F4]/15 bg-[#0F3A3A] shadow-2xl shadow-black/20 md:hidden"
          >
            <div className="page-gutter-tight py-5">
              <div className="grid gap-2">
                {mobileLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between border border-[#FBF9F4]/12 px-4 py-4 transition-colors ${
                      location.pathname === item.to ? 'bg-[#FBF9F4] text-[#0F3A3A]' : 'text-[#FBF9F4]/82 hover:bg-[#FBF9F4]/8'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em]">{item.label}</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                ))}
              </div>

              {!isAdmin && (
                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between border border-[#FBF9F4]/12 px-4 py-4 text-[#FBF9F4]/82 transition-colors hover:bg-[#FBF9F4]/8"
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">search</span>
                      <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em]">Search Catalogue</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>

                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3 border-t border-[#FBF9F4]/12 pt-4">
                {!user ? (
                  <Link
                    to="/login"
                    className="bg-[#FBF9F4] px-5 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F3A3A]"
                  >
                    Login
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="bg-[#FBF9F4] px-5 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F3A3A]"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="border border-[#FBF9F4]/40 px-5 py-3 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4]"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay — rendered outside nav so it covers full screen */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
