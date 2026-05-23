import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../supabase';

const inputClass = 'w-full border border-[#D9DBCF] bg-white px-4 py-3 font-body text-sm text-[#31332C] outline-none transition-colors focus:border-[#0F3A3A]';
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const readFileAsDataUrl = (file) => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected profile image.'));
    reader.readAsDataURL(file);
  })
);

const loadImage = (src) => (
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not prepare the selected profile image.'));
    image.src = src;
  })
);

const compressProfileImage = async (file) => {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const maxSize = 240;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Could not process the selected profile image.');
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.72);
};

const formatDate = (value) => {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en-NP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address_line: '',
    city: '',
    country: 'Nepal',
    avatar_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const adminName = useMemo(() => (
    profile.name || user?.user_metadata?.full_name || user?.email || 'Admin'
  ), [profile.name, user]);
  const hasEmbeddedAvatar = String(profile.avatar_url || '').startsWith('data:image/');

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
          .from('users')
          .select('name, email, phone, role, address_line, city, country, avatar_url, updated_at, created_at')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!active) return;

        setProfile({
          name: data?.name || user.user_metadata?.full_name || '',
          email: data?.email || user.email || '',
          phone: data?.phone || user.user_metadata?.phone || '',
          address_line: data?.address_line || '',
          city: data?.city || '',
          country: data?.country || 'Nepal',
          avatar_url: data?.avatar_url || '',
          role: data?.role || 'ADMIN',
          updated_at: data?.updated_at,
          created_at: data?.created_at,
        });
      } catch (err) {
        if (active) setError(err.message || 'Could not load admin profile.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      active = false;
    };
  }, [user]);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage('');
    setError('');
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!file.type.startsWith('image/') || !IMAGE_FILE_TYPES.includes(extension)) {
      setError('Please upload a JPG, PNG, WebP, or GIF profile image.');
      event.target.value = '';
      return;
    }

    try {
      setUploadingAvatar(true);
      setError('');
      setMessage('');

      const compressedImage = await compressProfileImage(file);
      updateField('avatar_url', compressedImage);
      setMessage('Profile picture ready. Click Save Profile to keep it.');
    } catch (err) {
      setError(err.message || 'Could not prepare admin profile image.');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const payload = {
        id: user.id,
        name: profile.name?.trim() || user.email?.split('@')[0] || 'Admin',
        email: user.email || profile.email,
        phone: profile.phone?.trim() || null,
        address_line: profile.address_line?.trim() || null,
        city: profile.city?.trim() || null,
        country: profile.country?.trim() || 'Nepal',
        avatar_url: profile.avatar_url?.trim() || null,
        role: 'ADMIN',
        updated_at: new Date().toISOString(),
      };

      const { error: saveError } = await supabase
        .from('users')
        .upsert(payload, { onConflict: 'id' });

      if (saveError) throw saveError;

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: payload.name,
          phone: payload.phone,
          avatar_url: null,
        },
      });

      if (metadataError) throw metadataError;

      setProfile((current) => ({ ...current, ...payload }));
      setMessage('Admin profile saved.');
    } catch (err) {
      setError(err.message || 'Could not save admin profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="page-shell page-gutter mt-[82px] flex-grow pb-20">
        <section className="border-b border-[#D9DBCF] py-16 lg:py-20">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#785A1A]">
            Admin Account
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-headline text-[54px] leading-none text-[#31332C] sm:text-[70px]">
                {adminName}
              </h1>
              <p className="mt-5 max-w-2xl font-body text-base leading-7 text-[#5E6058]">
                Manage the signed-in admin profile used for CHLORO archive, inventory, promotions, and order operations.
              </p>
            </div>
            <Link
              to="/archive"
              className="inline-flex items-center justify-center gap-2 bg-[#0F3A3A] px-6 py-4 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#31332C]"
            >
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              Back to Admin
            </Link>
          </div>
        </section>

        <section className="grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="border border-[#D9DBCF] bg-white p-7 shadow-xl shadow-black/5">
            <div className="mb-7 flex items-center gap-5 border-b border-[#D9DBCF] pb-7">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#D9DBCF] bg-[#F5F4ED]">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={adminName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="material-symbols-outlined text-[30px] text-[#0F3A3A]/55">person</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#797C73]">Signed in as</p>
                <p className="mt-1 truncate font-headline text-2xl text-[#31332C]">{adminName}</p>
              </div>
            </div>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#785A1A]">
              Access Summary
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#797C73]">Role</p>
                <p className="mt-1 font-headline text-2xl text-[#31332C]">{profile.role || 'ADMIN'}</p>
              </div>
              <div>
                <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#797C73]">Email</p>
                <p className="mt-1 font-body text-sm text-[#31332C]">{profile.email || user?.email}</p>
              </div>
              <div>
                <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#797C73]">Created</p>
                <p className="mt-1 font-body text-sm text-[#31332C]">{formatDate(profile.created_at || user?.created_at)}</p>
              </div>
              <div>
                <p className="font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#797C73]">Updated</p>
                <p className="mt-1 font-body text-sm text-[#31332C]">{formatDate(profile.updated_at)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 flex w-full items-center justify-center gap-2 border border-[#31332C]/20 px-5 py-3 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Logout
            </button>
          </aside>

          <form onSubmit={handleSave} className="border border-[#D9DBCF] bg-white p-7 shadow-xl shadow-black/5 lg:p-9">
            <div className="border-b border-[#D9DBCF] pb-6">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#785A1A]">
                Profile Details
              </p>
              <h2 className="mt-2 font-headline text-4xl text-[#31332C]">Admin Profile</h2>
            </div>

            {loading ? (
              <div className="py-12 text-center font-label text-[10px] uppercase tracking-[0.18em] text-[#5E6058]">
                Loading profile...
              </div>
            ) : (
              <div className="mt-7 grid gap-5">
                <div className="grid gap-4 border border-[#D9DBCF] bg-[#FBF9F4] p-4 sm:grid-cols-[72px_1fr] sm:items-center">
                  <div className="h-[72px] w-[72px] overflow-hidden rounded-full border border-[#D9DBCF] bg-white shadow-sm">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={adminName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="material-symbols-outlined text-[26px] text-[#0F3A3A]/45">add_a_photo</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">Profile Picture</span>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 border border-[#31332C]/20 bg-white px-4 py-2.5 font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#31332C] transition-colors hover:bg-[#31332C] hover:text-white">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        {uploadingAvatar ? 'Uploading...' : 'Upload Picture'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                          className="sr-only"
                        />
                      </label>
                      {profile.avatar_url && (
                        <button
                          type="button"
                          onClick={() => updateField('avatar_url', '')}
                          className="min-h-10 border border-[#9F403D]/20 bg-white px-4 py-2.5 font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#9F403D] transition-colors hover:bg-[#9F403D] hover:text-white"
                        >
                          Remove
                        </button>
                      )}
                      {profile.avatar_url && !hasEmbeddedAvatar && (
                        <a href={profile.avatar_url} target="_blank" rel="noreferrer" className="font-body text-xs text-[#785A1A] underline-offset-4 hover:underline">
                          Open image
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <label>
                  <span className="mb-2 block font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">Name</span>
                  <input value={profile.name || ''} onChange={(event) => updateField('name', event.target.value)} className={inputClass} />
                </label>
                <label>
                  <span className="mb-2 block font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">Email</span>
                  <input value={profile.email || user?.email || ''} className={`${inputClass} opacity-65`} disabled />
                </label>
                <label>
                  <span className="mb-2 block font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">Phone</span>
                  <input value={profile.phone || ''} onChange={(event) => updateField('phone', event.target.value)} className={inputClass} />
                </label>
                <label>
                  <span className="mb-2 block font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">Address</span>
                  <input value={profile.address_line || ''} onChange={(event) => updateField('address_line', event.target.value)} className={inputClass} />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">City</span>
                    <input value={profile.city || ''} onChange={(event) => updateField('city', event.target.value)} className={inputClass} />
                  </label>
                  <label>
                    <span className="mb-2 block font-label text-[9px] font-bold uppercase tracking-[0.16em] text-[#5E6058]">Country</span>
                    <input value={profile.country || ''} onChange={(event) => updateField('country', event.target.value)} className={inputClass} />
                  </label>
                </div>

                {(message || error) && (
                  <p className={`font-body text-sm ${error ? 'text-[#9F403D]' : 'text-[#0F3A3A]'}`}>
                    {error || message}
                  </p>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="submit"
                    disabled={saving || uploadingAvatar}
                    className="bg-[#31332C] px-6 py-4 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0F3A3A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploadingAvatar ? 'Uploading...' : saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </section>
      </main>

      <Footer />
    </Motion.div>
  );
};

export default AdminProfilePage;
