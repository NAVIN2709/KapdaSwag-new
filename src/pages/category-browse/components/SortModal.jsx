import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortModal = ({ isOpen, onClose, selectedSort, onSortChange }) => {
  const sortOptions = [
    {
      id: 'trending',
      label: 'Trending',
      description: 'Most popular items right now',
      icon: 'TrendingUp'
    },
    {
      id: 'newest',
      label: 'Newest',
      description: 'Recently added items',
      icon: 'Clock'
    },
    {
      id: 'price-low',
      label: 'Price: Low to High',
      description: 'Cheapest items first',
      icon: 'ArrowUp'
    },
    {
      id: 'price-high',
      label: 'Price: High to Low',
      description: 'Most expensive items first',
      icon: 'ArrowDown'
    },
    {
      id: 'rating',
      label: 'Highest Rated',
      description: 'Best community ratings',
      icon: 'Star'
    },
    {
      id: 'boosts',
      label: 'Most Boosted',
      description: 'Community favorites',
      icon: 'Zap'
    }
  ];

  if (!isOpen) return null;

  const handleSortSelect = (sortId) => {
    onSortChange(sortId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-200 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Sort By</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        {/* Options */}
        <div className="p-4 space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSortSelect(option.id)}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-xl text-left
                animation-spring
                ${selectedSort === option.id
                  ? 'bg-primary/10 border border-primary text-primary' :'hover:bg-muted/30 text-foreground'
                }
              `}
            >
              <Icon 
                name={option.icon} 
                size={20} 
                className={selectedSort === option.id ? 'text-primary' : 'text-muted-foreground'}
              />
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">{option.description}</div>
              </div>
              {selectedSort === option.id && (
                <Icon name="Check" size={20} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortModal;