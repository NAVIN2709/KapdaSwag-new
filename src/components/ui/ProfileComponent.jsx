import React, { useState } from 'react';
import { FaInstagram, FaSnapchatGhost, FaArrowLeft, FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileComponent = ({ profile, isOwnProfile = false }) => {
  const [followState, setFollowState] = useState('unfollowed'); // 'unfollowed' | 'requested' | 'following'
  const navigate = useNavigate();

  const handleFollow = () => {
    if (followState === 'unfollowed') setFollowState('requested');
    else if (followState === 'requested') setFollowState('following');
    else setFollowState('unfollowed');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-300 hover:text-white mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {/* Avatar + Info */}
      <div className="text-center space-y-4">
        <img
          src={profile.avatar || 'https://i.pravatar.cc/150?img=12'}
          className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-pink-500"
          alt="Profile"
        />

        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-gray-400 text-sm">@{profile.username}</p>
        </div>

        {/* Edit or Follow Button */}
        {isOwnProfile ? (
          <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl font-medium text-white flex items-center gap-2 mx-auto">
            <FaPen />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              followState === 'unfollowed'
                ? 'bg-pink-600 hover:bg-pink-700'
                : followState === 'requested'
                ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          >
            {followState === 'unfollowed'
              ? 'Follow'
              : followState === 'requested'
              ? 'Requested'
              : 'Unfollow'}
          </button>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="mt-6 text-center text-gray-200 px-4">
          {profile.bio}
        </p>
      )}

      {/* Tags */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {profile.styles?.map((style, idx) => (
          <span
            key={idx}
            className="bg-[#1e293b] text-white border border-gray-600 px-3 py-1 text-sm rounded-full"
          >
            #{style.toLowerCase()}
          </span>
        ))}
      </div>

      {/* Socials */}
      <div className="mt-6 flex justify-center gap-6 text-2xl text-pink-400">
        {profile.instagram && (
          <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer">
            <FaInstagram className="hover:text-pink-500 transition" />
          </a>
        )}
        {profile.snapchat && (
          <a href={`https://snapchat.com/add/${profile.snapchat}`} target="_blank" rel="noreferrer">
            <FaSnapchatGhost className="hover:text-yellow-400 transition" />
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent;
