import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserCard = ({ user, onFollow, onUnfollow }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow(user.id);
        setIsFollowing(false);
      } else {
        await onFollow(user.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = () => {
    navigate('/user-profile', { state: { userId: user.id } });
  };

  const handleMessage = () => {
    console.log('Message user:', user.id);
  };

  return (
    <div className="flex-shrink-0 w-72 bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            <Image
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success border-2 border-background rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">@{user.username}</h3>
          <p className="text-sm text-muted-foreground truncate">{user.displayName}</p>
          
          {/* Style Match Score */}
          <div className="flex items-center space-x-1 mt-1">
            <Icon name="Sparkles" size={14} className="text-primary" />
            <span className="text-sm font-medium text-primary">{user.styleMatch}% match</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1">
          <Icon name="Users" size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground font-mono">{user.followers}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Heart" size={14} className="text-error" />
          <span className="text-muted-foreground font-mono">{user.likes}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="TrendingUp" size={14} className="text-accent" />
          <span className="text-muted-foreground font-mono">{user.influence}</span>
        </div>
      </div>

      {/* Style Tags */}
      <div className="flex flex-wrap gap-1">
        {user.styleTags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
        {user.styleTags.length > 3 && (
          <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
            +{user.styleTags.length - 3}
          </span>
        )}
      </div>

      {/* Mutual Connections */}
      {user.mutualConnections > 0 && (
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {user.mutualAvatars?.slice(0, 3).map((avatar, index) => (
              <div key={index} className="w-6 h-6 rounded-full border-2 border-background overflow-hidden">
                <Image
                  src={avatar}
                  alt="Mutual connection"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Recent Activity Preview */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Recent activity:</p>
        <p className="text-sm text-foreground line-clamp-2">{user.recentActivity}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          onClick={handleFollowToggle}
          loading={isLoading}
          className="flex-1"
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewProfile}
          iconName="User"
          className="px-3"
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMessage}
          iconName="MessageCircle"
          className="px-3"
        />
      </div>
    </div>
  );
};

export default UserCard;