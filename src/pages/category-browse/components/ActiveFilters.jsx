import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const getActiveFilters = () => {
    const active = [];
    
    if (filters?.priceRange) {
      active.push({
        type: 'priceRange',
        label: filters.priceRange.label,
        value: null
      });
    }
    
    filters?.brands.forEach(brand => {
      active.push({
        type: 'brands',
        label: brand,
        value: brand
      });
    });
    
    filters?.sizes.forEach(size => {
      active.push({
        type: 'sizes',
        label: size,
        value: size
      });
    });
    
    filters?.colors.forEach(color => {
      active.push({
        type: 'colors',
        label: color,
        value: color
      });
    });
    
    filters?.styleTags.forEach(tag => {
      active.push({
        type: 'styleTags',
        label: tag,
        value: tag
      });
    });
    
    if (filters?.minRating > 0) {
      active.push({
        type: 'minRating',
        label: `${filters.minRating}+ Stars`,
        value: null
      });
    }
    
    return active;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) return null;

  const handleRemoveFilter = (filter) => {
    if (filter.type === 'priceRange' || filter.type === 'minRating') {
      onRemoveFilter(filter.type, null);
    } else {
      onRemoveFilter(filter.type, filter.value);
    }
  };

  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Active Filters ({activeFilters.length})
        </span>
        <Button
          variant="ghost"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground text-sm h-auto p-0"
        >
          Clear All
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div
            key={`${filter.type}-${filter.value || 'single'}-${index}`}
            className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => handleRemoveFilter(filter)}
              className="hover:bg-primary/20 rounded-full p-0.5 animation-spring"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFilters;