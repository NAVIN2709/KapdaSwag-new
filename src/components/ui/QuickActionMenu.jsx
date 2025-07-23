import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const QuickActionMenu = ({ isOpen, onClose, position, actions = [] }) => {
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const defaultActions = [
    {
      id: 'like',
      label: 'Like',
      icon: 'Heart',
      color: 'text-error',
      action: () => console.log('Liked')
    },
    {
      id: 'save',
      label: 'Save',
      icon: 'Bookmark',
      color: 'text-warning',
      action: () => console.log('Saved')
    },
    {
      id: 'share',
      label: 'Share',
      icon: 'Share',
      color: 'text-primary',
      action: () => console.log('Shared')
    },
    {
      id: 'report',
      label: 'Report',
      icon: 'Flag',
      color: 'text-muted-foreground',
      action: () => console.log('Reported')
    }
  ];

  const menuActions = actions.length > 0 ? actions : defaultActions;

  useEffect(() => {
    if (isOpen && position) {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      const menuSize = {
        width: 200,
        height: menuActions.length * 48 + 16
      };

      let x = position.x - menuSize.width / 2;
      let y = position.y - menuSize.height - 10;

      // Adjust horizontal position
      if (x < 16) x = 16;
      if (x + menuSize.width > viewport.width - 16) {
        x = viewport.width - menuSize.width - 16;
      }

      // Adjust vertical position
      if (y < 16) {
        y = position.y + 10;
      }

      setMenuPosition({ x, y });
    }
  }, [isOpen, position, menuActions.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleActionClick = (action) => {
    action.action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-150 bg-transparent">
      <div
        ref={menuRef}
        className="absolute bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-modal animate-scale-in"
        style={{
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`,
          minWidth: '200px'
        }}
      >
        <div className="p-2">
          {menuActions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg
                text-left animation-spring hover:bg-muted/50
                ${action.color || 'text-foreground'}
              `}
              style={{ minHeight: '44px' }}
            >
              <Icon name={action.icon} size={20} />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionMenu;