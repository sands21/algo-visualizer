import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = true, children, className = '', ...props }, ref) => {
    const Component = hover ? motion.div : 'div';

    return (
      <Component
        ref={ref}
        className={`card ${className}`}
        {...(hover && {
          whileHover: { scale: 1.02, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
          transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        })}
        {...props}
      >
        {children}
      </Component>
    );
  }
); 