import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import profileImg from '../../assets/profile-photo.png';
import RecentOrders from './RecentOrders';

const ProfileDetails = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const fullName = user?.user_metadata?.full_name || '';
  const email = user?.email || '';

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start"
    >
      {/* ── Left Column: Photo + Curator Status ── */}
      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-8">
        {/* Profile Photo */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EDEBE4] group">
          <img
            src={profileImg}
            alt="Member profile"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* Camera overlay button */}
          <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all duration-300 group/btn">
            <span className="material-symbols-outlined text-[18px] text-[#4A4A4A] group-hover/btn:text-[#1A1A1A] transition-colors">
              photo_camera
            </span>
          </button>
        </div>

        {/* Curator Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#EDEBE4] p-7 lg:p-8 w-full"
        >
          <h3 className="font-headline text-[20px] text-[#1A1A1A] mb-4 leading-snug">
            Curator Status
          </h3>
          <p className="font-body text-[12px] text-[#6B6B6B] leading-relaxed mb-6">
            You have been part of Chloro for two seasons. Your botanical collection has reached{' '}
            <span className="text-[#1A1A1A] font-medium">'Lite Bloom'</span> status.
          </p>
          <div className="flex justify-between items-center pt-4 border-t border-[#B0B0A8]/20">
            <span className="font-label text-[9px] tracking-[0.15em] uppercase text-[#6B6B6B] font-semibold">
              Points
            </span>
            <span className="font-headline text-[18px] text-[#C5A059] tracking-tight">
              1,490
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Right Column: Personal Details Form ── */}
      <div className="lg:col-span-8 xl:col-span-9">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-8 lg:p-12 xl:p-14 border border-[#B0B0A8]/15 shadow-sm"
        >
          <h2 className="font-headline text-[28px] lg:text-[32px] text-[#1A1A1A] mb-2 leading-none">
            Personal Details
          </h2>
          <p className="font-body text-[13px] text-[#6B6B6B] mb-10">
            Update your identity and botanical preferences.
          </p>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Full Name */}
            <div className="flex flex-col gap-2.5">
              <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={fullName}
                className="border-b border-[#B0B0A8]/40 bg-transparent px-1 py-3 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2.5">
              <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={email}
                className="border-b border-[#B0B0A8]/40 bg-transparent px-1 py-3 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2.5">
              <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
                Location
              </label>
              <input
                type="text"
                defaultValue="London, United Kingdom"
                className="border-b border-[#B0B0A8]/40 bg-transparent px-1 py-3 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>

            {/* Botanical Interest */}
            <div className="flex flex-col gap-2.5">
              <label className="font-label text-[9px] tracking-[0.15em] uppercase text-[#4A4A4A] font-semibold">
                Botanical Interest
              </label>
              <div className="relative">
                <select
                  defaultValue="tropical"
                  className="w-full appearance-none border-b border-[#B0B0A8]/40 bg-transparent px-1 py-3 font-body text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer pr-8"
                >
                  <option value="tropical">Tropical &amp; Lush</option>
                  <option value="arid">Arid &amp; Sculptural</option>
                  <option value="temperate">Temperate &amp; Seasonal</option>
                  <option value="rare">Rare Specimens</option>
                </select>
                <span className="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-[16px] text-[#B0B0A8] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 mt-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#4A4A4A] text-[#F9F7F2] py-4 px-10 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1A1A1A] transition-all duration-300 shadow-sm"
            >
              Save Profile Changes
            </motion.button>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="border border-[#B0B0A8]/40 text-[#6B6B6B] py-4 px-10 font-label text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#1A1A1A] hover:text-[#F9F7F2] hover:border-[#1A1A1A] transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">logout</span>
                Sign Out
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabbed Orders Section underneath Personal Details */}
        <RecentOrders />
      </div>
    </motion.section>
  );
};

export default ProfileDetails;
