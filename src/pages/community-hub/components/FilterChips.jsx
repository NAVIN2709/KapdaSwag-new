import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ filters, activeFilters, onFilterChange, onClearAll }) => {
  const handleFilterToggle = (filterId, value) => {
    const currentValues = activeFilters[filterId] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterId, newValues);
  };

  const isFilterActive = (filterId, value) => {
    return (activeFilters[filterId] || []).includes(value);
  };

  const hasActiveFilters = Object.values(activeFilters).some(values => values.length > 0);

  return (
    <div className="space-y-3">
      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClearAll}
            className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 animation-spring"
          >
            <Icon name="X" size={14} />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Filter Groups */}
      <div className="space-y-4">
        {filters.map((filterGroup) => (
          <div key={filterGroup.id}>
            <h4 className="text-sm font-medium text-foreground mb-2">{filterGroup.label}</h4>
            <div className="flex flex-wrap gap-2">
              {filterGroup.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterToggle(filterGroup.id, option.value)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium border animation-spring
                    ${isFilterActive(filterGroup.id, option.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {option.label}
                  {option.count && (
                    <span className="ml-1 font-mono">({option.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;