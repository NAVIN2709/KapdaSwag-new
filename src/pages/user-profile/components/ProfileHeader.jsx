import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, isOwnProfile, onEditProfile, onFollow, onMessage }) => {
  const [isFriends, setIsFollowing] = useState(user.isFriends || false);

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
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-xl font-bold text-foreground truncate">{user.name}</h1>
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
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-4">
          <p className="text-foreground leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Style Tags */}
      {user.styleTags && user.styleTags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {user.styleTags.map((tag, index) => (
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

      {/* Drip Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Droplets" size={20} className="text-primary" />
            <span className="text-sm text-muted-foreground">Drip Rating</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-primary font-mono">{user.dripRating}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-accent" />
          <span className="text-sm text-muted-foreground">Vibe: {user.vibeScore}</span>
        </div>
      </div>

      {/* Achievement Badges */}
      {user.badges && user.badges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Award" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Achievements</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning text-xs rounded-full border border-warning/20"
              >
                <Icon name={badge.icon} size={12} />
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
