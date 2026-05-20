import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import { useAuth } from '../../lib/AuthContext';
import { SecurityLoading } from '../../components/Security';

const DashboardPage = () => {
  const { isAdmin } = useAuth();

  if (isAdmin === null) return <SecurityLoading />;
  if (isAdmin) return <Navigate to="/archive" replace />;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#FBF9F4] flex flex-col"
    >
      <Navbar />

      <main className="flex-grow w-full page-shell page-gutter pb-20 mt-[82px]">
        <ProfileHeader />
        <ProfileDetails />
      </main>

      <Footer />
    </Motion.div>
  );
};

export default DashboardPage;
