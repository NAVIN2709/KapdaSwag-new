import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, isOwnProfile, onEditProfile, onFollow, onMessage }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    onFollow(!isFollowing);
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
          {user.isOnline && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-success border-2 border-background rounded-full"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-xl font-bold text-foreground truncate">{user.name}</h1>
            {user.isVerified && (
              <Icon name="BadgeCheck" size={20} className="text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-muted-foreground mb-2">@{user.username}</p>
          
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground font-mono">{user.followersCount}</span>
              <span className="text-muted-foreground">followers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground font-mono">{user.followingCount}</span>
              <span className="text-muted-foreground">following</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-foreground font-mono">{user.postsCount}</span>
              <span className="text-muted-foreground">posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mb-4">
        {isOwnProfile ? (
          <Button
            variant="outline"
            className="flex-1"
            iconName="Edit"
            iconPosition="left"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              variant={isFollowing ? "outline" : "default"}
              className="flex-1"
              iconName={isFollowing ? "UserMinus" : "UserPlus"}
              iconPosition="left"
              onClick={handleFollowClick}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button
              variant="outline"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={onMessage}
            >
              Message
            </Button>
          </>
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