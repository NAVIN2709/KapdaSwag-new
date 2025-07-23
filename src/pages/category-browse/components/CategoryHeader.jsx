import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryHeader = ({ 
  selectedCategory, 
  productCount, 
  viewMode, 
  onViewModeChange, 
  onFilterToggle,
  onSortToggle 
}) => {
  return (
    <div className="sticky top-16 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-4 py-3">
        {/* Category Info */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-foreground capitalize">
              {selectedCategory}
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {productCount.toLocaleString()} items
            </p>
          </div>
          
          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name={viewMode === 'grid' ? 'List' : 'Grid3X3'} size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onSortToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="ArrowUpDown" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onFilterToggle}
              className="text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Icon name="Filter" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;