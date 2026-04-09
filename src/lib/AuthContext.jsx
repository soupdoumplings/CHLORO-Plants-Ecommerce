import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Keep your original import path

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Stays true until auth + role is ready

  // Fetch role from your public.users table
  const fetchRole = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setIsAdmin(data.role === 'ADMIN');
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Get initial session AND wait for role before stopping loading
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchRole(session.user); // wait for role BEFORE setLoading(false)
      }

      setLoading(false); // only stops loading AFTER role is fetched
    });

    // Listen to auth state changes (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchRole(session.user); // wait for role here too
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // SignUp now accepts phone as 4th argument (matches AuthPage.jsx)
  const signUp = async (email, password, fullName, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '', // Phone added here
        },
      },
    });
    if (error) throw error;

    // Insert user profile row into public.users table
    if (data?.user) {
      const { error: dbError } = await supabase.from('users').insert([{
        id:    data.user.id,
        email: email,
        name:  fullName,
        phone: phone || '',  // Phone saved to DB too
        role:  'USER',
      }]);
      if (dbError) console.error('Error creating public.user:', dbError.message);
    }

    return data;
  };

  // signIn 
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // SignOut 
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Show loading spinner instead of blocking children render 
  // Old code: {!loading && children} — this shows blank white screen on load
  // New code: always render children, ProtectedRoute handles the loading state
  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
