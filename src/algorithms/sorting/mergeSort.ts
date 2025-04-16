// Define the structure for each step in the visualization (reuse BubbleSortStep)
import { BubbleSortStep as MergeSortStep } from './bubbleSort';

// Helper to clone arrays deeply for step recording
function deepClone(arr: number[]): number[] {
  return arr.slice();
}

// Merge Sort algorithm implementation that generates visualization steps
export function getMergeSortSteps(array: number[]): MergeSortStep[] {
  const steps: MergeSortStep[] = [];
  const arr = deepClone(array);
  const n = arr.length;
  const sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: deepClone(arr),
    sortedIndices: [],
    description: 'Initial array state.',
    codeLine: 0,
  });

  function mergeSort(start: number, end: number, indicesSorted: number[]) {
    if (start >= end) {
      if (!indicesSorted.includes(start) && start < n) {
        indicesSorted.push(start);
      }
      return;
    }
    const mid = Math.floor((start + end) / 2);

    // Recursive sort left half
    steps.push({
      array: deepClone(arr),
      sortedIndices: [...indicesSorted],
      description: `Recursively sorting left half [${start}, ${mid}].`,
      codeLine: 3,
    });
    mergeSort(start, mid, indicesSorted);

    // Recursive sort right half
    steps.push({
      array: deepClone(arr),
      sortedIndices: [...indicesSorted],
      description: `Recursively sorting right half [${mid + 1}, ${end}].`,
      codeLine: 4,
    });
    mergeSort(mid + 1, end, indicesSorted);

    // Merge step
    let left = start;
    let right = mid + 1;
    const temp: number[] = [];
    const mergeIndices: number[] = [];

    while (left <= mid && right <= end) {
      // Highlight comparison
      steps.push({
        array: deepClone(arr),
        comparing: [left, right],
        sortedIndices: [...indicesSorted],
        description: `Comparing elements at index ${left} (${arr[left]}) and ${right} (${arr[right]}) for merging.`,
        codeLine: 5,
      });
      if (arr[left] <= arr[right]) {
        temp.push(arr[left]);
        mergeIndices.push(left);
        left++;
      } else {
        temp.push(arr[right]);
        mergeIndices.push(right);
        right++;
      }
    }
    while (left <= mid) {
      temp.push(arr[left]);
      mergeIndices.push(left);
      left++;
    }
    while (right <= end) {
      temp.push(arr[right]);
      mergeIndices.push(right);
      right++;
    }

    // Copy merged elements back to arr
    for (let i = 0; i < temp.length; i++) {
      arr[start + i] = temp[i];
      // No step pushed inside this loop anymore
    }

    // Push ONE step showing the result of the merge for this segment
    steps.push({
      array: deepClone(arr),
      // comparing: undefined, // Removed highlight attempt
      sortedIndices: [...indicesSorted], // Keep track of globally sorted indices if needed elsewhere
      description: `Merged segment [${start}, ${end}].`,
      codeLine: 5, // Corresponds to the merge operation line
    });


    // Mark this segment as sorted *conceptually* for the next level,
    // but don't push a specific "segment sorted" step unless it's the final one.
    // The actual sorted state is reflected in the array pushed above.
    // We only need the final "all sorted" step.
    // (Removed the intermediate sortedIndices push and related step)

    // If it's the final merge (whole array), mark all indices as sorted for the final step
    if (start === 0 && end === n - 1) {
       for (let i = start; i <= end; i++) {
         if (!indicesSorted.includes(i)) {
           indicesSorted.push(i);
         }
       }
    }
  }

  steps.push({
    array: deepClone(arr),
    sortedIndices: [],
    description: 'Starting merge sort.',
    codeLine: 0,
  });

  mergeSort(0, n - 1, sortedIndices);

  // Final sorted state
  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: deepClone(arr),
    sortedIndices: allSorted,
    description: 'Final sorted array.',
    codeLine: 0,
  });

  return steps;
}
