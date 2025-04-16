// Define the structure for each step in the visualization
export interface LinearSearchStep {
  array: number[];
  currentIndex: number;
  foundIndex?: number;
  target: number;
  description: string;
  codeLine?: number; // Add codeLine property
}

// Linear Search algorithm implementation that generates visualization steps
export function getLinearSearchSteps(array: number[], target: number): LinearSearchStep[] {
  const steps: LinearSearchStep[] = [];

  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: [...array],
      currentIndex: i,
      target,
      description: `Checking index ${i}: ${array[i]} ${array[i] === target ? 'is equal to' : 'is not equal to'} target ${target}.`,
      foundIndex: array[i] === target ? i : undefined,
      codeLine: 1, // Corresponds to 'if arr[i] == target'
    });

    if (array[i] === target) {
      steps.push({
        array: [...array],
        currentIndex: i,
        foundIndex: i,
        target,
        description: `Found target ${target} at index ${i}.`,
        codeLine: 2, // Corresponds to 'return i'
      });
      return steps;
    }
  }

  // If not found
  steps.push({
    array: [...array],
    currentIndex: array.length - 1,
    target,
    description: `Target ${target} not found in the array.`,
    foundIndex: undefined,
    codeLine: 3, // Corresponds to 'return -1'
  });

  return steps;
}
