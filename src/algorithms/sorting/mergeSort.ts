// Define the structure for each step in the visualization (reuse BubbleSortStep)
import { BubbleSortStep as MergeSortStep } from './bubbleSort';
import { SortingAlgorithm, SortingAlgorithmContext } from './types';

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

async function mergeSortExecute(
  { swapElements, markSorted, isSorting }: SortingAlgorithmContext,
  array: number[]
): Promise<void> {
  const n = array.length;

  async function merge(start: number, mid: number, end: number): Promise<void> {
    const leftSize = mid - start + 1;
    const rightSize = end - mid;
    
    // Create temporary arrays
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    
    while (i < leftSize && j < rightSize && isSorting) {
      // Compare elements from left and right arrays
      const leftIndex = start + i;
      const rightIndex = mid + 1 + j;
      
      if (leftArray[i] <= rightArray[j]) {
        if (array[k] !== leftArray[i]) {
          await swapElements(k, leftIndex);
        }
        i++;
      } else {
        if (array[k] !== rightArray[j]) {
          await swapElements(k, rightIndex);
        }
        j++;
      }
      k++;
    }
    
    // Copy remaining elements
    while (i < leftSize && isSorting) {
      if (array[k] !== leftArray[i]) {
        await swapElements(k, start + i);
      }
      i++;
      k++;
    }
    
    while (j < rightSize && isSorting) {
      if (array[k] !== rightArray[j]) {
        await swapElements(k, mid + 1 + j);
      }
      j++;
      k++;
    }
    
    // Mark the merged segment as sorted
    const sortedIndices = Array.from(
      { length: end - start + 1 },
      (_, idx) => start + idx
    );
    markSorted(sortedIndices);
  }

  async function mergeSort(start: number, end: number): Promise<void> {
    if (start >= end || !isSorting) return;
    
    const mid = Math.floor((start + end) / 2);
    
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
  }

  await mergeSort(0, n - 1);
  
  // Mark all elements as sorted at the end
  const allIndices = Array.from({ length: n }, (_, i) => i);
  markSorted(allIndices);
}

export const mergeSort: SortingAlgorithm = {
  name: 'Merge Sort',
  description: 
    'Merge Sort is a divide-and-conquer algorithm that recursively divides the array into ' +
    'smaller subarrays, sorts them, and then merges them back together to create the final sorted array.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  stable: true,
  execute: mergeSortExecute,
};
