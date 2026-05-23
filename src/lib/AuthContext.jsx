/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // null means role is currently being fetched
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [loading, setLoading] = useState(true);
  const hydratedUserIdRef = useRef(null);
  const currentSessionUserIdRef = useRef(null);
  const currentSessionAccessTokenRef = useRef(null);

  useEffect(() => {
    const fetchRole = async (currentUser) => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('users').select('role').eq('id', currentUser.id).maybeSingle();
        if (!error && data) {
          setIsAdmin(data.role === 'ADMIN');
        } else {
          setIsAdmin(false);
        }
      } catch {
        setIsAdmin(false);
      }
    };

    // Ensure the user has a row in public.users (fixes foreign key errors for cart, orders, etc.)
    const ensureUserProfile = async (currentUser) => {
      if (!currentUser) return;
      const { data } = await supabase.from('users').select('id').eq('id', currentUser.id).maybeSingle();
      if (!data) {
        const name = currentUser.user_metadata?.full_name
          || currentUser.user_metadata?.name
          || currentUser.email?.split('@')[0]
          || currentUser.phone
          || 'User';
        const baseRow = {
          id: currentUser.id,
          email: currentUser.email || `${currentUser.phone || currentUser.id}@phone.chloro.local`,
          name: name,
          role: 'USER'
        };
        const phoneRow = currentUser.phone || currentUser.user_metadata?.phone
          ? { ...baseRow, phone: currentUser.phone || currentUser.user_metadata?.phone }
          : baseRow;
        const { error: insertError } = await supabase.from('users').upsert(phoneRow, { onConflict: 'id' });
        if (insertError && phoneRow.phone) {
          await supabase.from('users').upsert(baseRow, { onConflict: 'id' });
        }
      }
    };

    const hydrateUserMeta = async (currentUser) => {
      try {
        await ensureUserProfile(currentUser);
        await fetchRole(currentUser);
      } catch (err) {
        console.error('User metadata hydrate error:', err);
        setIsAdmin(false);
      }
    };

    // Get initial session quickly; hydrate role/profile in background
    supabase.auth.getSession().then(({ data: { session } }) => {
      currentSessionUserIdRef.current = session?.user?.id ?? null;
      currentSessionAccessTokenRef.current = session?.access_token ?? null;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false); // instantly unblock global loading

      if (session?.user) {
        hydratedUserIdRef.current = session.user.id;
        hydrateUserMeta(session.user);
      } else {
        hydratedUserIdRef.current = null;
        setIsAdmin(false);
      }
    }).catch((err) => {
      console.error('Session init error:', err);
      setLoading(false);
      setIsAdmin(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const nextUser = session?.user ?? null;
        const nextUserId = nextUser?.id ?? null;
        const nextAccessToken = session?.access_token ?? null;
        const isDuplicateFocusEvent = Boolean(
          nextUserId
          && nextUserId === currentSessionUserIdRef.current
          && nextAccessToken === currentSessionAccessTokenRef.current
          && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')
        );

        if (isDuplicateFocusEvent) {
          setLoading(false);
          return;
        }

        currentSessionUserIdRef.current = nextUserId;
        currentSessionAccessTokenRef.current = nextAccessToken;
        setSession(session);
        setUser(nextUser);
        setLoading(false); // ensure global loading is false

        if (nextUser) {
          if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
          const isNewUser = hydratedUserIdRef.current !== nextUser.id;
          const shouldHydrate = (
            isNewUser
            || event === 'USER_UPDATED'
            || event === 'PASSWORD_RECOVERY'
          );

          if (event === 'SIGNED_IN' && isNewUser) {
            setIsAdmin(null); // Re-fetch role on new login
          }

          if (shouldHydrate) {
            hydratedUserIdRef.current = nextUser.id;
            hydrateUserMeta(nextUser);
          }
        } else {
          hydratedUserIdRef.current = null;
          setIsPasswordRecovery(false);
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName, phone = '') => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPhone = String(phone || '').trim();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: String(fullName || '').trim(),
          phone: normalizedPhone,
        }
      }
    });
    if (error) throw error;

    if (data?.user) {
      // Attempt to immediately create their user profile row, failing silently if already exists
      const baseUserRow = {
        id: data.user.id,
        email: normalizedEmail,
        name: String(fullName || '').trim(),
        role: 'USER'
      };
      const userRow = normalizedPhone ? { ...baseUserRow, phone: normalizedPhone } : baseUserRow;
      let { error: dbError } = await supabase.from('users').upsert(userRow, { onConflict: 'id' });
      // Backward-compatible fallback if the users table doesn't have a phone column yet.
      if (dbError && normalizedPhone) {
        const fallback = await supabase.from('users').upsert(baseUserRow, { onConflict: 'id' });
        dbError = fallback.error;
      }
      // If db fails, console log but don't strictly crash the sign up
      if (dbError) console.error("Error creating public.user:", dbError.message);
    }

    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithPhone = async (phone) => {
    const normalizedPhone = String(phone || '').replace(/[^\d+]/g, '');
    if (!normalizedPhone || normalizedPhone.length < 7) {
      throw new Error('Enter a valid phone number with country code.');
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
      options: {
        shouldCreateUser: true,
        data: { phone: normalizedPhone },
      },
    });

    if (error) {
      const message = String(error.message || '').toLowerCase();
      if (message.includes('sms') || message.includes('phone') || message.includes('provider')) {
        throw new Error(`SMS Provider Error: ${error.message}. Please ensure your Twilio credentials are correct and configured in your remote Supabase Dashboard under Authentication -> Providers -> Phone.`);
      }
      throw error;
    }
    return data;
  };

  const sendPasswordResetOtp = async (email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error('Enter a valid email address.');
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
    if (error) throw error;
    return data;
  };

  const verifyEmailOtp = async (email, token, type = 'email') => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: String(token || '').trim(),
      type,
    });

    if (error) throw error;
    if (type === 'recovery') setIsPasswordRecovery(true);
    return data;
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    setIsPasswordRecovery(false);
    return data;
  };

  const verifyPhoneOtp = async (phone, token) => {
    const normalizedPhone = String(phone || '').replace(/[^\d+]/g, '');
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: String(token || '').trim(),
      type: 'sms',
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isPasswordRecovery, loading, signUp, signIn, signOut, signInWithProvider, signInWithPhone, verifyPhoneOtp, verifyEmailOtp, sendPasswordResetOtp, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
