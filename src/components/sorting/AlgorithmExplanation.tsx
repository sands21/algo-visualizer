import React from 'react';
import { motion } from 'framer-motion';
import { useSorting } from '../../context/SortingContext';

// Define algorithm descriptions
const ALGORITHM_DESCRIPTIONS = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    diagram: (
      <div className="flex items-center space-x-2 text-xs">
        <motion.div className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center mb-1 text-text dark:text-text-dark">5</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">3</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-primary dark:text-primary-dark"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
        <motion.div className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center mb-1 text-text dark:text-text-dark">3</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
        </motion.div>
      </div>
    )
  },
  quick: {
    name: 'Quick Sort',
    description: 'Quick Sort works by selecting a pivot element and partitioning the array around it, such that elements smaller than the pivot are moved to the left and larger elements to the right.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    diagram: (
      <div className="flex flex-col items-center text-xs space-y-1">
        <div className="flex space-x-1">
          <motion.div 
            className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >3</motion.div>
          <motion.div 
            className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >2</motion.div>
          <motion.div 
            className="w-6 h-6 rounded-full bg-primary dark:bg-primary-dark text-white flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >5</motion.div>
          <motion.div 
            className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >8</motion.div>
          <motion.div 
            className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >7</motion.div>
        </div>
        <motion.div 
          className="w-full h-0.5 bg-primary dark:bg-primary-dark"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
        />
        <div className="flex justify-between w-full">
          <motion.div 
            className="flex space-x-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">3</div>
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">2</div>
          </motion.div>
          <motion.div 
            className="flex space-x-1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">7</div>
          </motion.div>
        </div>
      </div>
    )
  },
  merge: {
    name: 'Merge Sort',
    description: 'Merge Sort is a divide-and-conquer algorithm that recursively divides the array into smaller subarrays, sorts them, and then merges them back together to create the final sorted array.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    stable: true,
    diagram: (
      <div className="flex flex-col items-center space-y-1 text-xs">
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">3</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">1</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg className="w-8 h-4 text-primary dark:text-primary-dark" viewBox="0 0 24 12" fill="none" stroke="currentColor">
            <path d="M12 2 L4 10 M12 2 L20 10" strokeWidth="1.5" />
          </svg>
        </motion.div>
        <motion.div 
          className="flex justify-between w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex space-x-1">
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">3</div>
          </div>
          <div className="flex space-x-1">
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
            <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">1</div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.9 }}
        >
          <svg className="w-16 h-4 text-primary dark:text-primary-dark" viewBox="0 0 48 12" fill="none" stroke="currentColor">
            <path d="M24 10 L12 2 M24 10 L36 2" strokeWidth="1.5" />
          </svg>
        </motion.div>
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">1</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">3</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
        </motion.div>
      </div>
    )
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Insertion Sort works by building a sorted array one element at a time, repeatedly taking the next unsorted element and inserting it into its correct position in the sorted portion of the array.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    diagram: (
      <div className="flex flex-col space-y-2 text-xs">
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-6 h-6 rounded-full bg-secondary dark:bg-secondary-dark text-white flex items-center justify-center">3</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
          <div className="w-6 h-6 rounded-full bg-primary dark:bg-primary-dark text-white flex items-center justify-center">1</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
        </motion.div>
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <svg className="w-5 h-5 text-primary dark:text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="ml-1 text-text dark:text-text-dark">Insert 1 at the correct position</span>
        </motion.div>
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-6 h-6 rounded-full bg-secondary dark:bg-secondary-dark text-white flex items-center justify-center">1</div>
          <div className="w-6 h-6 rounded-full bg-secondary dark:bg-secondary-dark text-white flex items-center justify-center">3</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
        </motion.div>
      </div>
    )
  },
  selection: {
    name: 'Selection Sort',
    description: 'Selection Sort works by repeatedly finding the minimum element from the unsorted portion of the array and placing it at the beginning of the sorted portion.',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    diagram: (
      <div className="flex flex-col space-y-2 text-xs">
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
          <div className="w-6 h-6 rounded-full bg-primary dark:bg-primary-dark text-white flex items-center justify-center">2</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">6</div>
        </motion.div>
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <svg className="w-5 h-5 text-primary dark:text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="ml-1 text-text dark:text-text-dark">Find min (2) and swap with first element</span>
        </motion.div>
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-6 h-6 rounded-full bg-secondary dark:bg-secondary-dark text-white flex items-center justify-center">2</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">5</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">8</div>
          <div className="w-6 h-6 rounded-full bg-background dark:bg-background-dark flex items-center justify-center text-text dark:text-text-dark">6</div>
        </motion.div>
      </div>
    )
  },
};

export const AlgorithmExplanation: React.FC = () => {
  const { selectedAlgorithm, comparingIndices, swappingIndices, sortedIndices } = useSorting();
  const algoInfo = selectedAlgorithm ? ALGORITHM_DESCRIPTIONS[selectedAlgorithm] : null;

  if (!algoInfo) {
    return (
      <div className="p-4 text-center text-muted dark:text-muted-dark">
        Select an algorithm to see its explanation
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Algorithm Header */}
      <div>
        <h2 className="text-xl font-semibold text-text dark:text-text-dark">{algoInfo.name}</h2>
        <p className="mt-2 text-muted dark:text-muted-dark">{algoInfo.description}</p>
      </div>

      {/* Visual Diagram */}
      <div className="bg-background dark:bg-background-dark p-4 rounded-lg flex justify-center">
        {algoInfo.diagram}
      </div>

      {/* Complexity Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background dark:bg-background-dark p-4 rounded-lg">
          <h3 className="text-sm font-medium text-text dark:text-text-dark">Time Complexity</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-muted dark:text-muted-dark">Best: <span className="font-code text-text dark:text-text-dark">{algoInfo.timeComplexity.best}</span></p>
            <p className="text-sm text-muted dark:text-muted-dark">Average: <span className="font-code text-text dark:text-text-dark">{algoInfo.timeComplexity.average}</span></p>
            <p className="text-sm text-muted dark:text-muted-dark">Worst: <span className="font-code text-text dark:text-text-dark">{algoInfo.timeComplexity.worst}</span></p>
          </div>
        </div>
        <div className="bg-background dark:bg-background-dark p-4 rounded-lg">
          <h3 className="text-sm font-medium text-text dark:text-text-dark">Space Complexity</h3>
          <p className="mt-2 font-code text-sm text-text dark:text-text-dark">{algoInfo.spaceComplexity}</p>
          <h3 className="text-sm font-medium text-text dark:text-text-dark mt-4">Stability</h3>
          <p className="mt-2 text-sm text-muted dark:text-muted-dark">{algoInfo.stable ? 'Stable' : 'Not Stable'}</p>
        </div>
      </div>

      {/* Current State */}
      <div className="bg-card dark:bg-card-dark shadow rounded-lg p-4 border border-border dark:border-border-dark">
        <h3 className="text-sm font-medium text-text dark:text-text-dark mb-3">Current State</h3>
        <div className="space-y-2">
          {comparingIndices.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted dark:text-muted-dark"
            >
              Comparing elements at positions{' '}
              <span className="font-code text-primary dark:text-primary-dark">{comparingIndices.join(' and ')}</span>
            </motion.div>
          )}
          {swappingIndices.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted dark:text-muted-dark"
            >
              Swapping elements at positions{' '}
              <span className="font-code text-accent dark:text-accent-dark">{swappingIndices.join(' and ')}</span>
            </motion.div>
          )}
          {sortedIndices.length > 0 && (
            <div className="text-sm text-muted dark:text-muted-dark">
              Sorted positions:{' '}
              <span className="font-code text-secondary dark:text-secondary-dark">[{sortedIndices.join(', ')}]</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 