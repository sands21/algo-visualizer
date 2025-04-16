// Define the structure for each step in the visualization
export interface BubbleSortStep {
  array: number[]; // Current state of the array
  comparing?: [number, number]; // Indices being compared
  swapping?: [number, number]; // Indices being swapped
  sortedIndices?: number[]; // Indices that are finalized/sorted
  description: string; // Explanation of the current step
  codeLine?: number; // Line in pseudocode to highlight
}

// Bubble Sort algorithm implementation that generates visualization steps
export function getBubbleSortSteps(array: number[]): BubbleSortStep[] {
  const steps: BubbleSortStep[] = [];
  const arr = [...array]; // Create a mutable copy
  const n = arr.length;
  let sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: 'Initial array state.',
    codeLine: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    // Last i elements are already in place
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight elements being compared
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        sortedIndices: [...sortedIndices],
        description: `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`,
        codeLine: 2,
      });

      if (arr[j] > arr[j + 1]) {
        // Highlight elements being swapped
        steps.push({
          array: [...arr],
          swapping: [j, j + 1],
          sortedIndices: [...sortedIndices],
          description: `Swapping elements ${arr[j]} and ${arr[j + 1]}.`,
          codeLine: 3,
        });

        // Perform swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        // Show array state after swap
        steps.push({
          array: [...arr],
          swapping: [j, j + 1], // Keep highlighting briefly after swap
          sortedIndices: [...sortedIndices],
          description: `Array state after swapping.`,
          codeLine: 3,
        });
      } else {
         // Indicate no swap needed
         steps.push({
            array: [...arr],
            comparing: [j, j + 1], // Keep highlighting comparison
            sortedIndices: [...sortedIndices],
            description: `Elements ${arr[j]} and ${arr[j + 1]} are in order, no swap needed.`,
            codeLine: 2,
          });
      }
    }
    // Mark the last element of this pass as sorted
    sortedIndices.push(n - 1 - i);
    steps.push({
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: `End of pass ${i + 1}. Element ${arr[n - 1 - i]} is in its final sorted position.`,
        codeLine: 0,
      });

    // If no elements were swapped in this pass, array is sorted
    if (!swapped) {
      // Mark all remaining indices as sorted
      sortedIndices = Array.from({ length: n }, (_, k) => k);
      steps.push({
        array: [...arr],
        sortedIndices: [...sortedIndices],
        description: 'No swaps in the last pass. Array is sorted.',
        codeLine: 0,
      });
      break;
    }
  }

   // Ensure all indices are marked as sorted in the final step if loop finished naturally
   if (sortedIndices.length !== n) {
       sortedIndices = Array.from({ length: n }, (_, k) => k);
   }

  // Final sorted state
  steps.push({
    array: [...arr],
    sortedIndices: [...sortedIndices],
    description: 'Final sorted array.',
    codeLine: 0,
  });

  return steps;
}
