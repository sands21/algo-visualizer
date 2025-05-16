import { SearchingAlgorithm } from './types';
import { linearSearch } from './linearSearch';
import { binarySearch } from './binarySearch';
// Import future algorithms as they're implemented
// import { jumpSearch } from './jumpSearch';
// import { interpolationSearch } from './interpolationSearch';

export const searchingAlgorithms: Record<string, SearchingAlgorithm> = {
  linear: linearSearch,
  binary: binarySearch,
  // Register future algorithms as they're implemented
  // jump: jumpSearch,
  // interpolation: interpolationSearch,
}; 