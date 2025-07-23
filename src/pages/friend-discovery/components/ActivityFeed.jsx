import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ActivityFeed = ({ onUserClick }) => {
  const [activities] = useState([
    {
      id: 1,
      type: 'new_follower',
      user: {
        id: 101,
        username: 'fashion_forward_emma',
        displayName: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        styleMatch: 89
      },
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      message: 'started following you'
    },
    {
      id: 2,
      type: 'mutual_connection',
      user: {
        id: 102,
        username: 'streetstyle_jake',
        displayName: 'Jake Martinez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        styleMatch: 92
      },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      message: 'You have 3 mutual connections',
      mutualCount: 3
    },
    {
      id: 3,
      type: 'trending_user',
      user: {
        id: 103,
        username: 'vintage_collector_zoe',
        displayName: 'Zoe Chen',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        styleMatch: 85
      },
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      message: 'is trending in Vintage style',
      category: 'vintage'
    },
    {
      id: 4,
      type: 'style_match',
      user: {
        id: 104,
        username: 'minimalist_alex',
        displayName: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        styleMatch: 96
      },
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      message: 'has a 96% style match with you',
      isHighMatch: true
    },
    {
      id: 5,
      type: 'new_user',
      user: {
        id: 105,
        username: 'boho_chic_maya',
        displayName: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        styleMatch: 78
      },
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      message: 'just joined FashionSwipe',
      isNew: true
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_follower':
        return { name: 'UserPlus', color: 'text-success' };
      case 'mutual_connection':
        return { name: 'Users', color: 'text-primary' };
      case 'trending_user':
        return { name: 'TrendingUp', color: 'text-warning' };
      case 'style_match':
        return { name: 'Sparkles', color: 'text-secondary' };
      case 'new_user':
        return { name: 'Star', color: 'text-accent' };
      default:
        return { name: 'Bell', color: 'text-muted-foreground' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleUserClick = (user) => {
    onUserClick(user);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => {
          const iconConfig = getActivityIcon(activity.type);
          
          return (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 bg-card/50 rounded-lg hover:bg-card animation-spring cursor-pointer"
              onClick={() => handleUserClick(activity.user)}
            >
              {/* Activity Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center ${iconConfig.color}`}>
                <Icon name={iconConfig.name} size={16} />
              </div>

              {/* User Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={activity.user.avatar}
                    alt={activity.user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Special Badges */}
                {activity.isNew && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="Sparkles" size={8} className="text-accent-foreground" />
                  </div>
                )}
                
                {activity.isHighMatch && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="Heart" size={8} className="text-secondary-foreground" />
                  </div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground truncate">@{activity.user.username}</span>
                  {activity.user.styleMatch >= 90 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Zap" size={12} className="text-primary" />
                      <span className="text-xs text-primary font-medium">{activity.user.styleMatch}%</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{activity.message}</p>
                
                {/* Additional Info */}
                {activity.mutualCount && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Icon name="Users" size={12} className="text-primary" />
                    <span className="text-xs text-primary">{activity.mutualCount} mutual connections</span>
                  </div>
                )}
                
                {activity.category && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                      #{activity.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <div className="flex-shrink-0 text-right">
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center pt-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Load More Activity
        </Button>
      </div>
    </div>
  );
};

export default ActivityFeed;