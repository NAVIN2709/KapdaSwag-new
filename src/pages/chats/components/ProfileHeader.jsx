import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Or use an emoji/icon instead

const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 p-3 border-b shadow-sm">
      <button
        onClick={() => navigate('/friend-discovery')}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        <ArrowLeft size={20} />
      </button>

      <img
        src={user.profilePicture}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />

      <span className="font-medium text-lg">{user.username}</span>
    </div>
  );
};

export default ProfileHeader;
