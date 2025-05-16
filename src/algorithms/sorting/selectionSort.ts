// Define the structure for each step in the visualization (can reuse or define specific if needed)
// For simplicity, let's reuse the BubbleSortStep structure for now, adapting field usage.
import { BubbleSortStep as SelectionSortStep } from './bubbleSort'; // Reusing the interface
import { SortingAlgorithm, SortingAlgorithmContext } from './types';

// Selection Sort algorithm implementation that generates visualization steps
export function getSelectionSortSteps(array: number[]): SelectionSortStep[] {
  const steps: SelectionSortStep[] = [];
  const arr = [...array]; // Create a mutable copy
  const n = arr.length;
  const sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: 'Initial array state.',
    codeLine: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    // Highlight the current position we're trying to fill
    steps.push({
        array: [...arr],
        comparing: [i, i], // Highlight the starting index for the minimum search
        sortedIndices: [...sortedIndices],
        description: `Finding the minimum element for index ${i}.`,
        codeLine: 1,
      });

    // Find the minimum element in the unsorted part of the array
    for (let j = i + 1; j < n; j++) {
      // Highlight comparison between current minimum and element j
      steps.push({
        array: [...arr],
        comparing: [minIndex, j],
        sortedIndices: [...sortedIndices],
        description: `Comparing current minimum (${arr[minIndex]} at index ${minIndex}) with element at index ${j} (${arr[j]}).`,
        codeLine: 3,
      });
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        // Highlight the new minimum found
        steps.push({
            array: [...arr],
            comparing: [minIndex, j], // Keep highlighting comparison, minIndex is now j
            sortedIndices: [...sortedIndices],
            description: `New minimum found: ${arr[minIndex]} at index ${minIndex}.`,
            codeLine: 4,
          });
      }
    }

    // If the minimum element is not the starting element, swap them
    if (minIndex !== i) {
       // Highlight elements to be swapped
       steps.push({
        array: [...arr],
        swapping: [i, minIndex],
        sortedIndices: [...sortedIndices],
        description: `Swapping minimum element ${arr[minIndex]} (at index ${minIndex}) with element ${arr[i]} (at index ${i}).`,
        codeLine: 6,
      });

      // Perform swap
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      // Show array state after swap
      steps.push({
        array: [...arr],
        swapping: [i, minIndex], // Keep highlighting briefly
        sortedIndices: [...sortedIndices],
        description: `Array state after swapping.`,
        codeLine: 6,
      });
    } else {
        // Indicate no swap needed as minimum was already at index i
        steps.push({
            array: [...arr],
            comparing: [i,i], // Highlight the element at index i
            sortedIndices: [...sortedIndices],
            description: `Element ${arr[i]} at index ${i} is already the minimum in the unsorted part. No swap needed.`,
            codeLine: 4,
          });
    }

    // Mark index i as sorted
    sortedIndices.push(i);
    steps.push({
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `Element ${arr[i]} is now in its final sorted position.`,
        codeLine: 0,
      });
  }

  // Mark the last element as sorted (it's sorted by default after n-1 passes)
  sortedIndices.push(n - 1);

  // Final sorted state
  steps.push({
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: 'Final sorted array.',
    codeLine: 0,
  });

  return steps;
}

async function selectionSortExecute(
  { compareElements, swapElements, markSorted, isSorting }: SortingAlgorithmContext,
  array: number[]
): Promise<void> {
  const n = array.length;
  
  for (let i = 0; i < n - 1 && isSorting; i++) {
    let minIndex = i;
    
    // Find minimum element in the unsorted portion
    for (let j = i + 1; j < n && isSorting; j++) {
      if (await compareElements(minIndex, j)) {
        minIndex = j;
      }
    }
    
    // Swap if minimum is not at current position
    if (minIndex !== i) {
      await swapElements(i, minIndex);
    }
    
    // Mark current position as sorted
    markSorted([i]);
  }
  
  // Mark the last element as sorted
  markSorted([n - 1]);
  
  // Mark all elements as sorted at the end
  const allIndices = Array.from({ length: n }, (_, i) => i);
  markSorted(allIndices);
}

export const selectionSort: SortingAlgorithm = {
  name: 'Selection Sort',
  description: 
    'Selection Sort works by repeatedly finding the minimum element from the ' +
    'unsorted portion of the array and placing it at the beginning of the sorted portion.',
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  execute: selectionSortExecute,
};
