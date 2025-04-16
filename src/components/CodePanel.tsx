import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import styles from './CodePanel.module.css'; // Import the CSS module

const PSEUDOCODE: Record<string, string[]> = {
  bubbleSort: [
    'for i = 0 to n-1',
    '  for j = 0 to n-i-2',
    '    if arr[j] > arr[j+1]',
    '      swap arr[j] and arr[j+1]',
  ],
  selectionSort: [
    'for i = 0 to n-1',
    '  minIndex = i',
    '  for j = i+1 to n-1',
    '    if arr[j] < arr[minIndex]',
    '      minIndex = j',
    '  swap arr[i] and arr[minIndex]',
  ],
  insertionSort: [
    'for i = 1 to n-1',
    '  key = arr[i]',
    '  j = i-1',
    '  while j >= 0 and arr[j] > key',
    '    arr[j+1] = arr[j]',
    '    j = j-1',
    '  arr[j+1] = key',
  ],
  mergeSort: [
    'function mergeSort(arr, left, right)',
    '  if left < right',
    '    mid = (left + right) / 2',
    '    mergeSort(arr, left, mid)',
    '    mergeSort(arr, mid+1, right)',
    '    merge(arr, left, mid, right)',
  ],
  quickSort: [
    'function quickSort(arr, low, high)',
    '  if low < high',
    '    pi = partition(arr, low, high)',
    '    quickSort(arr, low, pi-1)',
    '    quickSort(arr, pi+1, high)',
  ],
  linearSearch: [
    'for i = 0 to n-1',
    '  if arr[i] == target',
    '    return i',
    'return -1',
  ],
  binarySearch: [
    'left = 0, right = n-1',
    'while left <= right',
    '  mid = (left + right) / 2',
    '  if arr[mid] == target',
    '    return mid',
    '  else if arr[mid] < target',
    '    left = mid + 1',
    '  else',
    '    right = mid - 1',
    'return -1',
  ],
  bfs: [
    'queue = [start]',
    'visited = {start}',
    'while queue not empty',
    '  node = queue.pop()',
    '  for neighbor in graph[node]',
    '    if neighbor not in visited',
    '      visited.add(neighbor)',
    '      queue.push(neighbor)',
  ],
  dfs: [
    'stack = [start]',
    'visited = {}',
    'while stack not empty',
    '  node = stack.pop()',
    '  if node not in visited',
    '    visited.add(node)',
    '    for neighbor in graph[node]',
    '      stack.push(neighbor)',
  ],
};

// Algorithm descriptions for additional context
const ALGO_DESCRIPTIONS: Record<string, string> = {
  bubbleSort: 'Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.',
  selectionSort: 'Selection Sort divides the input into a sorted and an unsorted region, repeatedly finding the minimum element from the unsorted region and moving it to the sorted region.',
  insertionSort: 'Insertion Sort builds the sorted array one item at a time, taking each element from the unsorted part and inserting it into its correct position in the sorted part.',
  mergeSort: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.',
  quickSort: 'Quick Sort works by selecting a pivot element and partitioning the array around the pivot, so elements less than the pivot are on the left and elements greater are on the right.',
  linearSearch: 'Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched.',
  binarySearch: 'Binary Search finds the position of a target value by comparing it to the middle element of a sorted array and eliminating half of the array at each step.',
  bfs: 'Breadth-First Search (BFS) explores all the neighbor nodes at the present depth level before moving to nodes at the next depth level.',
  dfs: 'Depth-First Search (DFS) explores as far as possible along each branch before backtracking, often using a stack to remember where to continue exploration.',
};

const CodePanel: React.FC = () => {
  const { state } = useAppContext();
  const selected = state.selectedAlgorithm;
  const step = state.steps[state.currentStep];

  // For highlighting code lines
  const highlightLine = (step && typeof step.codeLine === 'number')
    ? step.codeLine
    : -1; // Use -1 to indicate no specific line
  const highlightLines = (step && Array.isArray(step.codeLines))
    ? step.codeLines
    : (highlightLine !== -1 ? [highlightLine] : []); // Use array or empty array

  return (
    <section className={styles.codePanel}>
      <h3 className={styles.title}>Code & Explanation</h3>

      {/* Scrollable content area */}
      <div className={styles.scrollableContent}>
        {/* Algorithm overview */}
        {selected && (
          <div className={styles.description}>
            <p>
              {ALGO_DESCRIPTIONS[selected] || `Algorithm visualization for ${selected}`}
            </p>
          </div>
        )}

        {/* Code/Pseudocode Display */}
        <div className={styles.pseudocodeContainer}>
          <div className={styles.pseudocodeHeader}>
            <p className={styles.pseudocodeTitle}>Pseudocode</p>
          </div>
          <div className={styles.pseudocodeBody}>
            {selected && PSEUDOCODE[selected] ? (
              PSEUDOCODE[selected].map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ backgroundColor: 'transparent' }} // Start transparent
                  animate={{
                    backgroundColor: highlightLines.includes(idx)
                      ? 'rgba(99, 102, 241, 0.15)' // Indigo highlight with opacity
                      : 'transparent'
                  }}
                  transition={{ duration: 0.2 }}
                  className={`${styles.codeLine} ${highlightLines.includes(idx) ? styles.codeLineHighlighted : ''}`}
                >
                  <span className={styles.lineNumber}>{idx + 1}</span>
                  {line}
                </motion.div>
              ))
            ) : (
              <p className={styles.placeholderText}>
                Select an algorithm to see its pseudocode.
              </p>
            )}
          </div>
        </div>

        {/* Current Step Explanation Card */}
        <div className={styles.stepExplanationCard}>
          <h4 className={styles.stepExplanationTitle}>Current Step</h4>
          <div className={styles.stepExplanationText}>
            {step && step.description ? (
              <p>{step.description}</p>
            ) : (
              <p className={styles.stepExplanationPlaceholder}>
                {selected
                  ? "Step details will appear here as you progress."
                  : "Select an algorithm to begin visualization."
                }
              </p>
            )}
          </div>
        </div>

        {/* Time & Space Complexity */}
        {selected && (
          <div className={styles.complexityGrid}>
            <div className={styles.complexityBox}>
              <h5 className={styles.complexityTitle}>Time Complexity</h5>
              <p className={styles.complexityValue}>
                {selected.includes('Sort')
                  ? (selected === 'mergeSort' || selected === 'quickSort')
                    ? 'O(n log n)'
                    : 'O(n²)'
                  : selected.includes('Search')
                    ? selected === 'binarySearch' ? 'O(log n)' : 'O(n)'
                    : 'O(V + E)' // Graph algorithms
                }
              </p>
            </div>
            <div className={styles.complexityBox}>
              <h5 className={styles.complexityTitle}>Space Complexity</h5>
              <p className={styles.complexityValue}>
                {selected === 'mergeSort'
                  ? 'O(n)'
                  : selected.includes('bfs') || selected.includes('dfs')
                    ? 'O(V)' // Simplified assumption for graph space
                    : 'O(1)'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CodePanel;
