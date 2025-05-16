import { SearchingAlgorithm, SearchingAlgorithmContext, SearchStep } from './types';

// Define the structure for each step in the visualization
export interface BinarySearchStep {
  array: number[];
  left: number;
  right: number;
  mid: number;
  target: number;
  foundIndex?: number;
  description: string;
  codeLine?: number; // Add codeLine property
}

// Generate visualization steps for binary search (used for explanation)
export function getBinarySearchSteps(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let left = 0;
  let right = array.length - 1;
  const visited: number[] = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    visited.push(mid);

    steps.push({
      array: [...array],
      left,
      right,
      mid,
      target,
      currentIndex: mid,
      description: `Checking middle index ${mid}: ${array[mid]}.`,
      foundIndex: array[mid] === target ? mid : undefined,
      visited: [...visited],
    });

    if (array[mid] === target) {
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        currentIndex: mid,
        foundIndex: mid,
        description: `Found target ${target} at index ${mid}.`,
        visited: [...visited],
      });
      return steps;
    } else if (array[mid] < target) {
      steps.push({
        array: [...array],
        left: mid + 1,
        right,
        mid,
        target,
        currentIndex: mid,
        description: `Target ${target} is greater than ${array[mid]}. Searching right half.`,
        visited: [...visited],
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...array],
        left,
        right: mid - 1,
        mid,
        target,
        currentIndex: mid,
        description: `Target ${target} is less than ${array[mid]}. Searching left half.`,
        visited: [...visited],
      });
      right = mid - 1;
    }
  }

  // If not found
  steps.push({
    array: [...array],
    left,
    right,
    mid: -1,
    target,
    currentIndex: -1,
    foundIndex: undefined,
    description: `Target ${target} not found in the array.`,
    visited: [...visited],
  });

  return steps;
}

// Binary search algorithm implementation for the visualizer
async function binarySearchExecute(
  context: SearchingAlgorithmContext, 
  array: number[], 
  target: number
): Promise<number> {
  let left = 0;
  let right = array.length - 1;
  
  while (left <= right) {
    if (!context.isSorting) return -1; // Stop if searching is cancelled
    
    const mid = Math.floor((left + right) / 2);
    
    // Mark current element as visited
    await context.markVisited(mid);
    
    // Compare middle element with target
    const isMatch = await context.compareElement(mid, target);
    
    if (isMatch) {
      // Mark as found and return index
      await context.markFound(mid);
      return mid;
    }
    
    // Decide which half to search
    const isGreater = array[mid] < target;
    
    if (isGreater) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  // Not found
  return -1;
}

export const binarySearch: SearchingAlgorithm = {
  name: 'Binary Search',
  description: 
    'Binary Search is a divide-and-conquer algorithm that finds the position of a target value ' +
    'by comparing it to the middle element of a sorted array. If they are not equal, the half ' +
    'in which the target cannot lie is eliminated and the search continues on the remaining half.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
  },
  spaceComplexity: 'O(1)',
  requiresSorted: true,
  execute: binarySearchExecute,
};
