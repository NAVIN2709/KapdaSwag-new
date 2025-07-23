import React, { useState, useEffect } from 'react';

const NotificationBadge = ({ 
  count = 0, 
  maxCount = 99, 
  showZero = false,
  size = 'default',
  color = 'warning',
  className = '',
  children,
  position = 'top-right'
}) => {
  const [displayCount, setDisplayCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count !== displayCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayCount(count);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [count, displayCount]);

  const shouldShow = count > 0 || showZero;
  const formattedCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeClasses = {
    sm: 'min-w-[14px] h-3.5 text-xs',
    default: 'min-w-[16px] h-4 text-xs',
    lg: 'min-w-[20px] h-5 text-sm'
  };

  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    error: 'bg-error text-error-foreground',
    muted: 'bg-muted text-muted-foreground'
  };

  const positionClasses = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1'
  };

  if (!children) {
    // Standalone badge
    return shouldShow ? (
      <span
        className={`
          inline-flex items-center justify-center px-1 font-medium rounded-full
          ${sizeClasses[size]} ${colorClasses[color]} ${className}
          ${isAnimating ? 'animate-bounce-subtle' : ''}
        `}
      >
        {formattedCount}
      </span>
    ) : null;
  }

  // Badge with children (positioned)
  return (
    <div className="relative inline-flex">
      {children}
      {shouldShow && (
        <span
          className={`
            absolute flex items-center justify-center px-1 font-medium rounded-full
            ${sizeClasses[size]} ${colorClasses[color]} ${positionClasses[position]}
            ${isAnimating ? 'animate-bounce-subtle' : ''}
            ${className}
          `}
        >
          {formattedCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;