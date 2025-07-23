import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterTabs = ({ activeTab, onTabChange, tabs }) => {
  const getTabIcon = (tabId) => {
    switch (tabId) {
      case 'all': return 'Grid3X3';
      case 'contests': return 'Trophy';
      case 'collaborations': return 'Handshake';
      case 'gigs': return 'Briefcase';
      default: return 'Circle';
    }
  };

  return (
    <div className="flex space-x-1 bg-muted/20 p-1 rounded-xl overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg
            text-sm font-medium animation-spring
            ${activeTab === tab.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }
          `}
        >
          <Icon name={getTabIcon(tab.id)} size={16} />
          <span className='text-white'>{tab.label}</span>
          {tab.count > 0 && (
            <span className={`
              px-1.5 py-0.5 rounded-full text-xs font-mono
              ${activeTab === tab.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;