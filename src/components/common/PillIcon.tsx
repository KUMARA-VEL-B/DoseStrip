import React from 'react';

interface PillIconProps {
  color?: 'pink' | 'amber' | 'blue' | 'purple' | 'emerald';
  type?: 'tablet' | 'capsule';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PillIcon: React.FC<PillIconProps> = ({
  color = 'blue',
  type = 'capsule',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 p-1 text-xs',
    md: 'w-9 h-9 p-1.5 text-sm',
    lg: 'w-12 h-12 p-2.5 text-base',
    xl: 'w-14 h-14 p-3 text-lg',
  };

  const bgStyles = {
    pink: 'bg-rose-50 text-rose-500 border border-rose-200/80 shadow-rose-200/50',
    amber: 'bg-amber-50 text-amber-500 border border-amber-200/80 shadow-amber-200/50',
    blue: 'bg-blue-50 text-blue-500 border border-blue-200/80 shadow-blue-200/50',
    purple: 'bg-purple-50 text-purple-500 border border-purple-200/80 shadow-purple-200/50',
    emerald: 'bg-emerald-50 text-emerald-500 border border-emerald-200/80 shadow-emerald-200/50',
  };

  const capsuleGradients = {
    pink: 'from-rose-400 to-rose-600',
    amber: 'from-amber-400 to-amber-600',
    blue: 'from-sky-400 to-blue-600',
    purple: 'from-purple-400 to-indigo-600',
    emerald: 'from-emerald-400 to-teal-600',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center shadow-sm shrink-0 ${sizeMap[size]} ${bgStyles[color]} ${className}`}
    >
      {type === 'capsule' ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full transform -rotate-45"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="7"
            width="18"
            height="10"
            rx="5"
            className={`fill-current`}
            fillOpacity="0.85"
          />
          <path
            d="M3 12C3 9.23858 5.23858 7 8 7H12V17H8C5.23858 17 3 14.7614 3 12Z"
            fill="white"
            fillOpacity="0.5"
          />
          <line
            x1="12"
            y1="7"
            x2="12"
            y2="17"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            className={`fill-current`}
            fillOpacity="0.85"
          />
          <path
            d="M4.5 12C4.5 7.85786 7.85786 4.5 12 4.5V19.5C7.85786 19.5 4.5 16.1421 4.5 12Z"
            fill="white"
            fillOpacity="0.4"
          />
          <line
            x1="12"
            y1="4.5"
            x2="12"
            y2="19.5"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
        </svg>
      )}
    </div>
  );
};
