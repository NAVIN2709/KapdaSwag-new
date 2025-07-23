import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ActivityFeed = ({ activities, onLoadMore }) => {
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Activity', icon: 'Activity' },
    { id: 'likes', label: 'Likes', icon: 'Heart' },
    { id: 'saves', label: 'Saves', icon: 'Bookmark' },
    { id: 'follows', label: 'Follows', icon: 'UserPlus' },
    { id: 'comments', label: 'Comments', icon: 'MessageCircle' }
  ];

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'likes': return 'Heart';
      case 'saves': return 'Bookmark';
      case 'follows': return 'UserPlus';
      case 'comments': return 'MessageCircle';
      case 'posts': return 'Image';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'likes': return 'text-error';
      case 'saves': return 'text-warning';
      case 'follows': return 'text-primary';
      case 'comments': return 'text-accent';
      case 'posts': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Icon name="Activity" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Activity Yet</h3>
        <p className="text-muted-foreground text-center">
          Start engaging with the community to see your activity here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium animation-spring whitespace-nowrap
                ${filter === filterItem.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={filterItem.icon} size={16} />
              <span>{filterItem.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="p-4 space-y-4">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-card rounded-xl border border-border">
            {/* Activity Icon */}
            <div className={`w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={16} />
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm">
                    <span className="font-medium">You</span> {activity.action}
                    {activity.target && (
                      <span className="font-medium"> {activity.target}</span>
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>

                {/* Activity Thumbnail */}
                {activity.thumbnail && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/20 flex-shrink-0 ml-3">
                    <Image
                      src={activity.thumbnail}
                      alt="Activity thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Activity Details */}
              {activity.details && (
                <div className="mt-2 p-2 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground text-xs">
                    {activity.details}
                  </p>
                </div>
              )}

              {/* Engagement Stats */}
              {activity.engagement && (
                <div className="flex items-center space-x-4 mt-2">
                  {activity.engagement.likes > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={12} className="text-error" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {activity.engagement.likes}
                      </span>
                    </div>
                  )}
                  {activity.engagement.comments > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={12} className="text-primary" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {activity.engagement.comments}
                      </span>
                    </div>
                  )}
                  {activity.engagement.shares > 0 && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Share" size={12} className="text-accent" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {activity.engagement.shares}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Load More */}
        {filteredActivities.length >= 10 && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" iconName="Plus" iconPosition="left" onClick={onLoadMore}>
              Load More Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;