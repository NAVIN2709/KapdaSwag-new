import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications] = useState({
    community: 3,
    connect: 1
  });

  const navigationItems = [
    {
      id: 'discover',
      label: 'Discover',
      icon: 'Zap',
      path: '/discovery-feed-swipe-interface',
      badgeCount: 0
    },
    {
      id: 'browse',
      label: 'Browse',
      icon: 'Grid3X3',
      path: '/category-browse',
      badgeCount: 0
    },
    {
      id: 'community',
      label: 'Community',
      icon: 'Users',
      path: '/community-hub',
      badgeCount: notifications.community
    },
    {
      id: 'connect',
      label: 'Connect',
      icon: 'Heart',
      path: '/friend-discovery',
      badgeCount: notifications.connect
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      path: '/user-profile',
      badgeCount: 0
    }
  ];

  const handleTabPress = (item) => {
    navigate(item.path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 bg-background/95 backdrop-blur-sm border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navigationItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabPress(item)}
              className={`
                relative flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1
                animation-spring touch-manipulation
                ${active 
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
                }
              `}
              style={{ minHeight: '48px' }}
              aria-label={`${item.label} tab`}
              role="tab"
              aria-selected={active}
            >
              {/* Icon Container */}
              <div className="relative mb-1">
                <Icon 
                  name={item.icon} 
                  size={24} 
                  strokeWidth={active ? 2.5 : 2}
                  className={active ? 'drop-shadow-sm' : ''}
                />
                
                {/* Badge */}
                {item.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-warning text-warning-foreground text-xs font-medium rounded-full flex items-center justify-center px-1 animate-bounce-subtle">
                    {item.badgeCount > 9 ? '9+' : item.badgeCount}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span className={`
                text-xs font-medium leading-none truncate max-w-full
                ${active ? 'text-primary' : 'text-muted-foreground'}
              `}>
                {item.label}
              </span>
              
              {/* Active Indicator */}
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;