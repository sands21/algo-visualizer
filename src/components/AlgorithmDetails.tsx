import React from 'react';
import { useSorting } from '../context/SortingContext';
import { useSearching } from '../context/SearchingContext';

// Pseudocode for each algorithm
const PSEUDOCODE: Record<string, string[]> = {
  // Sorting algorithms
  bubble: [
    'function bubbleSort(arr):',
    '    n = length(arr)',
    '    for i from 0 to n-1:',
    '        for j from 0 to n-i-1:',
    '            if arr[j] > arr[j+1]:',
    '                swap(arr[j], arr[j+1])',
    '    return arr',
  ],
  insertion: [
    'function insertionSort(arr):',
    '    n = length(arr)',
    '    for i from 1 to n-1:',
    '        key = arr[i]',
    '        j = i-1',
    '        while j >= 0 and arr[j] > key:',
    '            arr[j+1] = arr[j]',
    '            j = j-1',
    '        arr[j+1] = key',
    '    return arr',
  ],
  selection: [
    'function selectionSort(arr):',
    '    n = length(arr)',
    '    for i from 0 to n-1:',
    '        minIdx = i',
    '        for j from i+1 to n:',
    '            if arr[j] < arr[minIdx]:',
    '                minIdx = j',
    '        if minIdx != i:',
    '            swap(arr[i], arr[minIdx])',
    '    return arr',
  ],
  merge: [
    'function mergeSort(arr):',
    '    if length(arr) <= 1:',
    '        return arr',
    '    mid = length(arr) / 2',
    '    left = mergeSort(arr[0...mid-1])',
    '    right = mergeSort(arr[mid...n])',
    '    return merge(left, right)',
    '',
    'function merge(left, right):',
    '    result = []',
    '    while left.length > 0 and right.length > 0:',
    '        if left[0] <= right[0]:',
    '            result.push(left.shift())',
    '        else:',
    '            result.push(right.shift())',
    '    return result + left + right',
  ],
  quick: [
    'function quickSort(arr, low, high):',
    '    if low < high:',
    '        pivotIdx = partition(arr, low, high)',
    '        quickSort(arr, low, pivotIdx-1)',
    '        quickSort(arr, pivotIdx+1, high)',
    '    return arr',
    '',
    'function partition(arr, low, high):',
    '    pivot = arr[high]',
    '    i = low-1',
    '    for j from low to high-1:',
    '        if arr[j] < pivot:',
    '            i++',
    '            swap(arr[i], arr[j])',
    '    swap(arr[i+1], arr[high])',
    '    return i+1',
  ],
  
  // Searching algorithms
  linear: [
    'function linearSearch(arr, target):',
    '    for i from 0 to length(arr)-1:',
    '        if arr[i] == target:',
    '            return i',
    '    return -1',
  ],
  binary: [
    'function binarySearch(arr, target):',
    '    left = 0',
    '    right = length(arr) - 1',
    '    while left <= right:',
    '        mid = (left + right) / 2',
    '        if arr[mid] == target:',
    '            return mid',
    '        else if arr[mid] < target:',
    '            left = mid + 1',
    '        else:',
    '            right = mid - 1',
    '    return -1',
  ],
  jump: [
    'function jumpSearch(arr, target):',
    '    n = length(arr)',
    '    step = sqrt(n)',
    '    prev = 0',
    '    while arr[min(step, n)-1] < target:',
    '        prev = step',
    '        step += sqrt(n)',
    '        if prev >= n:',
    '            return -1',
    '    while arr[prev] < target:',
    '        prev++',
    '        if prev == min(step, n):',
    '            return -1',
    '    if arr[prev] == target:',
    '        return prev',
    '    return -1',
  ],
  interpolation: [
    'function interpolationSearch(arr, target):',
    '    low = 0',
    '    high = length(arr) - 1',
    '    while low <= high and target >= arr[low] and target <= arr[high]:',
    '        if low == high:',
    '            if arr[low] == target:',
    '                return low',
    '            return -1',
    '        pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])',
    '        if arr[pos] == target:',
    '            return pos',
    '        if arr[pos] < target:',
    '            low = pos + 1',
    '        else:',
    '            high = pos - 1',
    '    return -1',
  ],
};

// Algorithm descriptions
const ALGORITHM_DESCRIPTIONS: Record<string, string> = {
  // Sorting algorithms
  bubble: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. This process is repeated until the list is sorted.',
  insertion: 'Insertion Sort works by building a sorted array one element at a time, taking each element from the unsorted part and inserting it into its correct position in the sorted part.',
  selection: 'Selection Sort works by repeatedly finding the minimum element from the unsorted portion of the array and placing it at the beginning of the sorted portion.',
  merge: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves to produce a sorted output.',
  quick: 'Quick Sort works by selecting a pivot element and partitioning the array around the pivot, such that elements smaller than the pivot are moved to the left and larger elements to the right.',
  
  // Searching algorithms
  linear: 'Linear Search is the simplest searching algorithm that works by sequentially checking each element of the list until a match is found or the whole list has been searched.',
  binary: 'Binary Search is a divide-and-conquer algorithm that finds the position of a target value by comparing it to the middle element of a sorted array and eliminating half of the array at each step.',
  jump: 'Jump Search works by jumping ahead by fixed steps (typically sqrt(n)) and then performing a linear search in the block where the element is expected to be found.',
  interpolation: 'Interpolation Search is an improved variant of binary search that works by estimating the position of the target value using a formula based on the values at the low and high indices.',
};

// Time and space complexity information
const COMPLEXITY_INFO: Record<string, {
  timeWorst: string;
  timeAverage: string;
  timeBest: string;
  space: string;
  stable?: boolean;
  requires?: string;
}> = {
  // Sorting algorithms
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
  
  // Searching algorithms
  linear: {
    timeWorst: 'O(n)',
    timeAverage: 'O(n/2)',
    timeBest: 'O(1)',
    space: 'O(1)',
    requires: 'None. Works with both sorted and unsorted arrays.',
  },
  binary: {
    timeWorst: 'O(log n)',
    timeAverage: 'O(log n)',
    timeBest: 'O(1)',
    space: 'O(1)',
    requires: 'Sorted array.',
  },
  jump: {
    timeWorst: 'O(n)',
    timeAverage: 'O(√n)',
    timeBest: 'O(1)',
    space: 'O(1)',
    requires: 'Sorted array.',
  },
  interpolation: {
    timeWorst: 'O(n)',
    timeAverage: 'O(log log n)',
    timeBest: 'O(1)',
    space: 'O(1)',
    requires: 'Sorted array with uniformly distributed values.',
  },
};

// Component to display algorithm details with proper pseudocode and descriptions
const AlgorithmDetailsContent: React.FC<{ algorithmName: string; isSearching: boolean }> = ({ 
  algorithmName, 
  isSearching 
}) => {
  const pseudocode = PSEUDOCODE[algorithmName] || [];
  const description = ALGORITHM_DESCRIPTIONS[algorithmName] || 'Algorithm description not available.';
  const complexity = COMPLEXITY_INFO[algorithmName] || null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark">
        {isSearching 
          ? `Searching Algorithm: ${algorithmName.charAt(0).toUpperCase() + algorithmName.slice(1)} Search`
          : `Sorting Algorithm: ${algorithmName.charAt(0).toUpperCase() + algorithmName.slice(1)} Sort`
        }
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
                <li><span className="font-code">Best Case:</span> {complexity.timeBest}</li>
                <li><span className="font-code">Average Case:</span> {complexity.timeAverage}</li>
                <li><span className="font-code">Worst Case:</span> {complexity.timeWorst}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">Space Complexity</h4>
              <p className="text-xs mt-1">{complexity.space}</p>
              {complexity.stable !== undefined && (
                <p className="text-xs mt-2">
                  <span className="font-medium">Stability:</span> {complexity.stable ? 'Stable' : 'Not stable'}
                </p>
              )}
              {complexity.requires && (
                <p className="text-xs mt-2">
                  <span className="font-medium">Requirements:</span> {complexity.requires}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Pseudocode */}
      <div className="p-3 bg-background dark:bg-background-dark rounded-md">
        <h3 className="text-md font-medium text-text dark:text-text-dark mb-2">Pseudocode</h3>
        <pre className="bg-card dark:bg-card-dark p-3 rounded-md overflow-x-auto text-xs font-code">
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

// Sorting-specific details component
const SortingDetails: React.FC = () => {
  // This will throw an error if not within a SortingProvider
  try {
    const { selectedAlgorithm } = useSorting();
    return <AlgorithmDetailsContent algorithmName={selectedAlgorithm} isSearching={false} />;
  } catch (error) {
    return (
      <div className="p-4 bg-error/10 dark:bg-error/20 rounded-md text-error">
        Sorting context not available. Please reload the page.
      </div>
    );
  }
};

// Searching-specific details component
const SearchingDetails: React.FC = () => {
  // This will throw an error if not within a SearchingProvider
  try {
    const { selectedAlgorithm } = useSearching();
    return <AlgorithmDetailsContent algorithmName={selectedAlgorithm} isSearching={true} />;
  } catch (error) {
    return (
      <div className="p-4 bg-error/10 dark:bg-error/20 rounded-md text-error">
        Searching context not available. Please reload the page.
      </div>
    );
  }
};

interface AlgorithmDetailsProps {
  type: 'sorting' | 'searching';
}

export const AlgorithmDetails: React.FC<AlgorithmDetailsProps> = ({ type }) => {
  // Render the appropriate details component based on type
  return type === 'sorting' ? <SortingDetails /> : <SearchingDetails />;
}; 