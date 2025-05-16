import { createContext, useContext, useState, useCallback, PropsWithChildren, useEffect, useRef } from 'react';
import { searchingAlgorithms } from '../algorithms/searching';

type AlgorithmType = 'linear' | 'binary' | 'jump' | 'interpolation';

interface SearchingState {
  array: number[];
  initialArray: number[]; // Store the initial array for replay
  target: number;
  visitedIndices: number[];
  currentIndex: number;
  foundIndex: number | null;
  isSorting: boolean;
  isPaused: boolean;
  isStepMode: boolean;
  speed: number;
  selectedAlgorithm: AlgorithmType;
  currentStep: number;
  totalSteps: number;
  comparisonCount: number;
  currentOperation: string;
  isSorted: boolean; // Flag to indicate whether the array needs to be sorted
}

interface SearchingContextType extends SearchingState {
  generateNewArray: (size: number) => void;
  setCustomArray: (values: number[]) => void;
  setSpeed: (speed: number) => void;
  setTarget: (target: number) => void;
  startSearching: () => Promise<void>;
  pauseSearching: () => void;
  resetArray: () => void;
  sortArray: () => void; // For binary search
  replaySearch: () => void;
  selectAlgorithm: (algorithm: AlgorithmType) => void;
  compareElement: (index: number, target: number) => Promise<boolean>;
  markVisited: (index: number) => void;
  markFound: (index: number) => void;
  nextStep: () => void;
  toggleStepMode: () => void;
}

const SearchingContext = createContext<SearchingContextType | null>(null);

export const useSearching = () => {
  const context = useContext(SearchingContext);
  if (!context) {
    throw new Error('useSearching must be used within a SearchingProvider');
  }
  return context;
};

export const SearchingProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<SearchingState>({
    array: [],
    initialArray: [],
    target: 42, // Default target value
    visitedIndices: [],
    currentIndex: -1,
    foundIndex: null,
    isSorting: false,
    isPaused: false,
    isStepMode: false,
    speed: 1,
    selectedAlgorithm: 'linear',
    currentStep: 0,
    totalSteps: 0,
    comparisonCount: 0,
    currentOperation: '',
    isSorted: false,
  });
  
  const searchingRef = useRef({
    isSorting: false,
    isPaused: false,
    isStepMode: false,
    isWaitingForStep: false,
    timeoutIds: [] as number[],
    searchingPromiseResolve: null as null | (() => void),
  });

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      searchingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Initialize array when component mounts
  useEffect(() => {
    generateNewArray(16); // Start with 16 elements
  }, []);
  
  // Next step function for manual advancement
  const nextStep = useCallback(() => {
    if (searchingRef.current.isWaitingForStep && searchingRef.current.searchingPromiseResolve) {
      // Resolve the promise to continue to the next step
      searchingRef.current.isWaitingForStep = false;
      searchingRef.current.searchingPromiseResolve();
      searchingRef.current.searchingPromiseResolve = null;
    }
  }, []);

  // Toggle step mode
  const toggleStepMode = useCallback(() => {
    setState(prev => ({ ...prev, isStepMode: !prev.isStepMode }));
    searchingRef.current.isStepMode = !searchingRef.current.isStepMode;
  }, []);

  // Compare an element with the target
  const compareElement = useCallback(async (index: number, target: number): Promise<boolean> => {
    // Increment comparison count
    setState(prev => ({ 
      ...prev, 
      comparisonCount: prev.comparisonCount + 1,
      currentOperation: `Comparing element at index ${index}: ${prev.array[index]} with target ${target}`
    }));

    if (searchingRef.current.isStepMode) {
      // In step mode, we wait for user to press "Next" button
      setState(prev => ({ 
        ...prev, 
        currentIndex: index,
        currentStep: prev.currentStep + 1,
        totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      }));
      
      return new Promise<boolean>(resolve => {
        searchingRef.current.isWaitingForStep = true;
        searchingRef.current.searchingPromiseResolve = () => {
          let comparisonResult = false;
          setState(prev => {
            comparisonResult = prev.array[index] === target;
            return { ...prev };
          });
          setTimeout(() => {
            resolve(comparisonResult);
          }, 10);
        };
      });
    }

    if (!searchingRef.current.isSorting || searchingRef.current.isPaused) {
      return new Promise(resolve => {
        // Store the timeout ID so we can clear it if needed
        const checkPauseInterval = setInterval(() => {
          if (searchingRef.current.isSorting && !searchingRef.current.isPaused) {
            clearInterval(checkPauseInterval);
            
            setState(prev => ({ 
              ...prev, 
              currentIndex: index,
              currentStep: prev.currentStep + 1,
              totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
            }));
            
            // Wait for animation
            const timeoutId = setTimeout(() => {
              // Get the comparison result
              let comparisonResult = false;
              setState(prev => {
                comparisonResult = prev.array[index] === target;
                return { ...prev };
              });
              
              setTimeout(() => {
                resolve(comparisonResult);
              }, 10);
            }, 1000 / state.speed);
            
            searchingRef.current.timeoutIds.push(timeoutId);
          }
        }, 100);
        
        searchingRef.current.timeoutIds.push(checkPauseInterval as unknown as number);
      });
    }
    
    return new Promise(resolve => {
      setState(prev => ({ 
        ...prev, 
        currentIndex: index,
        currentStep: prev.currentStep + 1,
        totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      }));
      
      // Wait for animation
      const timeoutId = setTimeout(() => {
        // Get the comparison result
        let comparisonResult = false;
        setState(prev => {
          comparisonResult = prev.array[index] === target;
          return { ...prev };
        });
        
        setTimeout(() => {
          resolve(comparisonResult);
        }, 10);
      }, 1000 / state.speed);
      
      searchingRef.current.timeoutIds.push(timeoutId);
    });
  }, [state.speed]);

  // Mark an element as visited during search
  const markVisited = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      visitedIndices: [...prev.visitedIndices, index],
      currentIndex: index,
      currentStep: prev.currentStep + 1,
      totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      currentOperation: `Visiting element at index ${index}: ${prev.array[index]}`
    }));
  }, []);

  // Mark an element as found
  const markFound = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      foundIndex: index,
      currentStep: prev.currentStep + 1,
      totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      currentOperation: `Found target ${prev.target} at index ${index}!`
    }));
  }, []);

  // Generate a new random array
  const generateNewArray = useCallback((size: number) => {
    // Clear any ongoing searching operations
    searchingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    searchingRef.current.isSorting = false;
    searchingRef.current.isPaused = false;
    searchingRef.current.isWaitingForStep = false;
    searchingRef.current.timeoutIds = [];
    
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    
    // For binary search, array needs to be sorted
    const isBinarySearch = state.selectedAlgorithm === 'binary';
    const sortedArray = isBinarySearch ? [...newArray].sort((a, b) => a - b) : newArray;
    
    // Pick a random target from the array
    const randomIndex = Math.floor(Math.random() * size);
    const randomTarget = sortedArray[randomIndex];
    
    setState(prev => ({
      ...prev,
      array: sortedArray,
      initialArray: [...sortedArray],
      target: randomTarget || 42, // Ensure a valid target
      visitedIndices: [],
      currentIndex: -1,
      foundIndex: null,
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      currentOperation: '',
      isSorted: isBinarySearch,
    }));
  }, [state.selectedAlgorithm]);

  // Sort the array (for algorithms that require sorted data)
  const sortArray = useCallback(() => {
    setState(prev => {
      const sortedArray = [...prev.array].sort((a, b) => a - b);
      return {
        ...prev,
        array: sortedArray,
        initialArray: [...sortedArray],
        visitedIndices: [],
        currentIndex: -1,
        foundIndex: null,
        isSorting: false,
        isPaused: false,
        currentStep: 0,
        totalSteps: 0,
        comparisonCount: 0,
        currentOperation: 'Array sorted for binary search',
        isSorted: true,
      };
    });
  }, []);

  // Set a custom array provided by the user
  const setCustomArray = useCallback((values: number[]) => {
    // Clear any ongoing searching operations
    searchingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    searchingRef.current.isSorting = false;
    searchingRef.current.isPaused = false;
    searchingRef.current.isWaitingForStep = false;
    searchingRef.current.timeoutIds = [];
    
    // For binary search, array needs to be sorted
    const isBinarySearch = state.selectedAlgorithm === 'binary';
    const sortedArray = isBinarySearch ? [...values].sort((a, b) => a - b) : values;
    
    // Pick a random target from the array
    const randomIndex = Math.floor(Math.random() * values.length);
    const randomTarget = sortedArray[randomIndex];
    
    setState(prev => ({
      ...prev,
      array: sortedArray,
      initialArray: [...sortedArray],
      target: randomTarget || prev.target,
      visitedIndices: [],
      currentIndex: -1,
      foundIndex: null,
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      currentOperation: '',
      isSorted: isBinarySearch,
    }));
  }, [state.selectedAlgorithm]);

  // Set a specific target value
  const setTarget = useCallback((target: number) => {
    setState(prev => ({
      ...prev,
      target,
      visitedIndices: [],
      currentIndex: -1,
      foundIndex: null,
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      currentOperation: `New target set: ${target}`,
    }));
  }, []);

  // Set animation speed
  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  // Select searching algorithm
  const selectAlgorithm = useCallback((algorithm: AlgorithmType) => {
    // Clear any ongoing searching operations
    searchingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    searchingRef.current.isSorting = false;
    searchingRef.current.isPaused = false;
    searchingRef.current.isWaitingForStep = false;
    searchingRef.current.timeoutIds = [];
    
    const requiresSorted = algorithm === 'binary';
    
    setState(prev => {
      // If switching to binary search and array isn't sorted, sort it
      let newArray = prev.array;
      let newInitialArray = prev.initialArray;
      
      if (requiresSorted && !prev.isSorted) {
        newArray = [...prev.array].sort((a, b) => a - b);
        newInitialArray = [...newArray];
      }
      
      return {
        ...prev,
        selectedAlgorithm: algorithm,
        array: newArray,
        initialArray: newInitialArray,
        visitedIndices: [],
        currentIndex: -1,
        foundIndex: null,
        isSorting: false,
        isPaused: false,
        currentStep: 0,
        totalSteps: 0,
        comparisonCount: 0,
        currentOperation: requiresSorted ? 'Array sorted for binary search' : '',
        isSorted: requiresSorted,
      };
    });
  }, []);

  // Start searching
  const startSearching = useCallback(async () => {
    // If already searching, resume from pause
    if (state.isPaused) {
      searchingRef.current.isPaused = false;
      setState(prev => ({ ...prev, isPaused: false, isSorting: true }));
      return;
    }
    
    // If already searching, don't start again
    if (state.isSorting) return;
    
    const algorithm = searchingAlgorithms[state.selectedAlgorithm];
    if (!algorithm) return;
    
    // Check if algorithm needs sorted array
    if (algorithm.requiresSorted && !state.isSorted) {
      sortArray();
      setState(prev => ({ 
        ...prev, 
        currentOperation: 'Array sorted for binary search',
      }));
      return; // Exit to let the user see the sorted array before starting
    }
    
    // Clear any remaining timeouts
    searchingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    searchingRef.current.timeoutIds = [];

    // Set searching state
    searchingRef.current.isSorting = true;
    searchingRef.current.isPaused = false;
    searchingRef.current.isStepMode = state.isStepMode;
    
    setState(prev => ({ 
      ...prev, 
      isSorting: true,
      isPaused: false,
      visitedIndices: [],
      currentIndex: -1,
      foundIndex: null,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      currentOperation: `Starting ${algorithm.name} search for target ${prev.target}`,
    }));

    try {
      // Create a context object with a getter for isSorting to always use the latest value
      const algorithmContext = {
        compareElement,
        markVisited,
        markFound,
        // Use a getter to always return the current value from the ref
        get isSorting() {
          return searchingRef.current.isSorting;
        }
      };
      
      const result = await algorithm.execute(algorithmContext, [...state.array], state.target);
      
      // Update state with the search result
      if (searchingRef.current.isSorting) {
        setState(prev => ({
          ...prev,
          foundIndex: result >= 0 ? result : null,
          isSorting: false,
          currentOperation: result >= 0 
            ? `Search completed. Target ${prev.target} found at index ${result}!`
            : `Search completed. Target ${prev.target} not found in the array.`,
        }));
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      searchingRef.current.isSorting = false;
    }
  }, [state.selectedAlgorithm, state.array, state.target, state.isSorting, state.isPaused, state.isStepMode, state.isSorted, sortArray, compareElement, markVisited, markFound]);

  // Pause searching
  const pauseSearching = useCallback(() => {
    searchingRef.current.isPaused = true;
    setState(prev => ({ ...prev, isPaused: true, isSorting: false }));
  }, []);

  // Reset array to initial state
  const resetArray = useCallback(() => {
    // Clear any ongoing searching operations
    searchingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    searchingRef.current.isSorting = false;
    searchingRef.current.isPaused = false;
    searchingRef.current.isWaitingForStep = false;
    searchingRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      array: [...prev.initialArray],
      visitedIndices: [],
      currentIndex: -1,
      foundIndex: null,
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      currentOperation: '',
    }));
  }, []);

  // Replay search with the same array and target
  const replaySearch = useCallback(() => {
    // Clear any ongoing searching operations
    searchingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    searchingRef.current.isSorting = false;
    searchingRef.current.isPaused = false;
    searchingRef.current.isWaitingForStep = false;
    searchingRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      visitedIndices: [],
      currentIndex: -1,
      foundIndex: null,
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      currentOperation: '',
    }));
  }, []);

  return (
    <SearchingContext.Provider
      value={{
        ...state,
        generateNewArray,
        setCustomArray,
        setSpeed,
        setTarget,
        startSearching,
        pauseSearching,
        resetArray,
        sortArray,
        replaySearch,
        selectAlgorithm,
        compareElement,
        markVisited,
        markFound,
        nextStep,
        toggleStepMode,
      }}
    >
      {children}
    </SearchingContext.Provider>
  );
}; 