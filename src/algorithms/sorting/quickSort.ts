// Define the structure for each step in the visualization (reuse BubbleSortStep)
import { BubbleSortStep as QuickSortStep } from './bubbleSort';
import { SortingAlgorithm, SortingAlgorithmContext } from './types';

// Helper to clone arrays deeply for step recording
function deepClone(arr: number[]): number[] {
  return arr.slice();
}

// Quick Sort algorithm implementation that generates visualization steps
export function getQuickSortSteps(array: number[]): QuickSortStep[] {
  const steps: QuickSortStep[] = [];
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

  function quickSort(start: number, end: number, indicesSorted: number[]) {
    if (start >= end) {
      if (start === end && !indicesSorted.includes(start)) {
        indicesSorted.push(start);
        steps.push({
          array: deepClone(arr),
          sortedIndices: [...indicesSorted],
          description: `Element at index ${start} is in its final sorted position.`,
          codeLine: 1,
        });
      }
      return;
    }

    // Choose the last element as pivot
    const pivotIndex = end;
    const pivot = arr[pivotIndex];
    let i = start;

    // Highlight the pivot
    steps.push({
      array: deepClone(arr),
      comparing: [pivotIndex, -1],
      sortedIndices: [...indicesSorted],
      description: `Pivot selected: ${pivot} at index ${pivotIndex}.`,
      codeLine: 2,
    });

    for (let j = start; j < end; j++) {
      // Highlight comparison with pivot
      steps.push({
        array: deepClone(arr),
        comparing: [j, pivotIndex],
        sortedIndices: [...indicesSorted],
        description: `Comparing element at index ${j} (${arr[j]}) with pivot (${pivot}).`,
        codeLine: 2,
      });
      if (arr[j] < pivot) {
        // Swap arr[i] and arr[j]
        steps.push({
          array: deepClone(arr),
          swapping: [i, j],
          sortedIndices: [...indicesSorted],
          description: `Swapping ${arr[i]} at index ${i} with ${arr[j]} at index ${j} (less than pivot).`,
          codeLine: 2,
        });
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: deepClone(arr),
          swapping: [i, j],
          sortedIndices: [...indicesSorted],
          description: `Array state after swap.`,
          codeLine: 2,
        });
        i++;
      }
    }

    // Place pivot in the correct position
    steps.push({
      array: deepClone(arr),
      swapping: [i, pivotIndex],
      sortedIndices: [...indicesSorted],
      description: `Placing pivot ${pivot} at index ${i}.`,
      codeLine: 2,
    });
    [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];

    // Mark pivot as sorted
    indicesSorted.push(i);
    steps.push({
      array: deepClone(arr),
      sortedIndices: [...indicesSorted],
      description: `Pivot ${pivot} is now in its final sorted position.`,
      codeLine: 2,
    });

    // Recursively sort left and right partitions
    steps.push({
      array: deepClone(arr),
      sortedIndices: [...indicesSorted],
      description: `Recursively sorting left partition [${start}, ${i - 1}].`,
      codeLine: 3,
    });
    quickSort(start, i - 1, indicesSorted);

    steps.push({
      array: deepClone(arr),
      sortedIndices: [...indicesSorted],
      description: `Recursively sorting right partition [${i + 1}, ${end}].`,
      codeLine: 4,
    });
    quickSort(i + 1, end, indicesSorted);
  }

  quickSort(0, n - 1, sortedIndices);

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

async function quickSortExecute(
  { compareElements, swapElements, markSorted, isSorting }: SortingAlgorithmContext,
  array: number[]
): Promise<void> {
  const n = array.length;

  async function partition(start: number, end: number): Promise<number> {
    const pivotIndex = end;
    let i = start;

    for (let j = start; j < end; j++) {
      if (!isSorting) break;
      
      if (await compareElements(j, pivotIndex)) {
        if (i !== j) {
          await swapElements(i, j);
        }
        i++;
      }
    }

    if (i !== pivotIndex) {
      await swapElements(i, pivotIndex);
    }
    
    markSorted([i]); // Mark pivot position as sorted
    return i;
  }

  async function quickSort(start: number, end: number): Promise<void> {
    if (start >= end || !isSorting) return;

    const pivotIndex = await partition(start, end);
    
    await quickSort(start, pivotIndex - 1);
    await quickSort(pivotIndex + 1, end);
  }

  await quickSort(0, n - 1);
  
  // Mark any remaining unsorted elements
  const remainingElements = Array.from(
    { length: n },
    (_, index) => index
  );
  markSorted(remainingElements);
}

export const quickSort: SortingAlgorithm = {
  name: 'Quick Sort',
  description: 
    'Quick Sort is a divide-and-conquer algorithm that works by selecting a pivot ' +
    'element and partitioning the array around it, such that elements smaller than ' +
    'the pivot are moved to the left and larger elements to the right.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(log n)',
  stable: false,
  execute: quickSortExecute,
};
