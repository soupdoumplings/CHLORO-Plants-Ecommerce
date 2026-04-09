import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';

const ProfileHeader = () => {
  const { user } = useAuth();
  const fullName = user?.user_metadata?.full_name || user?.email || 'Member';
  const firstName = fullName.split(' ')[0];

  return (
    <div className="pt-24 pb-10 lg:pt-32 lg:pb-14">
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-label text-[9px] tracking-[0.2em] uppercase text-[#C5A059] font-medium mb-5"
      >
        Member Dashboard
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="font-headline text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.92] tracking-tight text-[#1A1A1A]"
      >
        Welcome back, <em>{firstName}.</em>
      </motion.h1>
    </div>
  );
};

export default ProfileHeader;
