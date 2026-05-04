import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Leaf } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signIn, signUp, signOut, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const passwordCriteria = useMemo(() => {
    return {
      length: password.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const isPasswordStrong = passwordCriteria.length && passwordCriteria.special;

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        if (!isPasswordStrong) {
          throw new Error('Password must be 8+ characters and include a special character.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signUp(email, password, fullName, phone);
        try {
          await signOut();
        } catch (err) {
          // Keep UX stable even if signout fails after signup.
        }
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('rate limit')) {
        setErrorMsg('Supabase email rate limit exceeded. Try again in a few minutes.');
      } else {
        setErrorMsg(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setErrorMsg('');
    try {
      await signInWithProvider(provider);
    } catch (err) {
      setErrorMsg(err.message || `An error occurred during ${provider} authentication.`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-screen overflow-hidden bg-[#fbf9f4]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative hidden lg:block lg:w-[55%]"
      >
        <img src="/phool.png" alt="CHLORO Botanical" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3333]/90 via-[#2F4F4F]/30 to-[#2F4F4F]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2F4F4F]/20" />

        {/* Brand Presence */}
        <div className="absolute top-16 left-16 z-10">
          <h1 className="font-headline text-2xl tracking-[0.25em] text-[#FBF9F4] opacity-80 uppercase">CHLORO</h1>
        </div>

        {/* Editorial Context */}
        <div className="absolute bottom-24 left-16 z-10 max-w-sm">
          <div className="w-12 h-[1px] bg-[#FBF9F4] opacity-40 mb-10" />
          <p className="font-headline italic text-[28px] text-[#FBF9F4] leading-[1.6] opacity-90">
            "Nature does not hurry, yet everything is accomplished."
          </p>
        </div>
      </motion.div>

      <div className="relative flex h-screen w-full flex-col overflow-y-auto bg-[#fbf9f4] lg:w-[45%]">
        <button
          onClick={() => navigate('/')}
          className="absolute top-10 left-10 z-20 text-[#2F4F4F]/40 transition-colors hover:text-[#2F4F4F]"
        >
          <Leaf size={22} className="-scale-x-100" />
        </button>

        <div className="px-10 pt-10 lg:hidden">
          <h1 className="font-headline text-xl font-light tracking-[0.15em] text-[#2F4F4F]">CHLORO</h1>
        </div>

        <div className="flex flex-1 items-center justify-center px-10 py-4 md:px-16 lg:px-20">
          <div className="w-full max-w-[360px]">
            <div className="mb-6 flex items-center gap-8">
              <button onClick={() => setIsLogin(true)} className="relative pb-3 outline-none">
                <span className={`font-label text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${isLogin ? 'text-[#2F4F4F]' : 'text-[#2F4F4F]/25 hover:text-[#2F4F4F]/50'}`}>
                  Sign In
                </span>
                {isLogin && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4F4F]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
              <button onClick={() => setIsLogin(false)} className="relative pb-3 outline-none">
                <span className={`font-label text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${!isLogin ? 'text-[#2F4F4F]' : 'text-[#2F4F4F]/25 hover:text-[#2F4F4F]/50'}`}>
                  Create Account
                </span>
                {!isLogin && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4F4F]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </div>

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
                   <h2 className="mb-1 font-headline text-[2rem] leading-tight text-[#31332c]">Welcome back.</h2>
                  <p className="mb-4 font-body text-[13px] leading-relaxed text-[#797c73]">
                    Continue your journey through our curated botanical collections.
                  </p>

                  <div className="mb-6 space-y-4">
                    {errorMsg && <div className="rounded border border-red-100 bg-red-50 p-3 font-body text-[12px] text-red-500">{errorMsg}</div>}
                    <div>
                      <label className="mb-3 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border-b border-[#2F4F4F]/15 bg-transparent pb-3 font-body text-[14px] text-[#31332c] outline-none transition-colors duration-300 placeholder:text-[#31332c]/20 focus:border-[#2F4F4F]/60"
                      />
                    </div>
                    <div className="relative">
                      <label className="mb-3 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="w-full border-b border-[#2F4F4F]/15 bg-transparent pb-3 pr-8 font-body text-[14px] text-[#31332c] outline-none transition-colors duration-300 placeholder:text-[#31332c]/20 focus:border-[#2F4F4F]/60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute bottom-3 right-0 text-[#2F4F4F]/40 transition-colors duration-200 hover:text-[#2F4F4F]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(47,79,79,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-[#2F4F4F] py-4 font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e0fffe] shadow-lg shadow-[#2F4F4F]/20 transition-all duration-300 hover:bg-[#1a3333] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Enter Portfolio'}
                  </motion.button>

                  <div className="my-4 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#2F4F4F]/8" />
                    <span className="font-label text-[8px] font-semibold uppercase tracking-[0.25em] text-[#2F4F4F]/25">or continue with</span>
                    <div className="h-px flex-1 bg-[#2F4F4F]/8" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleOAuth('google')}
                      className="flex items-center justify-center gap-2.5 border border-[#2F4F4F]/12 py-3.5 font-label text-[9px] font-semibold uppercase tracking-[0.15em] text-[#456565]/60 transition-all duration-300 hover:border-[#2F4F4F]/30 hover:text-[#2F4F4F]"
                    >
                      <FaGoogle className="text-[12px] opacity-70" />
                      SIGNIN WITH GOOGLE
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuth('apple')}
                      className="flex items-center justify-center gap-2.5 border border-[#2F4F4F]/12 py-3.5 font-label text-[9px] font-semibold uppercase tracking-[0.15em] text-[#456565]/60 transition-all duration-300 hover:border-[#2F4F4F]/30 hover:text-[#2F4F4F]"
                    >
                      <FaApple className="text-[13px] opacity-70" />
                      SIGNIN WITH APPLE
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
                  <h2 className="mb-2 font-headline text-[2.2rem] leading-tight text-[#31332c]">Join CHLORO.</h2>
                  <p className="mb-8 font-body text-[13px] leading-relaxed text-[#797c73]">Create your account to explore our curated collection.</p>

                  <div className="mb-8 space-y-5">
                    {errorMsg && <div className="rounded border border-red-100 bg-red-50 p-3 font-body text-[12px] text-red-500">{errorMsg}</div>}
                    <div>
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full border-b border-[#2F4F4F]/15 bg-transparent pb-2.5 font-body text-[14px] text-[#31332c] outline-none transition-colors duration-300 placeholder:text-[#31332c]/20 focus:border-[#2F4F4F]/60"
                      />
                    </div>
                    <div>
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border-b border-[#2F4F4F]/15 bg-transparent pb-2.5 font-body text-[14px] text-[#31332c] outline-none transition-colors duration-300 placeholder:text-[#31332c]/20 focus:border-[#2F4F4F]/60"
                      />
                    </div>
                    <div>
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Phone Number</label>
                      <div className="flex items-center border-b border-[#2F4F4F]/15 transition-colors duration-300 focus-within:border-[#2F4F4F]/60">
                        <Phone size={14} className="mb-2.5 mr-2 shrink-0 text-[#2F4F4F]/30" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+977 9800000000"
                          className="w-full bg-transparent pb-2.5 font-body text-[14px] text-[#31332c] outline-none placeholder:text-[#31332c]/20"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="w-full border-b border-[#2F4F4F]/15 bg-transparent pb-2.5 pr-8 font-body text-[14px] text-[#31332c] outline-none transition-colors duration-300 placeholder:text-[#31332c]/20 focus:border-[#2F4F4F]/60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute bottom-2.5 right-0 text-[#2F4F4F]/40 transition-colors duration-200 hover:text-[#2F4F4F]"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <div className="mt-2 flex gap-4">
                        <span className={`text-[8px] uppercase tracking-widest transition-colors duration-300 ${passwordCriteria.length ? 'text-green-600' : 'text-[#2F4F4F]/30'}`}>8+ Chars</span>
                        <span className={`text-[8px] uppercase tracking-widest transition-colors duration-300 ${passwordCriteria.special ? 'text-green-600' : 'text-[#2F4F4F]/30'}`}>Special Char</span>
                        <span className={`ml-auto text-[8px] font-bold uppercase transition-colors duration-300 ${isPasswordStrong ? 'text-green-600' : 'text-orange-400'}`}>
                          {password.length > 0 ? (isPasswordStrong ? 'Strong' : 'Weak') : ''}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Confirm Password</label>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        className="w-full border-b border-[#2F4F4F]/15 bg-transparent pb-2.5 pr-8 font-body text-[14px] text-[#31332c] outline-none transition-colors duration-300 placeholder:text-[#31332c]/20 focus:border-[#2F4F4F]/60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute bottom-2.5 right-0 text-[#2F4F4F]/40 transition-colors duration-200 hover:text-[#2F4F4F]"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(47,79,79,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-[#2F4F4F] py-4 font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e0fffe] shadow-lg shadow-[#2F4F4F]/20 transition-all duration-300 hover:bg-[#1a3333] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Create Account'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center">
              <p className="font-label text-[9px] uppercase tracking-[0.25em] text-[#2F4F4F]/30">
                © 2026 CHLORO — Rooted in Elegance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;

