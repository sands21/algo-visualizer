export interface SearchingAlgorithmContext {
  compareElement: (index: number, target: number) => Promise<boolean>;
  markVisited: (index: number) => void;
  markFound: (index: number) => void;
  isSorting: boolean;
}

export interface SearchingAlgorithm {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  requiresSorted: boolean;
  execute: (context: SearchingAlgorithmContext, array: number[], target: number) => Promise<number>;
}

export interface SearchStep {
  array: number[];
  currentIndex: number;
  foundIndex?: number;
  target: number;
  description: string;
  visited: number[];
  // Additional properties for specific algorithms
  left?: number;
  right?: number;
  mid?: number;
} 