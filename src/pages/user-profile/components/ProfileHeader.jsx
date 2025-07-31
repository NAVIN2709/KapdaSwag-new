import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { FaInstagram, FaSnapchatGhost } from "react-icons/fa";
import { useAuth } from "context/AuthContext";

const ProfileHeader = ({
  user,
  isOwnProfile,
  onEditProfile,
  onFollow,
  onMessage,
}) => {
  const [isFriends, setIsFollowing] = useState(user.isFriends || false);
  const { logout } = useAuth();

  const handleFollowClick = () => {
    setIsFollowing(!isFriends);
    onFollow(!isFriends);
  };

  return (
    <div className="bg-card border-b border-border p-4">
      {/* Avatar and Basic Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
            <Image
              src={user.profilePic}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-xl font-bold text-foreground truncate">
              {user.name}
            </h1>
          </div>
          <p className="text-muted-foreground mb-2">@{user.username}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mb-4">
        {isOwnProfile ? (
          <Button
            variant="default"
            className="flex-1"
            iconName="Edit"
            iconPosition="left"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        ) : isFriends ? (
          <>
            <Button
              variant="outline"
              className="flex-1"
              iconName="UserMinus"
              iconPosition="left"
              onClick={handleFollowClick}
            >
              Remove
            </Button>
            <Button
              variant="default"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={onMessage}
            >
              Message
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            className="flex-1"
            iconName="UserPlus"
            iconPosition="left"
            onClick={handleFollowClick}
          >
            Request
          </Button>
        )}
        {/* Logout button */}
        {isOwnProfile && (
          <div className="flex justify-center">
            <Button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium"
            >
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-4">
          <p className="text-foreground leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Style Tags */}
      {user.interests && user.interests.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {user.interests.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Social Links */}
      {(user.instagram || user.snapchat) && (
        <div className="mb-4">
          <div className="flex items-center space-x-4 text-muted-foreground">
            {user.instagram && (
              <a
                href={`https://instagram.com/${user.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 hover:text-pink-500 transition"
              >
                <FaInstagram className="w-4 h-4" />
                <span className="text-sm">@{user.instagram}</span>
              </a>
            )}
            {user.snapchat && (
              <a
                href={`https://snapchat.com/add/${user.snapchat}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 hover:text-yellow-500 transition"
              >
                <FaSnapchatGhost className="w-4 h-4" />
                <span className="text-sm">@{user.snapchat}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
