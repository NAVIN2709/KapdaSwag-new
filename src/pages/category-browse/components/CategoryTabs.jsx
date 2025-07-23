import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryTabs = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="px-4 py-3 border-b border-border overflow-x-auto">
      <div className="flex w-max space-x-1">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-xl
                whitespace-nowrap transition
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }
              `}
            >
              <Icon name={category.icon} size={16} />
              <span className="font-medium text-sm">{category.name}</span>
              <span className="text-xs opacity-75 font-mono">
                {category.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
