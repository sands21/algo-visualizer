import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion, AnimationDefinition, Transition, HTMLMotionProps } from 'framer-motion';

interface CardProps extends 
  Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'transition'>, 
  Pick<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'variants' | 'layout' | 'layoutId'>
{
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onAnimationStart?: (definition: AnimationDefinition) => void;
  onAnimationEnd?: (definition: AnimationDefinition) => void;
  onAnimationIteration?: (definition: AnimationDefinition) => void;
  transition?: Transition;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    hover = true, 
    children, 
    className = '', 
    initial, animate, exit, variants, layout, layoutId,
    transition,
    onAnimationStart, onAnimationEnd, onAnimationIteration,
    ...rest
  }, ref) => {
    

    const motionComponentProps: HTMLMotionProps<'div'> & {ref: React.Ref<HTMLDivElement>} = {
      ref: ref,
      className: `card ${className}`,
      children: children,
      ...(hover && {
        whileHover: { scale: 1.02, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
        transition: transition || { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
        initial: initial,
        animate: animate,
        exit: exit,
        variants: variants,
        layout: layout,
        layoutId: layoutId,
        onAnimationStart: onAnimationStart,
        onAnimationEnd: onAnimationEnd,
        onAnimationIteration: onAnimationIteration,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(rest as any), 
    };
    
    const divComponentProps: HTMLAttributes<HTMLDivElement> & {ref: React.Ref<HTMLDivElement>} = {
        ref: ref,
        className: `card ${className}`,
        children: children,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(rest as any), 
    };

    if (hover) {
      return (
        <motion.div {...motionComponentProps} />
      );
    }
    return (
      <div {...divComponentProps} />
    );
  }
); 