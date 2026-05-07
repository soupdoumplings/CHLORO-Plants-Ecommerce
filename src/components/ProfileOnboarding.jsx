import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';
import {
  buildBillingPayload,
  buildProfilePayload,
  emptyBillingDetails,
  emptyCustomerProfile,
  getAuthFullName,
  getCustomerProfile,
  isProfileComplete,
  upsertCustomerProfile,
} from '../lib/customerProfile';

const steps = [
  { key: 'identity', label: 'Identity' },
  { key: 'contact', label: 'Contact' },
  { key: 'address', label: 'Address' },
  { key: 'billing', label: 'Billing' },
];

const inputClass = 'w-full border border-[#B0B0A8]/35 bg-[#FBF9F4] px-4 py-3.5 font-body text-[14px] text-[#1A1A1A] outline-none transition-colors placeholder:text-[#8A8D84]/55 focus:border-[#0F3A3A]';

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#4A4A4A]">
      {label}
    </span>
    {children}
  </label>
);

const ProfileOnboarding = () => {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [schemaReady, setSchemaReady] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(emptyCustomerProfile);
  const [billing, setBilling] = useState(emptyBillingDetails);
  const [sameAsProfile, setSameAsProfile] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user || isAdmin) {
        setOpen(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await getCustomerProfile(user);
        if (!active) return;

        setSchemaReady(result.schemaReady);
        const nextProfile = {
          ...emptyCustomerProfile,
          full_name: getAuthFullName(user),
          username: user.email?.split('@')?.[0] || '',
          phone: user.user_metadata?.phone || '',
          ...(result.profile || {}),
        };
        const nextBilling = {
          ...emptyBillingDetails,
          full_name: nextProfile.full_name,
          email: user.email || '',
          phone: nextProfile.phone,
          address_line: nextProfile.address_line,
          city: nextProfile.city,
          country: nextProfile.country || 'Nepal',
          postal_code: nextProfile.postal_code,
          ...(result.billing || {}),
        };

        setProfile(nextProfile);
        setBilling(nextBilling);
        setOpen(result.schemaReady && !isProfileComplete({ profile: nextProfile, billing: nextBilling }));
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Could not load onboarding details.');
        setOpen(false);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [isAdmin, user]);

  const normalizedProfile = useMemo(() => (
    user ? buildProfilePayload({ user, profile, billing }) : emptyCustomerProfile
  ), [billing, profile, user]);
  const normalizedBilling = useMemo(() => {
    if (!user) return emptyBillingDetails;
    return buildBillingPayload({
      user,
      profile: normalizedProfile,
      billing: sameAsProfile
        ? {
          ...billing,
          address_line: normalizedProfile.address_line,
          city: normalizedProfile.city,
          country: normalizedProfile.country,
          postal_code: normalizedProfile.postal_code,
          phone: normalizedProfile.phone,
          full_name: normalizedProfile.full_name,
        }
        : billing,
    });
  }, [billing, normalizedProfile, sameAsProfile, user]);

  if (!user || isAdmin || loading || !schemaReady) return null;

  const currentStep = steps[stepIndex];

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const updateBilling = (field, value) => {
    setBilling((current) => ({ ...current, [field]: value }));
  };

  const validateStep = () => {
    if (currentStep.key === 'identity') {
      if (!profile.full_name?.trim()) return 'Full name is required.';
      if (!profile.username?.trim()) return 'Username is required.';
    }

    if (currentStep.key === 'contact') {
      if (!profile.phone?.trim()) return 'Phone number is required.';
      if (!/^\+?[0-9\s().-]{7,}$/.test(profile.phone.trim())) return 'Enter a valid phone number.';
    }

    if (currentStep.key === 'address') {
      if (!profile.address_line?.trim() || !profile.city?.trim() || !profile.country?.trim()) {
        return 'Address, city, and country are required.';
      }
    }

    if (currentStep.key === 'billing' && !sameAsProfile) {
      if (!billing.address_line?.trim() || !billing.city?.trim() || !billing.country?.trim()) {
        return 'Billing address, city, and country are required.';
      }
    }

    return '';
  };

  const handleNext = async () => {
    setError('');
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    setSaving(true);
    try {
      await upsertCustomerProfile({
        user,
        profile: normalizedProfile,
        billing: normalizedBilling,
      });
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Could not save onboarding details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0B2525]/62 px-4 py-8 backdrop-blur-sm cursor-auto">
          <Motion.div
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[720px] border border-[#D9D6CA] bg-white shadow-2xl shadow-black/20"
          >
            <div className="grid gap-0 md:grid-cols-[220px_1fr]">
              <aside className="bg-[#0F3A3A] p-7 text-[#FBF9F4]">
                <p className="mb-5 font-label text-[9px] font-bold uppercase tracking-[0.24em] text-[#C6E9E9]">
                  Account Setup
                </p>
                <h2 className="font-headline text-[32px] leading-[0.96]">
                  Finish your billing profile.
                </h2>
                <div className="mt-9 space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center gap-3">
                      <span className={`h-7 w-7 border text-center font-label text-[10px] font-bold leading-7 ${
                        index <= stepIndex ? 'border-[#C6E9E9] bg-[#C6E9E9] text-[#0F3A3A]' : 'border-white/25 text-white/45'
                      }`}
                      >
                        {index + 1}
                      </span>
                      <span className={`font-label text-[9px] font-bold uppercase tracking-[0.16em] ${
                        index === stepIndex ? 'text-white' : 'text-white/45'
                      }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="p-7 sm:p-9">
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={currentStep.key}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.22 }}
                    className="min-h-[350px]"
                  >
                    {currentStep.key === 'identity' && (
                      <div className="space-y-5">
                        <div>
                          <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">Step 01</p>
                          <h3 className="mt-2 font-headline text-[34px] leading-tight text-[#1A1A1A]">Who should we prepare orders for?</h3>
                        </div>
                        <Field label="Full name">
                          <input className={inputClass} value={profile.full_name || ''} onChange={(e) => updateProfile('full_name', e.target.value)} autoComplete="name" />
                        </Field>
                        <Field label="Username">
                          <input className={inputClass} value={profile.username || ''} onChange={(e) => updateProfile('username', e.target.value)} autoComplete="username" />
                        </Field>
                      </div>
                    )}

                    {currentStep.key === 'contact' && (
                      <div className="space-y-5">
                        <div>
                          <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">Step 02</p>
                          <h3 className="mt-2 font-headline text-[34px] leading-tight text-[#1A1A1A]">Delivery contact details.</h3>
                        </div>
                        <Field label="Phone number">
                          <input className={inputClass} value={profile.phone || ''} onChange={(e) => updateProfile('phone', e.target.value)} placeholder="+977 9800000000" autoComplete="tel" />
                        </Field>
                        <Field label="Email">
                          <input className={inputClass} value={user.email || billing.email || ''} disabled />
                        </Field>
                      </div>
                    )}

                    {currentStep.key === 'address' && (
                      <div className="space-y-5">
                        <div>
                          <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">Step 03</p>
                          <h3 className="mt-2 font-headline text-[34px] leading-tight text-[#1A1A1A]">Where should plants arrive?</h3>
                        </div>
                        <Field label="Address">
                          <input className={inputClass} value={profile.address_line || ''} onChange={(e) => updateProfile('address_line', e.target.value)} autoComplete="shipping street-address" />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Field label="City">
                            <input className={inputClass} value={profile.city || ''} onChange={(e) => updateProfile('city', e.target.value)} autoComplete="shipping address-level2" />
                          </Field>
                          <Field label="Country">
                            <input className={inputClass} value={profile.country || ''} onChange={(e) => updateProfile('country', e.target.value)} autoComplete="shipping country-name" />
                          </Field>
                          <Field label="Postal code">
                            <input className={inputClass} value={profile.postal_code || ''} onChange={(e) => updateProfile('postal_code', e.target.value)} autoComplete="shipping postal-code" />
                          </Field>
                        </div>
                      </div>
                    )}

                    {currentStep.key === 'billing' && (
                      <div className="space-y-5">
                        <div>
                          <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-[#785A1A]">Step 04</p>
                          <h3 className="mt-2 font-headline text-[34px] leading-tight text-[#1A1A1A]">Save billing details.</h3>
                        </div>
                        <label className="flex items-start gap-3 border border-[#B0B0A8]/30 bg-[#F7F5EF] p-4">
                          <input
                            type="checkbox"
                            checked={sameAsProfile}
                            onChange={(e) => setSameAsProfile(e.target.checked)}
                            className="mt-1 h-4 w-4 accent-[#0F3A3A]"
                          />
                          <span className="font-body text-[13px] leading-6 text-[#4A4A4A]">
                            Use my delivery details for billing and checkout autofill.
                          </span>
                        </label>
                        {!sameAsProfile && (
                          <div className="space-y-4">
                            <Field label="Billing address">
                              <input className={inputClass} value={billing.address_line || ''} onChange={(e) => updateBilling('address_line', e.target.value)} autoComplete="billing street-address" />
                            </Field>
                            <div className="grid gap-4 sm:grid-cols-3">
                              <Field label="City">
                                <input className={inputClass} value={billing.city || ''} onChange={(e) => updateBilling('city', e.target.value)} autoComplete="billing address-level2" />
                              </Field>
                              <Field label="Country">
                                <input className={inputClass} value={billing.country || ''} onChange={(e) => updateBilling('country', e.target.value)} autoComplete="billing country-name" />
                              </Field>
                              <Field label="Postal code">
                                <input className={inputClass} value={billing.postal_code || ''} onChange={(e) => updateBilling('postal_code', e.target.value)} autoComplete="billing postal-code" />
                              </Field>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Motion.div>
                </AnimatePresence>

                {error && (
                  <div className="mt-4 border border-[#D94F4F]/20 bg-[#FAF2F2] px-4 py-3 font-body text-[13px] text-[#9F403D]">
                    {error}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                    disabled={stepIndex === 0 || saving}
                    className="border border-[#B0B0A8]/35 px-5 py-3 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#5E6058] transition-colors hover:bg-[#F5F4ED] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="bg-[#0F3A3A] px-6 py-3.5 font-label text-[9px] font-bold uppercase tracking-[0.18em] text-[#FBF9F4] transition-colors hover:bg-[#1A2F2F] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : stepIndex === steps.length - 1 ? 'Save Details' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileOnboarding;
