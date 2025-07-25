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
      styleMatch: 94,
      styleTags: ['thrift', 'vintage', 'sustainable'],
    },
    {
      id: 202,
      username: 'streetwear_king_marcus',
      displayName: 'Marcus Williams',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      styleMatch: 91,
      styleTags: ['streetwear', 'sneakers', 'urban'],
    },
    {
      id: 203,
      username: 'minimalist_grace',
      displayName: 'Grace Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      styleMatch: 88,
      styleTags: ['minimalist', 'clean', 'modern'],
    },
    {
      id: 204,
      username: 'boho_vibes_luna',
      displayName: 'Luna Rodriguez',
      styleMatch: 85,
      styleTags: ['boho', 'flowy', 'earthy'],
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
          const isFriends = followingStates[user.id] || user.isFriends;
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
                  </div>
                </div>

                <Button
                  variant={isFriends ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleFollow(user.id)}
                  loading={isLoading}
                  disabled={isFriends}
                  className="ml-3"
                >
                  Request
                </Button>
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