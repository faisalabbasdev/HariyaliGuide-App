
import React, { useState, useRef } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile: Long press handling
  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(() => setIsVisible(false), 1500); // Hide after 1.5s on mobile
  };

  // Desktop: Hover
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);

  let positionClasses = '';
  switch (position) {
    case 'top': positionClasses = 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'; break;
    case 'bottom': positionClasses = 'top-full left-1/2 transform -translate-x-1/2 mt-2'; break;
    case 'left': positionClasses = 'right-full top-1/2 transform -translate-y-1/2 mr-2'; break;
    case 'right': positionClasses = 'left-full top-1/2 transform -translate-y-1/2 ml-2'; break;
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm whitespace-nowrap pointer-events-none animate-in fade-in zoom-in duration-200 ${positionClasses}`}>
          {text}
          {/* Arrow */}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 
            ${position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' : ''}
            ${position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' : ''}
          `}></div>
        </div>
      )}
    </div>
  );
};
