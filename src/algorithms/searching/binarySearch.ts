// Define the structure for each step in the visualization
export interface BinarySearchStep {
  array: number[];
  left: number;
  right: number;
  mid: number;
  target: number;
  foundIndex?: number;
  description: string;
  codeLine?: number; // Add codeLine property
}

// Binary Search algorithm implementation that generates visualization steps
export function getBinarySearchSteps(array: number[], target: number): BinarySearchStep[] {
  const steps: BinarySearchStep[] = [];
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: [...array],
      left,
      right,
      mid,
      target,
      description: `Checking middle index ${mid}: ${array[mid]}.`,
      foundIndex: array[mid] === target ? mid : undefined,
      codeLine: 2, // Corresponds to 'mid = ...'
    });

    if (array[mid] === target) {
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        foundIndex: mid,
        description: `Found target ${target} at index ${mid}.`,
        codeLine: 4, // Corresponds to 'return mid'
      });
      return steps;
    } else if (array[mid] < target) {
      steps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        description: `Target ${target} is greater than ${array[mid]}. Searching right half.`,
        codeLine: 6, // Corresponds to 'left = mid + 1'
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...array], // Keep only one copy
        left,
        right,
        mid,
        target,
        description: `Target ${target} is less than ${array[mid]}. Searching left half.`,
        codeLine: 8, // Corresponds to 'right = mid - 1'
      });
      right = mid - 1;
    }
  }

  // If not found
  steps.push({
    array: [...array],
    left,
    right,
    mid: -1,
    target,
    foundIndex: undefined,
    description: `Target ${target} not found in the array.`,
    codeLine: 9, // Corresponds to 'return -1'
  });

  return steps;
}
