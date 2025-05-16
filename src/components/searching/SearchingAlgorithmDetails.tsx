import React from 'react';
import { useSearching } from '../../context/SearchingContext';

// Define pseudocode for each algorithm
const PSEUDOCODE: Record<string, string[]> = {
  linear: [
    'function linearSearch(arr, target):',
    '    for i = 0 to length(arr) - 1 do',
    '        if arr[i] == target:',
    '            return i',
    '    return -1',
  ],
  binary: [
    'function binarySearch(arr, target):',
    '    left = 0',
    '    right = length(arr) - 1',
    '    while left <= right do',
    '        mid = Math.floor((left + right) / 2)',
    '        if arr[mid] == target:',
    '            return mid',
    '        if arr[mid] < target:',
    '            left = mid + 1',
    '        else:',
    '            right = mid - 1',
    '    return -1',
  ],
  jump: [
    'function jumpSearch(arr, target):',
    '    n = length(arr)',
    '    step = Math.floor(Math.sqrt(n))',
    '    prev = 0',
    '    while arr[min(step, n) - 1] < target do',
    '        prev = step',
    '        step += Math.floor(Math.sqrt(n))',
    '        if prev >= n:',
    '            return -1',
    '    while arr[prev] < target do',
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
  requires?: string;
}> = {
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

export const SearchingAlgorithmDetails: React.FC = () => {
  const { selectedAlgorithm } = useSearching();
  
  // Get pseudocode and description for the selected algorithm
  const pseudocode = PSEUDOCODE[selectedAlgorithm] || [];
  const description = ALGORITHM_DESCRIPTIONS[selectedAlgorithm] || 'Algorithm description not available.';
  const complexity = COMPLEXITY_INFO[selectedAlgorithm] || null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark">
        Searching Algorithm: {selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)} Search
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