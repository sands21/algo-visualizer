import { ArrayBar } from './ArrayBar';
import { useSorting } from '../../context/SortingContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

// Track the movement of array elements for visualization
interface MovementTrail {
  fromIndex: number;
  toIndex: number;
  value: number;
  timestamp: number;
}

export const ArrayVisualization = () => {
  const { 
    array, 
    comparingIndices, 
    swappingIndices, 
    sortedIndices,
    isSorting,
    isPaused,
    currentStep,
    totalSteps
  } = useSorting();

  const [trails, setTrails] = useState<MovementTrail[]>([]);
  const previousArray = useRef<number[]>([]);
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

  // Track array changes to detect element movements
  useEffect(() => {
    if (previousArray.current.length > 0 && swappingIndices.length === 2) {
      const [i, j] = swappingIndices;
      
      // Add trail for swapped elements with improved styling
      setTrails(prev => [
        ...prev.filter(t => Date.now() - t.timestamp < 800), // Shorter display time for cleaner look
        { 
          fromIndex: i, 
          toIndex: j, 
          value: previousArray.current[i],
          timestamp: Date.now()
        },
        { 
          fromIndex: j, 
          toIndex: i, 
          value: previousArray.current[j],
          timestamp: Date.now()
        }
      ]);
    }
    
    // Update previous array reference
    previousArray.current = [...array];
  }, [array, swappingIndices]);

  // Clear trails when sorting is reset
  useEffect(() => {
    if (!isSorting && !isPaused) {
      setTrails([]);
    }
  }, [isSorting, isPaused]);

  // If no array is initialized yet, show a placeholder
  if (!array || array.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted dark:text-muted-dark">
        Select an algorithm and generate an array to begin
      </div>
    );
  }

  // Find the maximum value in the array for scaling
  const maxValue = Math.max(...array, 1); // Ensure we don't divide by zero

  // Calculate bar width based on container size and array length
  const calculateBarWidth = () => {
    if (containerWidth <= 0) return 24; // Default
    const maxPossibleWidth = Math.floor((containerWidth - 100) / array.length);
    return Math.max(Math.min(maxPossibleWidth, 48), 16); // Min 16px, max 48px
  };

  const barWidth = calculateBarWidth();
  const barGap = Math.max(Math.floor(barWidth * 0.1), 2);

  return (
    <div className="relative w-full flex flex-col" ref={containerRef}>
      {/* Main visualization area with increased height for the graph */}
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

        {/* Animation status - positioned at the very top */}
        <AnimatePresence>
          {isSorting && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 right-0 bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark px-3 py-1 rounded-bl-md text-sm font-medium z-10"
            >
              Sorting in progress...
            </motion.div>
          )}
          {isPaused && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 right-0 bg-warning/10 dark:bg-warning/20 text-warning px-3 py-1 rounded-bl-md text-sm font-medium z-10"
            >
              Sorting paused
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

        {/* Current operation visualization - with positioning that points to relevant elements */}
        <AnimatePresence>
          {comparingIndices.length === 2 && (isSorting || isPaused) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-20"
              style={{
                // Position tooltip above the compared elements
                left: `${((comparingIndices[0] + comparingIndices[1]) / 2) * (barWidth + barGap) + 8}px`,
                top: '90px',
              }}
            >
              <div className="relative">
                <div className="bg-card/95 dark:bg-card-dark/95 px-3 py-2 rounded-lg shadow-md border border-primary/30 dark:border-primary-dark/30 text-sm text-text dark:text-text-dark max-w-xs">
                  <span>
                    Comparing <span className="font-semibold text-primary dark:text-primary-dark">{array[comparingIndices[0]]}</span> with <span className="font-semibold text-primary dark:text-primary-dark">{array[comparingIndices[1]]}</span>
                    {array[comparingIndices[0]] > array[comparingIndices[1]] 
                      ? <span> (<span className="text-error">{array[comparingIndices[0]]} &gt; {array[comparingIndices[1]]}</span>, will swap)</span>
                      : <span> (<span className="text-secondary dark:text-secondary-dark">{array[comparingIndices[0]]} ≤ {array[comparingIndices[1]]}</span>, no swap needed)</span>}
                  </span>
                </div>
                {/* Arrow pointing to the elements */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[98%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary/30 dark:border-t-primary-dark/30"></div>
              </div>
            </motion.div>
          )}

          {swappingIndices.length === 2 && (isSorting || isPaused) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-20"
              style={{
                // Position tooltip above the swapped elements
                left: `${((swappingIndices[0] + swappingIndices[1]) / 2) * (barWidth + barGap) + 8}px`,
                top: '90px',
              }}
            >
              <div className="relative">
                <div className="bg-card/95 dark:bg-card-dark/95 px-3 py-2 rounded-lg shadow-md border border-accent/30 dark:border-accent-dark/30 text-sm text-text dark:text-text-dark max-w-xs">
                  <span>
                    Swapping <span className="font-semibold text-accent dark:text-accent-dark">{array[swappingIndices[0]]}</span> and <span className="font-semibold text-accent dark:text-accent-dark">{array[swappingIndices[1]]}</span>
                  </span>
                </div>
                {/* Arrow pointing to the elements */}
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[98%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-accent/30 dark:border-t-accent-dark/30"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sorted elements indicator */}
        <AnimatePresence>
          {sortedIndices.length > 0 && sortedIndices.length < array.length && (isSorting || isPaused) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-card/95 dark:bg-card-dark/95 px-4 py-2 rounded-lg shadow-md border border-secondary/30 dark:border-secondary-dark/30 text-sm text-text dark:text-text-dark max-w-xs text-center z-10"
            >
              <span>
                <span className="font-semibold text-secondary dark:text-secondary-dark">{sortedIndices.length}</span> elements are now in their final sorted positions
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Array sorted indicator */}
        {sortedIndices.length === array.length && !isSorting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark px-6 py-3 rounded-md shadow-sm border border-secondary/20 dark:border-secondary-dark/30 text-lg font-semibold z-10"
          >
            Array Sorted! ✓
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
                comparingIndices.includes(index)
                  ? 'comparing'
                  : swappingIndices.includes(index)
                  ? 'swapping'
                  : sortedIndices.includes(index)
                  ? 'sorted'
                  : 'default'
              }
            />
          ))}
        </div>

        {/* Movement trails visualization with animated arrows */}
        {trails.map((trail, idx) => {
          // Calculate positions based on indices
          const startIndex = trail.fromIndex;
          const endIndex = trail.toIndex;
          const startX = startIndex * (barWidth + barGap) + (barWidth / 2);
          const endX = endIndex * (barWidth + barGap) + (barWidth / 2);
          // Use the bar heights to position arrows at an appropriate height
          const startHeight = (array[startIndex] / maxValue) * 100;
          const endHeight = (array[endIndex] / maxValue) * 100;
          const midHeight = Math.min(startHeight, endHeight) * 0.7; // Position arrows at 70% of the smaller bar's height
          
          return (
            <React.Fragment key={`trail-${idx}-${trail.timestamp}`}>
              {/* Curved path from source to destination */}
              <svg 
                className="absolute pointer-events-none z-10"
                style={{ 
                  left: 0, 
                  top: 0, 
                  width: '100%', 
                  height: '100%',
                  opacity: 0.8
                }}
              >
                <motion.path
                  d={`M ${startX} ${250 - startHeight * 2} C ${startX} ${190 - midHeight * 2}, ${endX} ${190 - midHeight * 2}, ${endX} ${250 - endHeight * 2}`}
                  stroke="#8b5cf6" // Purple color
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4 }}
                />
                {/* Animated arrow head */}
                <motion.circle
                  cx={endX}
                  cy={250 - endHeight * 2}
                  r="4"
                  fill="#8b5cf6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                />
              </svg>
            </React.Fragment>
          );
        })}
      </div>

      {/* Array elements display below the graph */}
      <div className="bg-card dark:bg-card-dark rounded-lg p-4 border border-border dark:border-border-dark mb-6">
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">Array Elements</h3>
        <div className="flex justify-between items-end">
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
                {comparingIndices.includes(index) && (
                  <svg className="w-5 h-5 text-primary dark:text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                )}
                {swappingIndices.includes(index) && (
                  <svg className="w-5 h-5 text-accent dark:text-accent-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {sortedIndices.includes(index) && !comparingIndices.includes(index) && !swappingIndices.includes(index) && (
                  <svg className="w-5 h-5 text-secondary dark:text-secondary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              {/* Main value display */}
              <div 
                className={`rounded-md px-4 py-2 min-w-[40px] text-center ${
                  comparingIndices.includes(index)
                    ? 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark font-medium'
                    : swappingIndices.includes(index)
                    ? 'bg-accent/10 dark:bg-accent-dark/20 text-accent dark:text-accent-dark font-medium'
                    : sortedIndices.includes(index)
                    ? 'bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark font-medium'
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