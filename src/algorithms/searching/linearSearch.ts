import { SearchingAlgorithm, SearchingAlgorithmContext, SearchStep } from './types';

// Define the structure for each step in the visualization
export interface LinearSearchStep {
  array: number[];
  currentIndex: number;
  foundIndex?: number;
  target: number;
  description: string;
  codeLine?: number; // Add codeLine property
}

// Generate visualization steps for linear search (used for explanation)
export function getLinearSearchSteps(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const visited: number[] = [];

  for (let i = 0; i < array.length; i++) {
    visited.push(i);
    steps.push({
      array: [...array],
      currentIndex: i,
      target,
      description: `Checking index ${i}: ${array[i]} ${array[i] === target ? 'is equal to' : 'is not equal to'} target ${target}.`,
      foundIndex: array[i] === target ? i : undefined,
      visited: [...visited],
    });

    if (array[i] === target) {
      steps.push({
        array: [...array],
        currentIndex: i,
        foundIndex: i,
        target,
        description: `Found target ${target} at index ${i}.`,
        visited: [...visited],
      });
      return steps;
    }
  }

  // If not found
  steps.push({
    array: [...array],
    currentIndex: array.length - 1,
    target,
    description: `Target ${target} not found in the array.`,
    foundIndex: undefined,
    visited: [...visited],
  });

  return steps;
}

// Linear search algorithm implementation for the visualizer
async function linearSearchExecute(
  context: SearchingAlgorithmContext, 
  array: number[], 
  target: number
): Promise<number> {
  for (let i = 0; i < array.length; i++) {
    if (!context.isSorting) return -1; // Stop if searching is cancelled
    
    // Mark current element as visited
    await context.markVisited(i);
    
    // Compare current element with target
    const isMatch = await context.compareElement(i, target);
    
    if (isMatch) {
      // Mark as found and return index
      await context.markFound(i);
      return i;
    }
  }
  
  // Not found
  return -1;
}

export const linearSearch: SearchingAlgorithm = {
  name: 'Linear Search',
  description: 
    'Linear Search is the simplest searching algorithm that works by sequentially ' +
    'checking each element of the list until a match is found or the whole list has been searched.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
  },
  spaceComplexity: 'O(1)',
  requiresSorted: false,
  execute: linearSearchExecute,
};
