import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
    window.location.reload();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-screen bg-[#fbf9f4] overflow-hidden"
    >

      {/* ── Left Panel: Cinematic Flower Image ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="hidden lg:block lg:w-[55%] relative"
      >
        <img
          src="/auth-flower.png"
          alt="CHLORO Botanical"
          className="w-full h-full object-cover"
        />
        {/* Teal-tinted gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3333]/90 via-[#2F4F4F]/30 to-[#2F4F4F]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2F4F4F]/20" />

        {/* Brand & Quote */}
        <div className="absolute inset-0 flex flex-col justify-between p-14 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="font-headline text-white/90 text-2xl tracking-[0.15em] font-light">
              CHLORO
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-lg"
          >
            <div className="w-10 h-px bg-[#c6e9e9]/40 mb-8" />
            <p className="font-headline italic text-white/85 text-3xl leading-relaxed">
              "Nature does not hurry, yet everything is accomplished."
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right Panel: Auth Forms ── */}
      <div className="w-full lg:w-[45%] bg-[#fbf9f4] flex flex-col h-screen">

        {/* Mobile brand */}
        <div className="lg:hidden pt-10 px-10">
          <h1 className="font-headline text-[#2F4F4F] text-xl tracking-[0.15em] font-light">CHLORO</h1>
        </div>

        {/* Centered form area */}
        <div className="flex-1 flex items-center justify-center px-10 md:px-16 lg:px-20">
          <div className="w-full max-w-[360px]">

            {/* Tabs */}
            <div className="flex items-center gap-8 mb-12">
              <button
                onClick={() => setIsLogin(true)}
                className="relative pb-3 outline-none"
              >
                <span className={`font-label text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 ${isLogin ? 'text-[#2F4F4F]' : 'text-[#2F4F4F]/25 hover:text-[#2F4F4F]/50'}`}>
                  Sign In
                </span>
                {isLogin && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4F4F]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className="relative pb-3 outline-none"
              >
                <span className={`font-label text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors duration-300 ${!isLogin ? 'text-[#2F4F4F]' : 'text-[#2F4F4F]/25 hover:text-[#2F4F4F]/50'}`}>
                  Create Account
                </span>
                {!isLogin && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4F4F]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* Animated form area */}
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleAuth}
                >
                  <h2 className="font-headline text-[2.2rem] leading-tight text-[#31332c] mb-2">
                    Welcome back.
                  </h2>
                  <p className="font-body text-[13px] text-[#797c73] mb-10 leading-relaxed">
                    Continue your journey through our curated botanical collections.
                  </p>

                  <div className="space-y-7 mb-10">
                    <div>
                      <label className="block font-label text-[9px] uppercase tracking-[0.2em] text-[#456565] font-semibold mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-transparent border-b border-[#2F4F4F]/15 pb-3 font-body text-[14px] text-[#31332c] outline-none focus:border-[#2F4F4F]/60 transition-colors duration-300 placeholder:text-[#31332c]/20"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-3">
                        <label className="font-label text-[9px] uppercase tracking-[0.2em] text-[#456565] font-semibold">
                          Password
                        </label>
                        <button type="button" className="font-label text-[9px] uppercase tracking-[0.15em] text-[#456565]/50 hover:text-[#2F4F4F] transition-colors duration-300">
                          Forgot?
                        </button>
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-[#2F4F4F]/15 pb-3 font-body text-[14px] text-[#31332c] outline-none focus:border-[#2F4F4F]/60 transition-colors duration-300 placeholder:text-[#31332c]/20"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(47,79,79,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#2F4F4F] text-[#e0fffe] font-label text-[10px] uppercase tracking-[0.25em] py-4 font-semibold hover:bg-[#1a3333] transition-all duration-300 shadow-lg shadow-[#2F4F4F]/20"
                  >
                    Enter Portfolio
                  </motion.button>

                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-[#2F4F4F]/8" />
                    <span className="font-label text-[8px] uppercase tracking-[0.25em] text-[#2F4F4F]/25 font-semibold">or continue with</span>
                    <div className="flex-1 h-px bg-[#2F4F4F]/8" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="border border-[#2F4F4F]/12 py-3.5 font-label text-[9px] uppercase tracking-[0.15em] font-semibold text-[#456565]/60 flex items-center justify-center gap-2.5 hover:border-[#2F4F4F]/30 hover:text-[#2F4F4F] transition-all duration-300">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      Signin with Google
                    </button>
                    <button type="button" className="border border-[#2F4F4F]/12 py-3.5 font-label text-[9px] uppercase tracking-[0.15em] font-semibold text-[#456565]/60 flex items-center justify-center gap-2.5 hover:border-[#2F4F4F]/30 hover:text-[#2F4F4F] transition-all duration-300">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                      Signin with Apple
                    </button>
                  </div>
                </motion.form>

              ) : (

                <motion.form
                  key="signup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleAuth}
                >
                  <h2 className="font-headline text-[2.2rem] leading-tight text-[#31332c] mb-2">
                    Join CHLORO.
                  </h2>
                  <p className="font-body text-[13px] text-[#797c73] mb-8 leading-relaxed">
                    Create your account to explore our curated collection.
                  </p>

                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block font-label text-[9px] uppercase tracking-[0.2em] text-[#456565] font-semibold mb-2.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full bg-transparent border-b border-[#2F4F4F]/15 pb-2.5 font-body text-[14px] text-[#31332c] outline-none focus:border-[#2F4F4F]/60 transition-colors duration-300 placeholder:text-[#31332c]/20"
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[9px] uppercase tracking-[0.2em] text-[#456565] font-semibold mb-2.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-transparent border-b border-[#2F4F4F]/15 pb-2.5 font-body text-[14px] text-[#31332c] outline-none focus:border-[#2F4F4F]/60 transition-colors duration-300 placeholder:text-[#31332c]/20"
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[9px] uppercase tracking-[0.2em] text-[#456565] font-semibold mb-2.5">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-[#2F4F4F]/15 pb-2.5 font-body text-[14px] text-[#31332c] outline-none focus:border-[#2F4F4F]/60 transition-colors duration-300 placeholder:text-[#31332c]/20"
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[9px] uppercase tracking-[0.2em] text-[#456565] font-semibold mb-2.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-[#2F4F4F]/15 pb-2.5 font-body text-[14px] text-[#31332c] outline-none focus:border-[#2F4F4F]/60 transition-colors duration-300 placeholder:text-[#31332c]/20"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(47,79,79,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#2F4F4F] text-[#e0fffe] font-label text-[10px] uppercase tracking-[0.25em] py-4 font-semibold hover:bg-[#1a3333] transition-all duration-300 shadow-lg shadow-[#2F4F4F]/20"
                  >
                    Create Account
                  </motion.button>

                  <p className="mt-6 text-center font-body text-[11px] text-[#456565]/50 leading-relaxed">
                    By joining, you agree to our{' '}
                    <span className="underline underline-offset-2 cursor-pointer hover:text-[#2F4F4F] transition-colors">Terms</span>
                    {' '}&{' '}
                    <span className="underline underline-offset-2 cursor-pointer hover:text-[#2F4F4F] transition-colors">Privacy Policy</span>.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="font-label text-[8px] uppercase tracking-[0.3em] text-[#2F4F4F]/20 font-semibold">
            © 2025 CHLORO — Himalayan Botanical Archive
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
