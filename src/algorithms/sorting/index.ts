import { SortingAlgorithm } from './types';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';

export const sortingAlgorithms: Record<string, SortingAlgorithm> = {
  bubble: bubbleSort,
  quick: quickSort,
  merge: mergeSort,
  insertion: insertionSort,
  selection: selectionSort,
};

export * from './types';
export * from './bubbleSort';
export * from './quickSort';
export * from './mergeSort';
export * from './insertionSort';
export * from './selectionSort'; 