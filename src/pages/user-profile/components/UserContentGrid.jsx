import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserContentGrid = ({ content, onContentClick }) => {
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All', icon: 'Grid3X3' },
    { id: 'reviews', label: 'Reviews', icon: 'MessageCircle' },
    { id: 'posts', label: 'Posts', icon: 'Image' },
    { id: 'videos', label: 'Videos', icon: 'Play' }
  ];

  const filteredContent = content.filter(item => 
    filter === 'all' || item.type === filter
  );

  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Icon name="Camera" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Content Yet</h3>
        <p className="text-muted-foreground text-center mb-6">
          Share your style with the community by posting reviews and fashion content.
        </p>
        <Button variant="default" iconName="Plus" iconPosition="left">
          Create Content
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex space-x-1">
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium animation-spring
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

      {/* Content Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              onClick={() => onContentClick(item)}
              className="relative bg-card rounded-xl overflow-hidden border border-border cursor-pointer animation-spring hover:scale-[1.02] hover:shadow-lg"
            >
              {/* Content Image/Thumbnail */}
              <div className="aspect-square bg-muted/20 relative overflow-hidden">
                <Image
                  src={item.thumbnail || item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Content Type Indicator */}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={
                        item.type === 'videos' ? 'Play' :
                        item.type === 'reviews'? 'MessageCircle' : 'Image'
                      } 
                      size={12} 
                    />
                    <span className="text-xs capitalize">{item.type.slice(0, -1)}</span>
                  </div>
                </div>

                {/* Video Duration */}
                {item.type === 'videos' && item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                    <span className="text-xs font-mono">{item.duration}</span>
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                    <Icon name="Heart" size={12} className="text-error" />
                    <span className="text-xs font-mono">{item.likes}</span>
                  </div>
                  {item.comments > 0 && (
                    <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                      <Icon name="MessageCircle" size={12} className="text-primary" />
                      <span className="text-xs font-mono">{item.comments}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Info */}
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.createdAt}
                  </span>
                  {item.isPopular && (
                    <div className="flex items-center space-x-1">
                      <Icon name="TrendingUp" size={12} className="text-accent" />
                      <span className="text-xs text-accent">Trending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredContent.length >= 10 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" iconName="Plus" iconPosition="left">
              Load More Content
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContentGrid;