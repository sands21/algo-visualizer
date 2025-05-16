import React from 'react';
import { useSorting } from '../../context/SortingContext';
import { motion } from 'framer-motion';

// Define pseudocode for each algorithm in markdown format
const PSEUDOCODE = {
  bubble: [
    '```',
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
    '```',
  ],
  quick: [
    '```',
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
    '```',
  ],
  merge: [
    '```',
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
    '```',
  ],
  insertion: [
    '```',
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
    '```',
  ],
  selection: [
    '```',
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
    '```',
  ],
};

export const AlgorithmPseudocode: React.FC = () => {
  const { selectedAlgorithm, currentStep } = useSorting();
  
  const pseudocode = PSEUDOCODE[selectedAlgorithm];
  
  if (!pseudocode) {
    return null;
  }
  
  // Map each sorting algorithm to line numbers that should be highlighted during execution
  const getHighlightedLines = (): number[] => {
    if (!currentStep) return [];
    
    switch (selectedAlgorithm) {
      case 'bubble':
        return [4, 5, 6, 7, 8];
      case 'quick':
        return [2, 3, 4, 5, 6, 12, 13, 14, 15, 16];
      case 'merge':
        return [2, 3, 4, 5, 6, 7, 16, 17, 18, 24, 25, 26, 27];
      case 'insertion':
        return [3, 4, 5, 6, 7, 8, 9, 10];
      case 'selection':
        return [3, 4, 5, 6, 7, 8, 9, 10, 11];
      default:
        return [];
    }
  };
  
  const highlightedLines = getHighlightedLines();
  
  return (
    <div className="bg-card dark:bg-card-dark rounded-lg shadow-sm dark:shadow-md border border-border dark:border-border-dark">
      <div className="p-4 border-b border-border dark:border-border-dark flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark">Algorithm Pseudocode</h3>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-text dark:text-text-dark whitespace-pre bg-background dark:bg-background-dark p-4 rounded-md">
          {pseudocode.map((line, index) => {
            // Determine if this line should be highlighted
            const isHighlighted = highlightedLines.includes(index) && line !== '```';
            
            return (
              <motion.div
                key={index}
                className={`py-1 ${
                  isHighlighted
                    ? 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark font-medium px-2 rounded'
                    : ''
                }`}
                // Use initial and whileHover animations instead of animate for backgroundColor
                initial={false}
                transition={{ duration: 0.3 }}
              >
                {line !== '```' ? line : ''}
              </motion.div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}; 