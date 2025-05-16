import { ArrayBar } from './ArrayBar';
import { useSearching } from '../../context/SearchingContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

export const SearchVisualization = () => {
  const { 
    array, 
    target,
    visitedIndices,
    currentIndex,
    foundIndex,
    isSorting,
    isPaused,
    currentStep,
    totalSteps,
    selectedAlgorithm,
  } = useSearching();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Detect container size
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      
      resizeObserver.observe(containerRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  // If no array is initialized yet, show a placeholder
  if (!array || array.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted dark:text-muted-dark">
        Select an algorithm and generate an array to begin
      </div>
    );
  }

  // Find the maximum value in the array for scaling
  const maxValue = Math.max(...array, target, 1); // Include target in max calculation

  // Calculate bar width based on container size and array length
  const calculateBarWidth = () => {
    if (containerWidth <= 0) return 24; // Default
    const maxPossibleWidth = Math.floor((containerWidth - 100) / array.length);
    return Math.max(Math.min(maxPossibleWidth, 48), 16); // Min 16px, max 48px
  };

  const barWidth = calculateBarWidth();
  const barGap = Math.max(Math.floor(barWidth * 0.1), 2);

  // Find any array element that equals the target (for highlighting)
  const targetIndices = array.map((val, idx) => val === target ? idx : -1).filter(idx => idx !== -1);

  return (
    <div className="relative w-full flex flex-col" ref={containerRef}>
      {/* Main visualization area */}
      <div className="relative h-[320px] w-full mb-4 bg-background dark:bg-card-dark rounded-lg border border-border dark:border-border-dark transition-colors duration-200">
        {/* Background grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            Array.from({ length: 12 }).map((_, j) => (
              <div key={`grid-${i}-${j}`} className="border border-border dark:border-border-dark"></div>
            ))
          ))}
        </div>

        {/* Visual guides */}
        <div className="absolute left-2 top-[30px] bottom-10 w-[1px] bg-border dark:bg-border-dark"></div>
        <div className="absolute right-2 top-[30px] bottom-10 w-[1px] bg-border dark:bg-border-dark"></div>
        <div className="absolute left-2 right-2 top-[30px] h-[1px] bg-border dark:bg-border-dark"></div>
        <div className="absolute left-2 right-2 bottom-10 h-[1px] bg-border dark:bg-border-dark"></div>
        
        {/* Value indicators on y-axis */}
        <div className="absolute left-2 top-[30px] bottom-10 flex flex-col justify-between items-end">
          <span className="text-[10px] text-muted dark:text-muted-dark -ml-1">{maxValue}</span>
          <span className="text-[10px] text-muted dark:text-muted-dark -ml-1">{Math.floor(maxValue/2)}</span>
          <span className="text-[10px] text-muted dark:text-muted-dark -ml-1">0</span>
        </div>

        {/* Search status - positioned at the very top */}
        <AnimatePresence>
          {isSorting && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 right-0 bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark px-3 py-1 rounded-bl-md text-sm font-medium z-10"
            >
              Searching in progress...
            </motion.div>
          )}
          {isPaused && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 right-0 bg-warning/10 dark:bg-warning/20 text-warning px-3 py-1 rounded-bl-md text-sm font-medium z-10"
            >
              Search paused
            </motion.div>
          )}
          {(totalSteps > 0 && !isPaused && isSorting) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 bg-background dark:bg-background-dark px-3 py-1 rounded-br-md text-xs font-medium text-muted dark:text-muted-dark z-10"
            >
              Step {currentStep} of ~{totalSteps}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Target display - Removing this element as requested */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-accent/10 dark:bg-accent-dark/20 text-accent dark:text-accent-dark px-4 py-1 rounded-md text-sm font-semibold z-10"
        >
          Target: {target}
        </motion.div> */}

        {/* Current operation visualization - specific to the algorithm */}
        <AnimatePresence>
          {currentIndex !== -1 && (isSorting || isPaused) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-20"
              style={{
                left: `${currentIndex * (barWidth + barGap) + (barWidth / 2)}px`,
                top: '90px',
              }}
            >
              <div className="relative">
                <div className="bg-card/95 dark:bg-card-dark/95 px-3 py-2 rounded-lg shadow-md border border-primary/30 dark:border-primary-dark/30 text-sm text-text dark:text-text-dark max-w-xs">
                  <span>
                    Checking element at index <span className="font-semibold text-primary dark:text-primary-dark">{currentIndex}</span>
                    <br />
                    Value: <span className="font-semibold text-primary dark:text-primary-dark">{array[currentIndex]}</span>
                    {selectedAlgorithm === 'binary' && (
                      <span> (middle element)</span>
                    )}
                  </span>
                </div>
                {/* Arrow pointing to the element */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[98%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary/30 dark:border-t-primary-dark/30"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search completed indicator */}
        {foundIndex !== null && !isSorting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark px-6 py-3 rounded-md shadow-sm border border-secondary/20 dark:border-secondary-dark/30 text-lg font-semibold z-10"
          >
            Target Found at Index {foundIndex}! ✓
          </motion.div>
        )}

        {/* Search not found indicator */}
        {foundIndex === null && visitedIndices.length > 0 && !isSorting && !isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-error/10 dark:bg-error/20 text-error dark:text-error px-6 py-3 rounded-md shadow-sm border border-error/20 dark:border-error/30 text-lg font-semibold z-10"
          >
            Target Not Found! ✗
          </motion.div>
        )}

        {/* Array elements visualization */}
        <div className="absolute left-4 right-4 bottom-16 flex justify-between items-end h-[calc(100%-80px)]">
          {array.map((value, index) => (
            <ArrayBar
              key={`${index}-${value}`}
              value={value}
              maxValue={maxValue}
              index={index}
              width={barWidth}
              state={
                index === foundIndex
                  ? 'found'
                  : index === currentIndex
                  ? 'current'
                  : visitedIndices.includes(index)
                  ? 'visited'
                  : targetIndices.includes(index) && !visitedIndices.includes(index)
                  ? 'target'
                  : 'default'
              }
            />
          ))}
        </div>

        {/* Special visualization for binary search */}
        {selectedAlgorithm === 'binary' && currentIndex !== -1 && (isSorting || isPaused) && (
          <div className="absolute left-4 right-4 bottom-32 h-4">
            {/* Searched region indicator */}
            <div className="relative w-full h-1 bg-muted/20 dark:bg-muted-dark/20">
              {/* Left half indicator */}
              {currentIndex > 0 && array[currentIndex] > target && (
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute top-0 left-0 h-full bg-accent/40 dark:bg-accent-dark/40 origin-left"
                  style={{ 
                    width: `${(currentIndex / array.length) * 100}%`
                  }}
                />
              )}
              
              {/* Right half indicator */}
              {currentIndex < array.length - 1 && array[currentIndex] < target && (
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute top-0 right-0 h-full bg-accent/40 dark:bg-accent-dark/40 origin-right"
                  style={{ 
                    width: `${((array.length - currentIndex - 1) / array.length) * 100}%`
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Array elements display below the graph */}
      <div className="bg-card dark:bg-card-dark rounded-lg p-4 border border-border dark:border-border-dark mb-6">
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">Array Elements</h3>
        <div className="flex justify-between items-center">
          {array.map((value, index) => (
            <div 
              key={`value-${index}`}
              className="flex flex-col items-center"
              style={{ 
                minWidth: `${barWidth}px`,
                transition: 'all 0.3s ease'
              }}
            >
              {/* State indicators */}
              <div className="h-5 mb-1">
                {index === currentIndex && (
                  <svg className="w-5 h-5 text-primary dark:text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                )}
                {index === foundIndex && (
                  <svg className="w-5 h-5 text-secondary dark:text-secondary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {visitedIndices.includes(index) && index !== currentIndex && index !== foundIndex && (
                  <svg className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4-9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {value === target && !visitedIndices.includes(index) && index !== foundIndex && (
                  <svg className="w-5 h-5 text-accent dark:text-accent-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-7a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm0-8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Main value display */}
              <div 
                className={`rounded-md px-4 py-2 min-w-[40px] text-center ${
                  index === currentIndex
                    ? 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark font-medium'
                    : index === foundIndex
                    ? 'bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark font-medium'
                    : visitedIndices.includes(index)
                    ? 'bg-muted-foreground/10 dark:bg-muted-foreground/20 text-muted-foreground dark:text-muted-foreground font-medium'
                    : value === target && !visitedIndices.includes(index)
                    ? 'bg-accent/10 dark:bg-accent-dark/20 text-accent dark:text-accent-dark font-medium'
                    : 'bg-background-dark/30 dark:bg-background-dark/50 text-text dark:text-text-dark'
                }`}
              >
                <span className="text-sm font-code">{value}</span>
              </div>
              
              {/* Index number */}
              <div 
                className="text-[10px] text-muted dark:text-muted-dark text-center font-code mt-1"
              >
                {index}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 