import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SuggestedUsers = ({ onUserClick, onFollow }) => {
  const [suggestions] = useState([
    {
      id: 201,
      username: 'thrift_queen_sarah',
      displayName: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      followers: '24.3K',
      styleMatch: 94,
      styleTags: ['thrift', 'vintage', 'sustainable'],
      mutualConnections: 8,
      recentActivity: 'Posted a vintage denim haul that got 2.1K likes',
      reason: 'High style compatibility',
      isVerified: true,
      isFollowing: false
    },
    {
      id: 202,
      username: 'streetwear_king_marcus',
      displayName: 'Marcus Williams',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      followers: '18.7K',
      styleMatch: 91,
      styleTags: ['streetwear', 'sneakers', 'urban'],
      mutualConnections: 12,
      recentActivity: 'Shared a sneaker collection review',
      reason: 'Popular in your network',
      isVerified: false,
      isFollowing: false
    },
    {
      id: 203,
      username: 'minimalist_grace',
      displayName: 'Grace Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      followers: '31.2K',
      styleMatch: 88,
      styleTags: ['minimalist', 'clean', 'modern'],
      mutualConnections: 5,
      recentActivity: 'Created a capsule wardrobe guide',
      reason: 'Trending creator',
      isVerified: true,
      isFollowing: false
    },
    {
      id: 204,
      username: 'boho_vibes_luna',
      displayName: 'Luna Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      followers: '15.9K',
      styleMatch: 85,
      styleTags: ['boho', 'flowy', 'earthy'],
      mutualConnections: 3,
      recentActivity: 'Showcased handmade jewelry collection',
      reason: 'Similar interests',
      isVerified: false,
      isFollowing: false
    }
  ]);

  const [followingStates, setFollowingStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  const handleFollow = async (userId) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    
    try {
      await onFollow(userId);
      setFollowingStates(prev => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error('Follow failed:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getReasonIcon = (reason) => {
    switch (reason) {
      case 'High style compatibility':
        return { name: 'Sparkles', color: 'text-primary' };
      case 'Popular in your network':
        return { name: 'Users', color: 'text-success' };
      case 'Trending creator':
        return { name: 'TrendingUp', color: 'text-warning' };
      case 'Similar interests':
        return { name: 'Heart', color: 'text-secondary' };
      default:
        return { name: 'Star', color: 'text-accent' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Suggested for You</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {suggestions.map((user) => {
          const reasonIcon = getReasonIcon(user.reason);
          const isFollowing = followingStates[user.id] || user.isFollowing;
          const isLoading = loadingStates[user.id];

          return (
            <div
              key={user.id}
              className="bg-card border border-border rounded-xl p-4 space-y-4 hover:border-primary/20 animation-spring"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div 
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                  onClick={() => onUserClick(user)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Check" size={10} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">@{user.username}</h4>
                    <p className="text-sm text-muted-foreground truncate">{user.displayName}</p>
                    
                    {/* Style Match */}
                    <div className="flex items-center space-x-1 mt-1">
                      <Icon name="Sparkles" size={12} className="text-primary" />
                      <span className="text-xs text-primary font-medium">{user.styleMatch}% match</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant={isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleFollow(user.id)}
                  loading={isLoading}
                  disabled={isFollowing}
                  className="ml-3"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground font-mono">{user.followers}</span>
                  </div>
                  
                  {user.mutualConnections > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="UserCheck" size={14} className="text-primary" />
                      <span className="text-primary text-xs">{user.mutualConnections} mutual</span>
                    </div>
                  )}
                </div>

                {/* Suggestion Reason */}
                <div className="flex items-center space-x-1">
                  <Icon name={reasonIcon.name} size={12} className={reasonIcon.color} />
                  <span className={`text-xs ${reasonIcon.color}`}>{user.reason}</span>
                </div>
              </div>

              {/* Style Tags */}
              <div className="flex flex-wrap gap-1">
                {user.styleTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Recent activity:</p>
                <p className="text-sm text-foreground">{user.recentActivity}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUserClick(user)}
                  iconName="User"
                  iconPosition="left"
                  className="flex-1 text-xs"
                >
                  View Profile
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="flex-1 text-xs"
                >
                  Message
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center pt-2">
        <Button variant="outline" size="sm">
          Show More Suggestions
        </Button>
      </div>
    </div>
  );
};

export default SuggestedUsers;