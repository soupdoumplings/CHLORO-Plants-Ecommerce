/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import { DEFAULT_PLANT_PREFERENCES } from './plantPreferences';

const PlantPreferencesContext = createContext({});

const storageKey = (userId) => `chloro-plant-preferences-${userId}`;

const mergePreferences = (preferences) => ({
  ...DEFAULT_PLANT_PREFERENCES,
  ...(preferences || {}),
});

export const PlantPreferencesProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadPreferences = useCallback(async () => {
    if (!user || isAdmin) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const localFallback = window.localStorage.getItem(storageKey(user.id));

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('plant_preferences')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const nextPreferences = data?.plant_preferences
        ? mergePreferences(data.plant_preferences)
        : localFallback
          ? mergePreferences(JSON.parse(localFallback))
          : null;

      setPreferences(nextPreferences);
    } catch (err) {
      if (localFallback) {
        setPreferences(mergePreferences(JSON.parse(localFallback)));
      } else {
        setPreferences(null);
      }
      setError(err.message || 'Could not load plant preferences.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  useEffect(() => {
    if (!user || isAdmin) return undefined;

    const channel = supabase
      .channel(`plant-preferences-${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new?.plant_preferences) {
          setPreferences(mergePreferences(payload.new.plant_preferences));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, user]);

  const savePreferences = useCallback(async (nextPreferences) => {
    if (!user) return { success: false, error: 'Please log in to save preferences.' };

    const payload = {
      ...mergePreferences(nextPreferences),
      completed_at: new Date().toISOString(),
    };

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ plant_preferences: payload })
        .eq('id', user.id);

      if (updateError) throw updateError;

      window.localStorage.setItem(storageKey(user.id), JSON.stringify(payload));
      setPreferences(payload);
      return { success: true };
    } catch (err) {
      window.localStorage.setItem(storageKey(user.id), JSON.stringify(payload));
      setPreferences(payload);
      const message = err.message || 'Saved locally. Add plant_preferences JSONB to Supabase to sync.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [user]);

  const value = useMemo(() => ({
    preferences,
    hasPreferences: Boolean(preferences?.completed_at),
    loading,
    saving,
    error,
    savePreferences,
    refreshPreferences: loadPreferences,
  }), [error, loadPreferences, loading, preferences, savePreferences, saving]);

  return (
    <PlantPreferencesContext.Provider value={value}>
      {children}
    </PlantPreferencesContext.Provider>
  );
};

export const usePlantPreferences = () => useContext(PlantPreferencesContext);
