import React, { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { usePlantPreferences } from '../lib/PlantPreferencesContext';
import { DEFAULT_PLANT_PREFERENCES, preferenceOptions } from '../lib/plantPreferences';

const ChoiceGroup = ({ label, value, options, onChange }) => (
  <div>
    <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#5E6058] font-bold mb-3">
      {label}
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2.5 border px-3 py-3 text-left transition-colors ${
            value === option.value
              ? 'border-[#0F3A3A] bg-[#0F3A3A] text-[#FBF9F4]'
              : 'border-[#B0B0A8]/25 bg-[#FBF9F4] text-[#1A1A1A] hover:border-[#0F3A3A]/50'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">{option.icon}</span>
          <span className="font-label text-[8px] uppercase tracking-[0.12em] font-bold leading-snug">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const PreferenceSettings = () => {
  const { preferences, savePreferences, saving, error } = usePlantPreferences();
  const persistedDraft = useMemo(() => ({
    ...DEFAULT_PLANT_PREFERENCES,
    ...(preferences || {}),
  }), [preferences]);
  const [draftEdits, setDraftEdits] = useState(null);
  const [saved, setSaved] = useState(false);
  const draft = draftEdits || persistedDraft;

  const updateDraft = (key, value) => {
    setDraftEdits((current) => ({ ...(current || draft), [key]: value }));
    setSaved(false);
  };

  const toggleStyle = (style) => {
    setDraftEdits((current) => {
      const base = current || draft;
      const currentStyles = base.style || [];
      const nextStyles = currentStyles.includes(style)
        ? currentStyles.filter((item) => item !== style)
        : [...currentStyles, style];

      return { ...base, style: nextStyles.length ? nextStyles : ['lush'] };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    const result = await savePreferences(draft);
    setSaved(Boolean(result.success));
    if (result.success) setDraftEdits(null);
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mt-10 bg-white border border-[#B0B0A8]/15 p-7 lg:p-9"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">
        <div>
          <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#785A1A] font-bold mb-3">
            Plant Preferences
          </p>
          <h2 className="font-headline text-[28px] text-[#1A1A1A] leading-none">
            Tune your recommendations.
          </h2>
          <p className="font-body text-[13px] text-[#5E6058] mt-3 max-w-[560px] leading-6">
            These answers change the recommendation carousel immediately and sync back to your profile.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0F3A3A] text-[#FBF9F4] px-6 py-3.5 font-label text-[9px] uppercase tracking-[0.18em] font-bold disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="space-y-7">
        <ChoiceGroup label="Light" value={draft.light} options={preferenceOptions.light} onChange={(value) => updateDraft('light', value)} />
        <ChoiceGroup label="Care Level" value={draft.care} options={preferenceOptions.care} onChange={(value) => updateDraft('care', value)} />
        <ChoiceGroup label="Watering" value={draft.watering} options={preferenceOptions.watering} onChange={(value) => updateDraft('watering', value)} />
        <ChoiceGroup label="Space" value={draft.space} options={preferenceOptions.space} onChange={(value) => updateDraft('space', value)} />

        <div>
          <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#5E6058] font-bold mb-3">
            Style
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {preferenceOptions.style.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleStyle(option.value)}
                className={`flex items-center gap-2.5 border px-3 py-3 text-left transition-colors ${
                  (draft.style || []).includes(option.value)
                    ? 'border-[#0F3A3A] bg-[#0F3A3A] text-[#FBF9F4]'
                    : 'border-[#B0B0A8]/25 bg-[#FBF9F4] text-[#1A1A1A] hover:border-[#0F3A3A]/50'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{option.icon}</span>
                <span className="font-label text-[8px] uppercase tracking-[0.12em] font-bold leading-snug">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#B0B0A8]/20 pt-6">
          <div>
            <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A] font-bold">
              Pet-safe filter
            </p>
            <p className="font-body text-[12px] text-[#5E6058] mt-1">
              Removes plants with toxicity warnings from your recommendations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateDraft('hasPets', !draft.hasPets)}
            className={`w-[74px] h-[36px] p-1 transition-colors ${draft.hasPets ? 'bg-[#0F3A3A]' : 'bg-[#DAD7CC]'}`}
            aria-pressed={draft.hasPets}
          >
            <span className={`block h-7 w-7 bg-white shadow-sm transition-transform ${draft.hasPets ? 'translate-x-[38px]' : 'translate-x-0'}`} />
          </button>
        </div>

        {(error || saved) && (
          <p className={`font-label text-[9px] uppercase tracking-[0.12em] ${saved ? 'text-[#2F4F4F]' : 'text-[#9F403D]'}`}>
            {saved ? 'Recommendations updated.' : error}
          </p>
        )}
      </div>
    </Motion.div>
  );
};

export default PreferenceSettings;
