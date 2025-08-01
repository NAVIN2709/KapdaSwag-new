// src/pages/Profile/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // adjust path
import ProfileComponent from '../../components/ui/ProfileComponent';
import Loadingspinner from 'components/ui/Loadingspinner';

const Profile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setProfileData(userSnap.data());
        } else {
          console.warn('User not found');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <Loadingspinner />
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ProfileComponent profile={profileData} isOwnProfile={false} />
    </div>
  );
};

export default Profile;
