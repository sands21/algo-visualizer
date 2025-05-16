export interface SortingAlgorithmContext {
  compareElements: (i: number, j: number) => Promise<boolean>;
  swapElements: (i: number, j: number) => Promise<void>;
  markSorted: (indices: number[]) => void;
  isSorting: boolean;
}

export interface SortingAlgorithm {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  execute: (context: SortingAlgorithmContext, array: number[]) => Promise<void>;
} 