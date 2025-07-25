import React from 'react';
import ProfileComponent from '../../components/ui/ProfileComponent'; // Adjust the path if needed

const Profile = () => {
  return (
    <div className="p-4">
      <ProfileComponent
        profile={{
          name: 'Ava Kapoor',
          username: 'ava_swagg',
          instagram: 'ava_insta',
          snapchat: 'ava_snap',
          styles: ['Y2K', 'Streetwear', 'Boho'],
          avatar: 'https://i.pravatar.cc/150?img=36',
        }}
      />
    </div>
  );
};

export default Profile;
