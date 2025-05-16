import { Button } from '../ui/Button';
import { useSearching } from '../../context/SearchingContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ALGORITHMS = [
  { id: 'linear', name: 'Linear Search', complexity: 'O(n)', sorted: false },
  { id: 'binary', name: 'Binary Search', complexity: 'O(log n)', sorted: true },
  // For future implementations
  // { id: 'jump', name: 'Jump Search', complexity: 'O(√n)', sorted: true },
  // { id: 'interpolation', name: 'Interpolation Search', complexity: 'O(log log n)', sorted: true },
] as const;

export const SearchingControls = () => {
  const {
    generateNewArray,
    setCustomArray,
    setSpeed,
    startSearching,
    pauseSearching,
    resetArray,
    sortArray,
    replaySearch,
    isSorting,
    isPaused,
    isStepMode,
    speed,
    selectedAlgorithm,
    selectAlgorithm,
    array,
    target,
    setTarget,
    comparisonCount,
    nextStep,
    toggleStepMode,
    currentOperation,
    isSorted,
  } = useSearching();

  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [customTargetInput, setCustomTargetInput] = useState<string>('');
  const [customArrayError, setCustomArrayError] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const handleArraySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value);
    generateNewArray(size);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTarget = Number(e.target.value);
    if (!isNaN(newTarget)) {
      setTarget(newTarget);
    }
  };

  const handleCustomArraySubmit = () => {
    try {
      // Parse the input string to an array of numbers
      const inputArray = customArrayInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== '')
        .map(item => {
          const num = Number(item);
          if (isNaN(num)) {
            throw new Error(`"${item}" is not a valid number`);
          }
          return num;
        });
      
      if (inputArray.length < 2) {
        setCustomArrayError('Please enter at least 2 numbers');
        return;
      }
      
      if (inputArray.length > 16) {
        setCustomArrayError('Maximum 16 numbers allowed');
        return;
      }
      
      // Clear any error
      setCustomArrayError('');
      
      // Parse target if provided
      let newTarget = target;
      if (customTargetInput.trim()) {
        const inputTarget = Number(customTargetInput);
        if (isNaN(inputTarget)) {
          setCustomArrayError('Target is not a valid number');
          return;
        }
        newTarget = inputTarget;
      } else {
        // Use a random value from the array if no target specified
        const randomIndex = Math.floor(Math.random() * inputArray.length);
        newTarget = inputArray[randomIndex];
      }
      
      // Set the custom array
      setCustomArray(inputArray);
      
      // Set the target
      setTarget(newTarget);
      
      // Hide the custom input section
      setShowCustomInput(false);
    } catch (error) {
      if (error instanceof Error) {
        setCustomArrayError(error.message);
      } else {
        setCustomArrayError('Invalid input');
      }
    }
  };

  const selectedAlgorithmData = ALGORITHMS.find(a => a.id === selectedAlgorithm);
  const requiresSorting = selectedAlgorithmData?.sorted || false;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 text-text dark:text-text-dark">Select Algorithm</h3>
      
      {/* Algorithm Selection */}
      <div className="space-y-2">
        {ALGORITHMS.map((algo) => (
          <motion.button
            key={algo.id}
            className={`w-full p-3 text-left rounded-md border transition-colors
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     ${selectedAlgorithm === algo.id
                      ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                      : 'border-border dark:border-border-dark text-text dark:text-text-dark hover:border-primary dark:hover:border-primary hover:bg-background-100 dark:hover:bg-background-dark/50'
                     }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectAlgorithm(algo.id as typeof selectedAlgorithm)}
            disabled={isSorting}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {algo.name}
                {algo.sorted && (
                  <span className="text-xs ml-2 text-muted-foreground dark:text-muted-foreground">(Requires sorted array)</span>
                )}
              </span>
              <span className="text-xs font-code text-muted dark:text-muted-dark">{algo.complexity}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Target Value Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm text-text dark:text-text-dark">Target Value</h4>
          <span className="text-xs font-medium text-accent dark:text-accent-dark">{target}</span>
        </div>
        <input
          type="number"
          value={target}
          onChange={handleTargetChange}
          className="w-full p-2 text-sm border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-card dark:bg-card-dark text-text dark:text-text-dark"
          disabled={isSorting}
        />
      </div>

      {/* Array Controls */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm text-text dark:text-text-dark">Array Size</h4>
          <span className="text-xs font-medium text-muted dark:text-muted-dark">{array.length} elements</span>
        </div>
        <input
          type="range"
          min="5"
          max="16"
          value={array.length}
          className="w-full accent-primary"
          onChange={handleArraySizeChange}
          disabled={isSorting || showCustomInput}
        />
        <div className="flex justify-between text-sm text-muted dark:text-muted-dark">
          <span>5</span>
          <span>16</span>
        </div>
      </div>

      {/* Step Mode Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm text-text dark:text-text-dark">Step Mode</h4>
          <button
            onClick={toggleStepMode}
            disabled={isSorting && !isPaused}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              isStepMode ? 'bg-primary' : 'bg-muted dark:bg-muted-dark'
            } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span className="sr-only">Toggle step mode</span>
            <span
              className={`${
                isStepMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
            />
          </button>
        </div>
        <p className="text-xs text-muted dark:text-muted-dark">
          {isStepMode
            ? "Step mode enabled. Press 'Next Step' to advance the search algorithm one step at a time."
            : "Continuous mode enabled. The algorithm will run automatically at the selected speed."
          }
        </p>

        {isStepMode && isSorting && (
          <Button
            className="w-full mt-2"
            onClick={nextStep}
          >
            Next Step
          </Button>
        )}
      </div>

      {/* Custom Array Input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm text-text dark:text-text-dark">Custom Array</h4>
          <button 
            className="text-xs font-medium text-primary hover:underline"
            onClick={() => setShowCustomInput(!showCustomInput)}
            disabled={isSorting}
          >
            {showCustomInput ? 'Cancel' : 'Enter Custom Values'}
          </button>
        </div>
        
        {showCustomInput && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="p-3 bg-background dark:bg-background-dark rounded-md">
              <p className="text-xs text-muted dark:text-muted-dark mb-2">
                Enter numbers separated by commas (e.g., 5, 3, 8, 1)
              </p>
              <textarea
                className="w-full p-2 text-sm border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-card dark:bg-card-dark text-text dark:text-text-dark"
                placeholder="5, 3, 8, 1, 10, 2..."
                value={customArrayInput}
                onChange={(e) => setCustomArrayInput(e.target.value)}
                rows={3}
              />
              
              <p className="text-xs text-muted dark:text-muted-dark mt-3 mb-2">
                Enter target value (optional)
              </p>
              <input
                type="number"
                className="w-full p-2 text-sm border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-card dark:bg-card-dark text-text dark:text-text-dark"
                placeholder="Target number to search for"
                value={customTargetInput}
                onChange={(e) => setCustomTargetInput(e.target.value)}
              />
              
              {customArrayError && (
                <p className="text-xs text-error mt-1">{customArrayError}</p>
              )}
              <Button
                className="w-full mt-2"
                onClick={handleCustomArraySubmit}
                disabled={isSorting}
              >
                Apply Custom Array
              </Button>
            </div>
          </motion.div>
        )}

        <div className="w-full grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            className="w-full whitespace-nowrap text-center py-2"
            onClick={() => {
              generateNewArray(array.length || 16);
            }}
            disabled={isSorting && !isPaused}
          >
            Random
          </Button>
          <Button
            variant="secondary"
            className="w-full whitespace-nowrap text-center py-2"
            onClick={replaySearch}
            disabled={(isSorting && !isPaused) || array.length === 0}
            title="Reset search state"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Array Sorting Control (for Binary Search) */}
      {requiresSorting && !isSorted && (
        <div className="p-3 bg-warning/10 dark:bg-warning/20 rounded-lg border border-warning/30 dark:border-warning/30">
          <p className="text-sm text-warning dark:text-warning mb-2">
            Binary Search requires a sorted array
          </p>
          <Button
            variant="secondary"
            className="w-full"
            onClick={sortArray}
            disabled={isSorting}
          >
            Sort Array
          </Button>
        </div>
      )}

      {/* Speed Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm text-text dark:text-text-dark">Animation Speed</h4>
          <span className="text-xs font-medium text-muted dark:text-muted-dark">{speed}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          className="w-full accent-primary"
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={isStepMode}
        />
        <div className="flex justify-between text-sm text-muted dark:text-muted-dark">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Search Stats */}
      <div className="p-3 bg-background dark:bg-background-dark rounded-lg">
        <h4 className="font-medium text-sm text-text dark:text-text-dark mb-2">Statistics</h4>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="p-2 bg-card dark:bg-card-dark rounded border border-border dark:border-border-dark">
            <div className="text-muted dark:text-muted-dark">Comparisons</div>
            <div className="font-semibold text-text dark:text-text-dark text-lg">{comparisonCount}</div>
          </div>
        </div>
        
        {currentOperation && (
          <div className="mt-2 text-xs text-text dark:text-text-dark p-2 bg-card dark:bg-card-dark rounded border border-border dark:border-border-dark">
            <div className="text-muted dark:text-muted-dark mb-1">Current operation:</div>
            <div className="font-code">{currentOperation}</div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-6">
        <Button
          className={`w-full ${(isSorting || isPaused) ? 'bg-primary/80' : 'bg-primary'}`}
          onClick={isPaused ? startSearching : (isSorting ? pauseSearching : startSearching)}
          disabled={requiresSorting && !isSorted}
        >
          {isPaused ? 'Resume Search' : (isSorting ? 'Pause Search' : 'Start Search')}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={resetArray}
          disabled={isSorting && !isPaused}
        >
          Reset Array
        </Button>
      </div>
    </div>
  );
}; 