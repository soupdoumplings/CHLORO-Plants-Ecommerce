import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';
import profileImg from '../../assets/profile-photo.png';
import RecentOrders from './RecentOrders';
import PreferenceSettings from '../../components/PreferenceSettings';
import PlantRecommendations from '../../components/PlantRecommendations';
import {
  emptyBillingDetails,
  emptyCustomerProfile,
  formatAddress,
  getAuthFullName,
  getCustomerProfile,
  upsertCustomerProfile,
} from '../../lib/customerProfile';

const inputClass = 'border-b border-[#B0B0A8]/40 bg-transparent px-1 py-3.5 font-body text-[15px] text-[#1A1A1A] outline-none transition-colors focus:border-[#1A1A1A]';

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-2.5">
    <label className="font-label text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4A4A4A]">
      {label}
    </label>
    {children}
  </div>
);

const accountTabs = [
  { id: 'details', label: 'My Details', eyebrow: 'Profile & billing' },
  { id: 'preferences', label: 'My Preferences', eyebrow: 'Care taste' },
  { id: 'orders', label: 'Orders & Wishlist', eyebrow: 'Purchases' },
];

const validTabIds = accountTabs.map((tab) => tab.id);

const ProfileDetails = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(user?.user_metadata?.avatar_url || profileImg);
  const [profile, setProfile] = useState(emptyCustomerProfile);
  const [billing, setBilling] = useState(emptyBillingDetails);
  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = searchParams.get('tab');
    return validTabIds.includes(requestedTab) ? requestedTab : 'details';
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);
      setError('');

      try {
        const result = await getCustomerProfile(user);
        if (!active) return;
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
      } catch (err) {
        setError(err.message || 'Could not load your saved details.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) setAvatar(user.user_metadata.avatar_url);
  }, [user]);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (validTabIds.includes(requestedTab) && requestedTab !== activeTab) {
      setActiveTab(requestedTab);
    }
  }, [activeTab, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const next = new URLSearchParams(searchParams);
    if (tabId === 'details') next.delete('tab');
    else next.set('tab', tabId);
    setSearchParams(next, { replace: true });
  };

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    if (['full_name', 'phone', 'address_line', 'city', 'country', 'postal_code'].includes(field)) {
      setBilling((current) => ({
        ...current,
        [field === 'address_line' ? 'address_line' : field]: value,
        full_name: field === 'full_name' ? value : current.full_name,
        phone: field === 'phone' ? value : current.phone,
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Logout failed.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > 360) {
          height = Math.round((height * 360) / width);
          width = 360;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        setAvatar(canvas.toDataURL('image/jpeg', 0.65));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await upsertCustomerProfile({
        user,
        profile: {
          ...profile,
          avatar_url: avatar,
        },
        billing: {
          ...billing,
          full_name: profile.full_name,
          phone: profile.phone,
          email: user.email || billing.email,
          address_line: billing.address_line || profile.address_line,
          city: billing.city || profile.city,
          country: billing.country || profile.country,
          postal_code: billing.postal_code || profile.postal_code,
        },
      });
      setMessage('Profile and billing details saved.');
    } catch (err) {
      setError(err.message || 'Could not save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20"
    >
      <div className="flex flex-col gap-8 lg:col-span-4 xl:col-span-3">
        <div className="group relative aspect-[4/5] w-full overflow-hidden bg-[#EDEBE4]">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <img src={avatar} alt="Member profile" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-white/85 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            aria-label="Upload profile photo"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4A4A4A]">photo_camera</span>
          </button>
        </div>

        <div className="bg-[#EDEBE4] p-7 lg:p-8">
          <h3 className="mb-4 font-headline text-[22px] leading-snug text-[#1A1A1A]">Saved Checkout</h3>
          <p className="mb-6 font-body text-[14px] leading-relaxed text-[#6B6B6B]">
            These details are reused during checkout so returning customers do not retype billing information.
          </p>
          <div className="border-t border-[#B0B0A8]/25 pt-4">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6B6B6B]">Default address</p>
            <p className="mt-2 font-body text-sm leading-6 text-[#31332C]">
              {formatAddress({
                address_line: profile.address_line,
                city: profile.city,
                country: profile.country,
                postal_code: profile.postal_code,
              }) || 'Not saved yet'}
            </p>
          </div>
          <Link to="/orders" className="mt-6 inline-flex items-center gap-2 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F3A3A]">
            My Orders
            <span className="material-symbols-outlined text-[16px]">east</span>
          </Link>
        </div>
      </div>

      <div className="lg:col-span-8 xl:col-span-9">
        <div className="mb-6 grid grid-cols-1 gap-2 border border-[#B0B0A8]/15 bg-white p-2 shadow-sm sm:grid-cols-3">
          {accountTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`group px-5 py-4 text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#31332C] text-[#FBF9F4]'
                  : 'text-[#31332C] hover:bg-[#F5F4ED]'
              }`}
            >
              <span className={`block font-label text-[9px] font-bold uppercase tracking-[0.2em] ${
                activeTab === tab.id ? 'text-[#D8B56D]' : 'text-[#785A1A]'
              }`}>
                {tab.eyebrow}
              </span>
              <span className="mt-1 block font-headline text-[24px] leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <Motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="border border-[#B0B0A8]/15 bg-white p-8 shadow-sm lg:p-12 xl:p-14"
          >
            <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-headline text-[30px] leading-none text-[#1A1A1A] lg:text-[34px]">Profile & Billing</h2>
                <p className="mt-3 font-body text-[15px] text-[#6B6B6B]">
                  Edit saved account and checkout details.
                </p>
              </div>
              <Link to="/wishlist" className="font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#785A1A] underline underline-offset-4">
                Open Wishlist
              </Link>
            </div>

            {loading ? (
              <div className="py-10 font-label text-[10px] uppercase tracking-[0.2em] text-[#5E6058]">Loading profile...</div>
            ) : (
              <>
                <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <Field label="Full Name">
                    <input type="text" value={profile.full_name || ''} onChange={(e) => updateProfile('full_name', e.target.value)} className={inputClass} autoComplete="name" />
                  </Field>
                  <Field label="Username">
                    <input type="text" value={profile.username || ''} onChange={(e) => updateProfile('username', e.target.value)} className={inputClass} autoComplete="username" />
                  </Field>
                  <Field label="Email Address">
                    <input type="email" value={user?.email || billing.email || ''} className={`${inputClass} opacity-65`} disabled />
                  </Field>
                  <Field label="Phone Number">
                    <input type="tel" value={profile.phone || ''} onChange={(e) => updateProfile('phone', e.target.value)} className={inputClass} autoComplete="tel" />
                  </Field>
                  <Field label="Address">
                    <input type="text" value={profile.address_line || ''} onChange={(e) => updateProfile('address_line', e.target.value)} className={inputClass} autoComplete="shipping street-address" />
                  </Field>
                  <Field label="City">
                    <input type="text" value={profile.city || ''} onChange={(e) => updateProfile('city', e.target.value)} className={inputClass} autoComplete="shipping address-level2" />
                  </Field>
                  <Field label="Country">
                    <input type="text" value={profile.country || ''} onChange={(e) => updateProfile('country', e.target.value)} className={inputClass} autoComplete="shipping country-name" />
                  </Field>
                  <Field label="Postal Code">
                    <input type="text" value={profile.postal_code || ''} onChange={(e) => updateProfile('postal_code', e.target.value)} className={inputClass} autoComplete="shipping postal-code" />
                  </Field>
                </div>

                {(message || error) && (
                  <div className={`mb-6 border px-4 py-3 font-body text-[14px] ${error ? 'border-[#D94F4F]/20 bg-[#FAF2F2] text-[#9F403D]' : 'border-[#C6E9E9] bg-[#C6E9E9]/25 text-[#244545]'}`}>
                    {error || message}
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Motion.button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#4A4A4A] px-8 py-4 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F9F7F2] shadow-sm transition-colors hover:bg-[#1A1A1A] disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Details'}
                  </Motion.button>
                  <Motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="border border-[#B0B0A8]/40 px-8 py-4 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B] transition-colors hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F9F7F2]"
                  >
                    Sign Out
                  </Motion.button>
                </div>
              </>
            )}
          </Motion.div>
        )}

        {activeTab === 'preferences' && (
          <Motion.div
            key="preferences"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <PreferenceSettings />
            <PlantRecommendations surface="dashboard" />
          </Motion.div>
        )}

        {activeTab === 'orders' && (
          <Motion.div
            key="orders"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <RecentOrders />
          </Motion.div>
        )}
      </div>
    </Motion.section>
  );
};

export default ProfileDetails;
