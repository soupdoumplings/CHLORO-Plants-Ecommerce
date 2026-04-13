import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async (currentUser) => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('users').select('role').eq('id', currentUser.id).single();
        if (!error && data) {
          setIsAdmin(data.role === 'ADMIN');
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }
    };

    // Ensure the user has a row in public.users (fixes foreign key errors for cart, orders, etc.)
    const ensureUserProfile = async (currentUser) => {
      if (!currentUser) return;
      const { data } = await supabase.from('users').select('id').eq('id', currentUser.id).single();
      if (!data) {
        const name = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User';
        await supabase.from('users').insert([{
          id: currentUser.id,
          email: currentUser.email,
          name: name,
          role: 'USER'
        }]);
      }
    };

    const hydrateUserMeta = async (currentUser) => {
      try {
        await ensureUserProfile(currentUser);
        await fetchRole(currentUser);
      } catch (err) {
        console.error('User metadata hydrate error:', err);
      }
    };

    // Get initial session quickly; hydrate role/profile in background
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        hydrateUserMeta(session.user);
      } else {
        setIsAdmin(false);
      }
    }).catch((err) => {
      console.error('Session init error:', err);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          hydrateUserMeta(session.user);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) throw error;
    
    if (data?.user) {
      // Attempt to immediately create their user profile row, failing silently if already exists
      const { error: dbError } = await supabase.from('users').insert([{
        id: data.user.id,
        email: email,
        name: fullName,
        role: 'USER'
      }]);
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
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signUp, signIn, signOut, signInWithProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
