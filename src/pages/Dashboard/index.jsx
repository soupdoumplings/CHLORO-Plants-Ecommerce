import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import RecentOrders from './RecentOrders';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-10 lg:px-14 pb-20 mt-[82px] lg:mt-[100px]">
        <ProfileHeader />
        <ProfileDetails />
        <RecentOrders />
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
