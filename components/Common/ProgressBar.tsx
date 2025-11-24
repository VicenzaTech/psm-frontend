// components/Common/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'blue',
  size = 'md',
  showPercentage = true
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getFillClasses = () => {
    let classes = 'progress-fill';
    
    // Size
    if (size === 'sm') classes += ' progress-fill-sm';
    else if (size === 'md') classes += ' progress-fill-md';
    else if (size === 'lg') classes += ' progress-fill-lg';
    
    // Color
    if (color === 'green') classes += ' progress-fill-green';
    else if (color === 'yellow') classes += ' progress-fill-yellow';
    else if (color === 'red') classes += ' progress-fill-red';
    
    return classes;
  };

  return (
    <div className="progress-bar">
      {label && (
        <div className="progress-label">
          <span className="progress-label-text">{label}</span>
          {showPercentage && (
            <span className="progress-label-text">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="progress-track">
        <div
          className={getFillClasses()}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};