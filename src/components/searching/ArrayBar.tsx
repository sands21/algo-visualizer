import { motion } from 'framer-motion';
import React from 'react';

interface ArrayBarProps {
  value: number;
  maxValue: number;
  index: number;
  width: number;
  state: 'default' | 'current' | 'visited' | 'found' | 'target';
  showIndices?: boolean;
}

export const ArrayBar: React.FC<ArrayBarProps> = ({ 
  value, 
  maxValue, 
  index, 
  width, 
  state,
  showIndices = true
}) => {
  // Calculate height as a percentage of the max value
  const height = (value / maxValue) * 100;
  
  // Determine bar color based on state
  const getBarColor = () => {
    switch (state) {
      case 'current':
        return 'bg-primary dark:bg-primary-dark';
      case 'visited':
        return 'bg-muted-foreground/60 dark:bg-muted-foreground/50';
      case 'found':
        return 'bg-secondary dark:bg-secondary-dark';
      case 'target':
        return 'bg-accent dark:bg-accent-dark';
      default:
        return 'bg-background-accent dark:bg-background-accent-dark';
    }
  };
  
  // Determine bar border based on state
  const getBarBorder = () => {
    switch (state) {
      case 'current':
        return 'border-primary dark:border-primary-dark';
      case 'visited':
        return 'border-muted-foreground/60 dark:border-muted-foreground/50';
      case 'found':
        return 'border-secondary dark:border-secondary-dark';
      case 'target':
        return 'border-accent dark:border-accent-dark';
      default:
        return 'border-border dark:border-border-dark';
    }
  };
  
  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: `${width}px`,
        padding: '0 2px',
      }}
    >
      <motion.div
        initial={{ height: 0 }}
        animate={{ 
          height: `${height}%`,
          y: [state === 'current' ? -5 : 0, 0]
        }}
        transition={{ 
          duration: 0.3,
          y: { duration: 0.2, repeat: state === 'current' ? 1 : 0 }
        }}
        className={`w-full rounded-t-sm border ${getBarBorder()} ${getBarColor()} relative`}
        style={{
          minHeight: '4px',
        }}
      >
        {/* Value label on top of the bar */}
        <div 
          className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium
            ${state === 'current' || state === 'found' || state === 'target' 
              ? 'opacity-100' 
              : 'opacity-0 group-hover:opacity-100'
            } transition-opacity whitespace-nowrap`}
        >
          {value}
        </div>
        
        {/* Target indicator (for bar that matches the target) */}
        {state === 'target' && (
          <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 text-xs font-medium text-accent dark:text-accent-dark">
            Target
          </div>
        )}
        
        {/* Found indicator */}
        {state === 'found' && (
          <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 text-xs font-medium text-secondary dark:text-secondary-dark">
            Found!
          </div>
        )}
      </motion.div>
      
      {/* Index below the bar */}
      {showIndices && (
        <div 
          className={`text-[10px] mt-1 font-code
            ${state === 'current' || state === 'found' || state === 'target'
              ? 'text-text dark:text-text-dark font-semibold' 
              : 'text-muted dark:text-muted-dark'
            }`}
        >
          {index}
        </div>
      )}
    </div>
  );
}; 