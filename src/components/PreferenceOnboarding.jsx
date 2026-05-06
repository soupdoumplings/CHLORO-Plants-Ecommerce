import React, { useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import { usePlantPreferences } from '../lib/PlantPreferencesContext';
import { DEFAULT_PLANT_PREFERENCES, preferenceOptions } from '../lib/plantPreferences';

const steps = [
  {
    key: 'light',
    eyebrow: 'Light',
    title: 'What kind of light does your space get?',
    copy: 'This helps us avoid recommending plants that will struggle in your actual room.',
  },
  {
    key: 'care',
    eyebrow: 'Care',
    title: 'How much plant care do you want?',
    copy: 'Pick the routine you can realistically keep, not the one you wish you had.',
  },
  {
    key: 'watering',
    eyebrow: 'Water',
    title: 'What watering rhythm fits you?',
    copy: 'Your recommendations will lean toward plants that match your habits.',
  },
  {
    key: 'space',
    eyebrow: 'Space',
    title: 'Where will your plant mostly live?',
    copy: 'Scale matters: shelf plants and floor specimens solve different problems.',
  },
];

const ToggleOption = ({ active, option, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 border px-4 py-4 text-left transition-colors ${
      active
        ? 'border-[#0F3A3A] bg-[#0F3A3A] text-[#FBF9F4]'
        : 'border-[#B0B0A8]/30 bg-white text-[#1A1A1A] hover:border-[#0F3A3A]/50'
    }`}
  >
    <span className="material-symbols-outlined text-[19px]">{option.icon}</span>
    <span className="font-label text-[10px] font-bold uppercase tracking-[0.14em] leading-snug">
      {option.label}
    </span>
  </button>
);

const PreferenceOnboarding = () => {
  const { user, isAdmin } = useAuth();
  const { hasPreferences, loading, saving, savePreferences } = usePlantPreferences();
  const [dismissed, setDismissed] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState(DEFAULT_PLANT_PREFERENCES);
  const currentStep = steps[stepIndex];
  const isOpen = Boolean(user && !isAdmin && !loading && !hasPreferences && !dismissed);

  if (!user || isAdmin) return null;

  const updateDraft = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const toggleStyle = (style) => {
    setDraft((current) => {
      const currentStyles = current.style || [];
      const nextStyles = currentStyles.includes(style)
        ? currentStyles.filter((item) => item !== style)
        : [...currentStyles, style];

      return { ...current, style: nextStyles.length ? nextStyles : ['lush'] };
    });
  };

  const handleSave = async () => {
    const result = await savePreferences(draft);
    if (result.success || result.error) {
      setDismissed(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A1F1F]/70 px-4 py-8 backdrop-blur-sm"
        >
          <Motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[760px] bg-[#FBF9F4] border border-[#FBF9F4]/40 shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
              <aside className="bg-[#0F3A3A] p-7 text-[#FBF9F4] flex flex-col justify-between gap-10">
                <div>
                  <p className="font-label text-[9px] uppercase tracking-[0.24em] text-[#C6E9E9] font-bold mb-4">
                    Plant Fit
                  </p>
                  <h2 className="font-headline text-[32px] leading-none">
                    Personalise your archive.
                  </h2>
                </div>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center gap-3">
                      <span className={`h-1.5 w-1.5 rounded-full ${index <= stepIndex ? 'bg-[#C6E9E9]' : 'bg-[#FBF9F4]/25'}`} />
                      <span className="font-label text-[8px] uppercase tracking-[0.16em] text-[#FBF9F4]/75">
                        {step.eyebrow}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>

              <section className="p-7 sm:p-9">
                <p className="font-label text-[9px] uppercase tracking-[0.22em] text-[#785A1A] font-bold mb-3">
                  {currentStep.eyebrow} Preference
                </p>
                <h3 className="font-headline text-[30px] leading-tight text-[#1A1A1A] mb-3">
                  {currentStep.title}
                </h3>
                <p className="font-body text-[13px] leading-6 text-[#5E6058] mb-7">
                  {currentStep.copy}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
                  {preferenceOptions[currentStep.key].map((option) => (
                    <ToggleOption
                      key={option.value}
                      option={option}
                      active={draft[currentStep.key] === option.value}
                      onClick={() => updateDraft(currentStep.key, option.value)}
                    />
                  ))}
                </div>

                {stepIndex === steps.length - 1 && (
                  <div className="border-t border-[#B0B0A8]/20 pt-6 mb-7">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                      <div>
                        <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A] font-bold">
                          Household Safety
                        </p>
                        <p className="font-body text-[12px] text-[#5E6058] mt-1">
                          Enable this if cats or dogs can reach your plants.
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

                    <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#1A1A1A] font-bold mb-3">
                      Visual Style
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {preferenceOptions.style.map((option) => (
                        <ToggleOption
                          key={option.value}
                          option={option}
                          active={(draft.style || []).includes(option.value)}
                          onClick={() => toggleStyle(option.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
                    disabled={stepIndex === 0}
                    className="font-label text-[10px] uppercase tracking-[0.16em] text-[#5E6058] disabled:opacity-30"
                  >
                    Back
                  </button>
                  {stepIndex < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setStepIndex((index) => index + 1)}
                      className="bg-[#1A1A1A] px-7 py-3.5 text-[#FBF9F4] font-label text-[10px] uppercase tracking-[0.18em] font-bold"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#0F3A3A] px-7 py-3.5 text-[#FBF9F4] font-label text-[10px] uppercase tracking-[0.18em] font-bold disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  )}
                </div>
              </section>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreferenceOnboarding;
