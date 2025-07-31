import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      id: 'saved',
      label: 'Saved Fits',
      icon: 'Bookmark',
      count: counts.saved
    },
    {
      id: 'content',
      label: 'Content',
      icon: 'Grid3X3',
      count: counts.content
    },
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex flex-col items-center justify-center py-4 px-2 animation-spring
              ${activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }
            `}
          >
            <Icon 
              name={tab.icon} 
              size={20} 
              strokeWidth={activeTab === tab.id ? 2.5 : 2}
              className="mb-1"
            />
            <span className="text-xs font-medium">{tab.label}</span>
            {tab.count > 0 && (
              <span className="text-xs font-mono mt-0.5 opacity-70">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;