import { motion } from 'framer-motion';

export interface ArrayBarProps {
  value: number;
  maxValue: number;
  index: number;
  width?: number; // Optional width parameter with default value
  state: 'default' | 'comparing' | 'swapping' | 'sorted';
}

export const ArrayBar = ({ value, maxValue, index, width = 24, state }: ArrayBarProps) => {
  // Calculate height percentage based on value
  const heightPercentage = (value / maxValue) * 100;

  // Define state-based styling
  const getStateStyles = () => {
    switch (state) {
      case 'comparing':
        return 'bg-primary dark:bg-primary-dark';
      case 'swapping':
        return 'bg-accent dark:bg-accent-dark';
      case 'sorted':
        return 'bg-secondary dark:bg-secondary-dark';
      default:
        return 'bg-muted/40 dark:bg-muted-dark/40';
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <motion.div
        className={`rounded-md ${getStateStyles()}`}
        style={{ 
          width: `${width}px`, 
          height: `${Math.max(heightPercentage, 2)}%`,
          marginLeft: '1px',
          marginRight: '1px'
        }}
        initial={false}
        animate={{
          scale: state === 'comparing' ? 1.1 : state === 'swapping' ? 1.05 : 1,
          y: state === 'swapping' ? -4 : 0,
          boxShadow: state !== 'default' 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
            : '0 0 0 0 rgba(0, 0, 0, 0)'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.2,
        }}
      />
    </motion.div>
  );
}; 