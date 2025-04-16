// Define the structure for each step in the visualization (reuse BubbleSortStep)
import { BubbleSortStep as InsertionSortStep } from './bubbleSort';

// Insertion Sort algorithm implementation that generates visualization steps
export function getInsertionSortSteps(array: number[]): InsertionSortStep[] {
  const steps: InsertionSortStep[] = [];
  const arr = [...array];
  const n = arr.length;
  const sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: [...arr],
    sortedIndices: [],
    description: 'Initial array state.',
    codeLine: 0,
  });

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    // Highlight the key being inserted
    steps.push({
      array: [...arr],
      comparing: [j, i],
      sortedIndices: [...sortedIndices],
      description: `Inserting element ${key} at index ${i} into the sorted part of the array.`,
      codeLine: 1,
    });

    // Move elements of arr[0..i-1], that are greater than key, to one position ahead
    while (j >= 0 && arr[j] > key) {
      // Highlight the comparison and the shift
      steps.push({
        array: [...arr],
        comparing: [j, i],
        swapping: [j + 1, j],
        sortedIndices: [...sortedIndices],
        description: `Element ${arr[j]} at index ${j} is greater than ${key}. Shifting ${arr[j]} to index ${j + 1}.`,
        codeLine: 4,
      });

      arr[j + 1] = arr[j];
      j = j - 1;

      // Show array state after shift
      steps.push({
        array: [...arr],
        comparing: [j, i],
        sortedIndices: [...sortedIndices],
        description: `Array state after shifting.`,
        codeLine: 5,
      });
    }

    // Insert the key at the correct position
    arr[j + 1] = key;

    // Highlight the insertion
    steps.push({
      array: [...arr],
      swapping: [j + 1, i],
      sortedIndices: [...sortedIndices],
      description: `Inserted element ${key} at index ${j + 1}.`,
      codeLine: 7,
    });

    // Mark the sorted part up to i as sorted for visualization
    sortedIndices.push(i);
    steps.push({
      array: [...arr],
      sortedIndices: [...sortedIndices],
      description: `Elements up to index ${i} are sorted.`,
      codeLine: 0,
    });
  }

  // Mark all indices as sorted in the final step
  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    sortedIndices: allSorted,
    description: 'Final sorted array.',
    codeLine: 0,
  });

  return steps;
}
