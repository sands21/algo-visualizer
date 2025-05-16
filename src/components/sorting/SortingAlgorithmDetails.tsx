import React from 'react';
import { useSorting } from '../../context/SortingContext';

// Define pseudocode for each algorithm in markdown format
const PSEUDOCODE: Record<string, string[]> = {
  bubble: [
    'procedure bubbleSort(A):',
    '  n = length(A)',
    '  repeat',
    '    swapped = false',
    '    for i = 1 to n-1 do',
    '      if A[i-1] > A[i] then',
    '        swap(A[i-1], A[i])',
    '        swapped = true',
    '      end if',
    '    end for',
    '    n = n-1',
    '  until not swapped',
    'end procedure',
  ],
  quick: [
    'procedure quickSort(A, lo, hi):',
    '  if lo < hi then',
    '    p = partition(A, lo, hi)',
    '    quickSort(A, lo, p - 1)',
    '    quickSort(A, p + 1, hi)',
    '  end if',
    'end procedure',
    '',
    'procedure partition(A, lo, hi):',
    '  pivot = A[hi]',
    '  i = lo - 1',
    '  for j = lo to hi - 1 do',
    '    if A[j] <= pivot then',
    '      i = i + 1',
    '      swap A[i] with A[j]',
    '    end if',
    '  end for',
    '  swap A[i + 1] with A[hi]',
    '  return i + 1',
    'end procedure',
  ],
  merge: [
    'procedure mergeSort(A, lo, hi):',
    '  if lo < hi then',
    '    mid = floor((lo + hi) / 2)',
    '    mergeSort(A, lo, mid)',
    '    mergeSort(A, mid + 1, hi)',
    '    merge(A, lo, mid, hi)',
    '  end if',
    'end procedure',
    '',
    'procedure merge(A, lo, mid, hi):',
    '  n1 = mid - lo + 1',
    '  n2 = hi - mid',
    '  create arrays L[0..n1] and R[0..n2]',
    '  ',
    '  for i = 0 to n1 - 1 do',
    '    L[i] = A[lo + i]',
    '  end for',
    '  ',
    '  for j = 0 to n2 - 1 do',
    '    R[j] = A[mid + 1 + j]',
    '  end for',
    '  ',
    '  i = 0, j = 0, k = lo',
    '  while i < n1 and j < n2 do',
    '    if L[i] <= R[j] then',
    '      A[k] = L[i]',
    '      i = i + 1',
    '    else',
    '      A[k] = R[j]',
    '      j = j + 1',
    '    end if',
    '    k = k + 1',
    '  end while',
    '  ',
    '  while i < n1 do',
    '    A[k] = L[i]',
    '    i = i + 1',
    '    k = k + 1',
    '  end while',
    '  ',
    '  while j < n2 do',
    '    A[k] = R[j]',
    '    j = j + 1',
    '    k = k + 1',
    '  end while',
    'end procedure',
  ],
  insertion: [
    'procedure insertionSort(A):',
    '  n = length(A)',
    '  for i = 1 to n-1 do',
    '    key = A[i]',
    '    j = i-1',
    '    while j >= 0 and A[j] > key do',
    '      A[j+1] = A[j]',
    '      j = j-1',
    '    end while',
    '    A[j+1] = key',
    '  end for',
    'end procedure',
  ],
  selection: [
    'procedure selectionSort(A):',
    '  n = length(A)',
    '  for i = 0 to n-1 do',
    '    min_idx = i',
    '    for j = i+1 to n-1 do',
    '      if A[j] < A[min_idx] then',
    '        min_idx = j',
    '      end if',
    '    end for',
    '    swap A[min_idx] with A[i]',
    '  end for',
    'end procedure',
  ],
};

// Algorithm descriptions
const ALGORITHM_DESCRIPTIONS: Record<string, string> = {
  bubble: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. This process is repeated until the list is sorted.',
  insertion: 'Insertion Sort works by building a sorted array one element at a time, taking each element from the unsorted part and inserting it into its correct position in the sorted part.',
  selection: 'Selection Sort works by repeatedly finding the minimum element from the unsorted portion of the array and placing it at the beginning of the sorted portion.',
  merge: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves to produce a sorted output.',
  quick: 'Quick Sort works by selecting a pivot element and partitioning the array around the pivot, such that elements smaller than the pivot are moved to the left and larger elements to the right.',
};

// Time and space complexity information
const COMPLEXITY_INFO: Record<string, {
  timeWorst: string;
  timeAverage: string;
  timeBest: string;
  space: string;
  stable: boolean;
}> = {
  bubble: {
    timeWorst: 'O(n²)',
    timeAverage: 'O(n²)',
    timeBest: 'O(n)',
    space: 'O(1)',
    stable: true,
  },
  insertion: {
    timeWorst: 'O(n²)',
    timeAverage: 'O(n²)',
    timeBest: 'O(n)',
    space: 'O(1)',
    stable: true,
  },
  selection: {
    timeWorst: 'O(n²)',
    timeAverage: 'O(n²)',
    timeBest: 'O(n²)',
    space: 'O(1)',
    stable: false,
  },
  merge: {
    timeWorst: 'O(n log n)',
    timeAverage: 'O(n log n)',
    timeBest: 'O(n log n)',
    space: 'O(n)',
    stable: true,
  },
  quick: {
    timeWorst: 'O(n²)',
    timeAverage: 'O(n log n)',
    timeBest: 'O(n log n)',
    space: 'O(log n)',
    stable: false,
  },
};

export const SortingAlgorithmDetails: React.FC = () => {
  const { selectedAlgorithm } = useSorting();
  
  // Get pseudocode and description for the selected algorithm
  const pseudocode = PSEUDOCODE[selectedAlgorithm] || [];
  const description = ALGORITHM_DESCRIPTIONS[selectedAlgorithm] || 'Algorithm description not available.';
  const complexity = COMPLEXITY_INFO[selectedAlgorithm] || null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark">
        Sorting Algorithm: {selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)} Sort
      </h2>
      
      {/* Algorithm Description */}
      <div className="p-3 bg-background dark:bg-background-dark rounded-md">
        <h3 className="text-md font-medium text-text dark:text-text-dark mb-2">Description</h3>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">{description}</p>
      </div>
      
      {/* Complexity Information */}
      {complexity && (
        <div className="p-3 bg-background dark:bg-background-dark rounded-md">
          <h3 className="text-md font-medium text-text dark:text-text-dark mb-2">Complexity Analysis</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Time Complexity</h4>
              <ul className="text-xs space-y-1 mt-1">
                <li><span className="font-medium">Best Case:</span> {complexity.timeBest}</li>
                <li><span className="font-medium">Average Case:</span> {complexity.timeAverage}</li>
                <li><span className="font-medium">Worst Case:</span> {complexity.timeWorst}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Space Complexity</h4>
              <p className="text-xs mt-1">{complexity.space}</p>
              <p className="text-xs mt-2">
                <span className="font-medium">Stability:</span> {complexity.stable ? 'Stable' : 'Not stable'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Pseudocode */}
      <div className="p-3 bg-background dark:bg-background-dark rounded-md">
        <h3 className="text-md font-medium text-text dark:text-text-dark mb-2">Pseudocode</h3>
        <pre className="bg-card dark:bg-card-dark p-3 rounded-md overflow-x-auto text-xs font-mono">
          <code>
            {pseudocode.map((line, index) => (
              <div key={index} className="whitespace-pre">
                {line}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}; 