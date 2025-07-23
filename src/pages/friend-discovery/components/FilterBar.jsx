import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterBar = ({ onFilterChange, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = [
    {
      id: 'all',
      label: 'All',
      icon: 'Users',
      count: 1247
    },
    {
      id: 'streetwear',
      label: 'Streetwear',
      icon: 'Shirt',
      count: 342
    },
    {
      id: 'vintage',
      label: 'Vintage',
      icon: 'Clock',
      count: 189
    },
    {
      id: 'minimalist',
      label: 'Minimalist',
      icon: 'Circle',
      count: 156
    },
    {
      id: 'luxury',
      label: 'Luxury',
      icon: 'Crown',
      count: 98
    },
    {
      id: 'sustainable',
      label: 'Sustainable',
      icon: 'Leaf',
      count: 234
    }
  ];

  const locationFilters = [
    { id: 'nearby', label: 'Nearby', icon: 'MapPin' },
    { id: 'global', label: 'Global', icon: 'Globe' }
  ];

  const activityFilters = [
    { id: 'active', label: 'Active Today', icon: 'Zap' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'new', label: 'New Users', icon: 'UserPlus' }
  ];

  const handleFilterClick = (filterId, category = 'style') => {
    onFilterChange(filterId, category);
  };

  return (
    <div className="space-y-4">
      {/* Main Style Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterOptions.map((filter) => {
          const isActive = activeFilters.style === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id, 'style')}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full border animation-spring
                ${isActive 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={filter.icon} size={16} />
              <span className="text-sm font-medium">{filter.label}</span>
              <span className="text-xs opacity-75 font-mono">({filter.count})</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          className="text-muted-foreground hover:text-foreground"
        >
          Advanced Filters
        </Button>

        {/* Active Filter Count */}
        {Object.values(activeFilters).filter(f => f && f !== 'all').length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {Object.values(activeFilters).filter(f => f && f !== 'all').length} active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange('all', 'reset')}
              className="text-xs text-primary hover:text-primary/80"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 p-4 bg-muted/20 rounded-lg animate-slide-down">
          {/* Location Filters */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Location</h4>
            <div className="flex space-x-2">
              {locationFilters.map((filter) => {
                const isActive = activeFilters.location === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterClick(filter.id, 'location')}
                    className={`
                      flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm animation-spring
                      ${isActive 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                      }
                    `}
                  >
                    <Icon name={filter.icon} size={14} />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Filters */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Activity</h4>
            <div className="flex flex-wrap gap-2">
              {activityFilters.map((filter) => {
                const isActive = activeFilters.activity === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterClick(filter.id, 'activity')}
                    className={`
                      flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm animation-spring
                      ${isActive 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                      }
                    `}
                  >
                    <Icon name={filter.icon} size={14} />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;