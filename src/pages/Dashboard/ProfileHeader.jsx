import React from 'react';
import EditorialHero from '../../components/EditorialHero';
import { useAuth } from '../../lib/AuthContext';
import { productAssetImages } from '../../lib/localImages';

const ProfileHeader = () => {
  const { user } = useAuth();
  const fullName = user?.user_metadata?.full_name || user?.email || 'Member';
  const firstName = fullName.split(' ')[0];

  return (
    <EditorialHero
      eyebrow="Member Dashboard"
      title="Welcome Back,"
      italic={`${firstName}.`}
      copy="Review saved profile details, recent orders, wishlist signals, and plant-care preferences from one calm account space."
      image={productAssetImages.monstera}
      imageAlt="Monstera leaf detail"
      objectPosition="center"
      meta={[
        { label: 'Profile', value: 'Synced' },
        { label: 'Care', value: 'Personal' },
      ]}
    />
  );
};

export default ProfileHeader;
