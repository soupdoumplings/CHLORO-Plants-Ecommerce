import React, { useMemo, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Phone } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../lib/AuthContext';

const fieldClass = 'w-full border-b border-[#2F4F4F]/15 bg-transparent pb-3 font-body text-[14px] text-[#31332c] outline-none transition-colors duration-300 placeholder:text-[#31332c]/20 focus:border-[#2F4F4F]/60';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signIn, signUp, signInWithProvider, signInWithPhone, verifyPhoneOtp, verifyEmailOtp, sendPasswordResetOtp, updatePassword } = useAuth();
  const navigate = useNavigate();

  const passwordCriteria = useMemo(() => ({
    length: password.length >= 8,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);

  const isPasswordStrong = passwordCriteria.length && passwordCriteria.special;

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    resetMessages();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        if (resetStep === 1) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Enter a valid email address.');
          await sendPasswordResetOtp(email);
          setResetStep(2);
          setSuccessMsg('Reset code sent to your email.');
          return;
        }

        if (resetStep === 2) {
          await verifyEmailOtp(email, otpToken, 'recovery');
          setResetStep(3);
          setSuccessMsg('Code verified. Enter your new password.');
          return;
        }

        if (!isPasswordStrong) throw new Error('Password must be 8+ characters and include a special character.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        await updatePassword(password);
        setIsForgotPassword(false);
        setResetStep(1);
        setOtpToken('');
        setPassword('');
        setConfirmPassword('');
        setSuccessMsg('Password updated successfully. You can now sign in.');
        return;
      }

      if (isLogin && loginMethod === 'phone') {
        if (!otpSent) {
          await signInWithPhone(phone);
          setOtpSent(true);
          setSuccessMsg('We sent a one-time code to your phone.');
        } else {
          await verifyPhoneOtp(phone, otpToken);
          setSuccessMsg('Phone verified. Opening your account...');
        }
        return;
      }

      if (isLogin) {
        await signIn(email, password);
        return;
      }

      if (!fullName.trim()) throw new Error('Full name is required.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Enter a valid email address.');
      if (phone && !/^\+?[0-9\s().-]{7,}$/.test(phone.trim())) throw new Error('Enter a valid phone number.');
      if (!isPasswordStrong) throw new Error('Password must be 8+ characters and include a special character.');
      if (password !== confirmPassword) throw new Error('Passwords do not match.');

      const result = await signUp(email, password, fullName, phone);
      setPassword('');
      setConfirmPassword('');

      if (result?.session) {
        setSuccessMsg('Account created. Opening onboarding...');
      } else {
        setIsLogin(true);
        setSuccessMsg('Account created. Check your email if confirmation is enabled, then sign in.');
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes('rate limit')) {
        setErrorMsg('Supabase rate limit exceeded. Try again in a few minutes.');
      } else {
        setErrorMsg(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    resetMessages();
    setIsLoading(true);
    try {
      await signInWithProvider(provider);
    } catch (err) {
      setErrorMsg(err.message || `An error occurred during ${provider} authentication.`);
      setIsLoading(false);
    }
  };

  const changeLoginMethod = (method) => {
    setLoginMethod(method);
    setOtpSent(false);
    setOtpToken('');
    setIsForgotPassword(false);
    setResetStep(1);
    resetMessages();
  };

  const toggleAuthMode = (mode) => {
    setIsLogin(mode === 'login');
    setIsForgotPassword(false);
    setResetStep(1);
    setOtpSent(false);
    setOtpToken('');
    resetMessages();
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-screen overflow-hidden bg-[#fbf9f4]"
    >
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative hidden lg:block lg:w-[55%]"
      >
        <img src="/phool.png" alt="CHLORO Botanical" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3333]/88 via-[#2F4F4F]/30 to-[#2F4F4F]/45" />
        <div className="absolute top-16 left-16 z-10">
          <h1 className="font-headline text-2xl uppercase tracking-[0.25em] text-[#FBF9F4]/80">CHLORO</h1>
        </div>
        <div className="absolute bottom-24 left-16 z-10 max-w-sm">
          <div className="mb-10 h-px w-12 bg-[#FBF9F4]/40" />
          <p className="font-headline text-[28px] italic leading-[1.6] text-[#FBF9F4]/90">
            "Nature does not hurry, yet everything is accomplished."
          </p>
        </div>
      </Motion.div>

      <div className="relative flex h-screen w-full flex-col overflow-y-auto bg-[#fbf9f4] lg:w-[45%]">
        <button
          onClick={() => navigate('/')}
          className="absolute top-10 left-10 z-20 text-[#2F4F4F]/40 transition-colors hover:text-[#2F4F4F]"
          aria-label="Back home"
        >
          <Leaf size={22} className="-scale-x-100" />
        </button>

        <div className="px-10 pt-10 lg:hidden">
          <h1 className="font-headline text-xl font-light tracking-[0.15em] text-[#2F4F4F]">CHLORO</h1>
        </div>

        <div className="flex flex-1 items-center justify-center px-8 py-8 md:px-16 lg:px-20">
          <div className="w-full max-w-[390px]">
            <div className="mb-6 flex items-center gap-8">
              <button type="button" onClick={() => toggleAuthMode('login')} className="relative pb-3 outline-none">
                <span className={`font-label text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${isLogin && !isForgotPassword ? 'text-[#2F4F4F]' : 'text-[#2F4F4F]/25 hover:text-[#2F4F4F]/50'}`}>
                  Sign In
                </span>
                {isLogin && !isForgotPassword && <Motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4F4F]" />}
              </button>
              <button type="button" onClick={() => toggleAuthMode('signup')} className="relative pb-3 outline-none">
                <span className={`font-label text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${!isLogin && !isForgotPassword ? 'text-[#2F4F4F]' : 'text-[#2F4F4F]/25 hover:text-[#2F4F4F]/50'}`}>
                  Create Account
                </span>
                {!isLogin && !isForgotPassword && <Motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#2F4F4F]" />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <Motion.form
                key={isForgotPassword ? `forgot-${resetStep}` : isLogin ? `login-${loginMethod}` : 'signup'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleAuth}
              >
                <h2 className="mb-2 font-headline text-[2.1rem] leading-tight text-[#31332c]">
                  {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome back.' : 'Join CHLORO.'}
                </h2>
                <p className="mb-6 font-body text-[13px] leading-relaxed text-[#797c73]">
                  {isForgotPassword
                    ? (resetStep === 1 ? 'Enter your email to receive a 6-digit reset code.' : resetStep === 2 ? 'Check your email for the reset code.' : 'Create a new password for your account.')
                    : isLogin ? 'Continue to your orders, wishlist, and recommendations.' : 'Create your account to save billing details and shop faster.'}
                </p>

                {errorMsg && <div className="mb-4 border border-red-100 bg-red-50 p-3 font-body text-[12px] text-red-500">{errorMsg}</div>}
                {successMsg && <div className="mb-4 border border-[#C6E9E9] bg-[#C6E9E9]/25 p-3 font-body text-[12px] text-[#244545]">{successMsg}</div>}

                {isLogin && !isForgotPassword && (
                  <div className="mb-5 grid grid-cols-2 border border-[#2F4F4F]/12 bg-white/45 p-1">
                    {[
                      { id: 'email', label: 'Password' },
                      { id: 'phone', label: 'Phone' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => changeLoginMethod(method.id)}
                        className={`py-2.5 font-label text-[9px] font-bold uppercase tracking-[0.16em] transition-colors ${
                          loginMethod === method.id ? 'bg-[#2F4F4F] text-[#FBF9F4]' : 'text-[#456565]/60 hover:text-[#2F4F4F]'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                )}
                {isLogin && !isForgotPassword && loginMethod === 'phone' && (
                  <p className="-mt-2 mb-5 font-body text-[11px] leading-relaxed text-[#797c73]">
                    Phone codes require a Supabase SMS provider. For the free demo, use password login and keep phone saved in your profile or checkout details.
                  </p>
                )}

                <div className="mb-7 space-y-5">
                  {!isLogin && !isForgotPassword && (
                    <div>
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Full Name</label>
                      <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name" className={fieldClass} autoComplete="name" />
                    </div>
                  )}

                  {((!isLogin && !isForgotPassword) || (isLogin && !isForgotPassword && loginMethod === 'email') || (isForgotPassword && resetStep === 1)) && (
                    <div>
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={fieldClass}
                        autoComplete="email"
                      />
                    </div>
                  )}

                  {(!isLogin || (isLogin && !isForgotPassword && loginMethod === 'phone')) && (
                    <div>
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Phone Number</label>
                      <div className="flex items-center border-b border-[#2F4F4F]/15 transition-colors duration-300 focus-within:border-[#2F4F4F]/60">
                        <Phone size={14} className="mb-3 mr-2 shrink-0 text-[#2F4F4F]/35" />
                        <input
                          type="tel"
                          required={loginMethod === 'phone'}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setOtpSent(false);
                            setOtpToken('');
                          }}
                          placeholder="+977 9800000000"
                          className="w-full bg-transparent pb-3 font-body text-[14px] text-[#31332c] outline-none placeholder:text-[#31332c]/20"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  )}

                  {((isLogin && !isForgotPassword && loginMethod === 'phone' && otpSent) || (isForgotPassword && resetStep === 2)) && (
                    <div>
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">One-Time Code</label>
                      <input type="text" required inputMode="numeric" value={otpToken} onChange={(e) => setOtpToken(e.target.value)} placeholder="123456" className={fieldClass} autoComplete="one-time-code" />
                    </div>
                  )}

                  {((!isLogin && !isForgotPassword) || (isLogin && !isForgotPassword && loginMethod === 'email') || (isForgotPassword && resetStep === 3)) && (
                    <div className="relative">
                      <div className="mb-2.5 flex items-center justify-between gap-4">
                        <label className="block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">
                          {isForgotPassword ? 'New Password' : 'Password'}
                        </label>
                        {isLogin && !isForgotPassword && loginMethod === 'email' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsForgotPassword(true);
                              setResetStep(1);
                              setOtpToken('');
                              resetMessages();
                            }}
                            className="font-label text-[8px] font-bold uppercase tracking-[0.16em] text-[#456565]/70 transition-colors hover:text-[#2F4F4F]"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className={`${fieldClass} pr-8`}
                        autoComplete={isLogin && !isForgotPassword ? 'current-password' : 'new-password'}
                      />
                      <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute bottom-3 right-0 text-[#2F4F4F]/40 transition-colors hover:text-[#2F4F4F]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {(!isLogin || isForgotPassword) && (
                        <div className="mt-2 flex gap-4">
                          <span className={`text-[8px] uppercase tracking-widest ${passwordCriteria.length ? 'text-green-600' : 'text-[#2F4F4F]/30'}`}>8+ Chars</span>
                          <span className={`text-[8px] uppercase tracking-widest ${passwordCriteria.special ? 'text-green-600' : 'text-[#2F4F4F]/30'}`}>Special Char</span>
                        </div>
                      )}
                    </div>
                  )}

                  {((!isLogin && !isForgotPassword) || (isForgotPassword && resetStep === 3)) && (
                    <div className="relative">
                      <label className="mb-2.5 block font-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#456565]">Confirm Password</label>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        className={`${fieldClass} pr-8`}
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute bottom-3 right-0 text-[#2F4F4F]/40 transition-colors hover:text-[#2F4F4F]" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  )}
                </div>

                {isForgotPassword && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetStep(1);
                      setOtpToken('');
                      resetMessages();
                    }}
                    className="mb-4 w-full text-center font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#456565]/70 transition-colors hover:text-[#2F4F4F]"
                  >
                    Cancel Recovery
                  </button>
                )}

                <Motion.button
                  whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(47,79,79,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[#2F4F4F] py-4 font-label text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e0fffe] shadow-lg shadow-[#2F4F4F]/20 transition-all duration-300 hover:bg-[#1a3333] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading
                    ? 'Processing...'
                    : isForgotPassword
                      ? (resetStep === 1 ? 'Send Reset Code' : resetStep === 2 ? 'Verify Code' : 'Update Password')
                    : isLogin && loginMethod === 'phone'
                      ? (otpSent ? 'Verify Code' : 'Send Code')
                        : isLogin
                          ? 'Enter Portfolio'
                          : 'Create Account'}
                </Motion.button>
              </Motion.form>
            </AnimatePresence>

            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#2F4F4F]/8" />
              <span className="font-label text-[8px] font-semibold uppercase tracking-[0.25em] text-[#2F4F4F]/25">or continue with</span>
              <div className="h-px flex-1 bg-[#2F4F4F]/8" />
            </div>

            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2.5 border border-[#2F4F4F]/12 py-3.5 font-label text-[9px] font-semibold uppercase tracking-[0.15em] text-[#456565]/60 transition-all duration-300 hover:border-[#2F4F4F]/30 hover:text-[#2F4F4F] disabled:opacity-50"
            >
              <FaGoogle className="text-[12px] opacity-70" />
              Continue with Google
            </button>

            <div className="mt-6 text-center">
              <p className="font-label text-[9px] uppercase tracking-[0.25em] text-[#2F4F4F]/30">
                2026 CHLORO - Rooted in Elegance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default AuthPage;
