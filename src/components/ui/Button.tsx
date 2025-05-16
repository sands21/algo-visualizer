import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, children, className = '', ...props }, ref) => {
    // Define base classes with dark mode support
    const getBaseClass = () => {
      if (variant === 'primary') {
        return 'btn bg-primary dark:bg-primary-dark text-white hover:brightness-110 active:scale-95';
      } else {
        return 'btn bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark active:scale-95';
      }
    };

    return (
      <motion.button
        ref={ref}
        className={`${getBaseClass()} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="animate-spin-slow h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
); 