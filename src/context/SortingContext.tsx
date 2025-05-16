import { createContext, useContext, useState, useCallback, PropsWithChildren, useEffect, useRef } from 'react';
import { sortingAlgorithms } from '../algorithms/sorting';

type AlgorithmType = 'bubble' | 'quick' | 'merge' | 'insertion' | 'selection';

interface SortingState {
  array: number[];
  initialArray: number[]; // Store the initial array for replay
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  isSorting: boolean;
  isPaused: boolean;
  isStepMode: boolean; // New state for step-by-step mode
  speed: number;
  selectedAlgorithm: AlgorithmType;
  currentStep: number;
  totalSteps: number;
  comparisonCount: number; // Track the number of comparisons made
  swapCount: number; // Track the number of swaps made
  currentOperation: string; // Description of the current operation
}

interface SortingContextType extends SortingState {
  generateNewArray: (size: number) => void;
  setCustomArray: (values: number[]) => void;
  setSpeed: (speed: number) => void;
  startSorting: () => Promise<void>;
  pauseSorting: () => void;
  resetArray: () => void;
  replayArray: () => void;
  selectAlgorithm: (algorithm: AlgorithmType) => void;
  compareElements: (i: number, j: number) => Promise<boolean>;
  swapElements: (i: number, j: number) => Promise<void>;
  markSorted: (indices: number[]) => void;
  nextStep: () => void; // New function to advance to the next step
  toggleStepMode: () => void; // New function to toggle step mode
}

const SortingContext = createContext<SortingContextType | null>(null);

export const useSorting = () => {
  const context = useContext(SortingContext);
  if (!context) {
    throw new Error('useSorting must be used within a SortingProvider');
  }
  return context;
};

export const SortingProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<SortingState>({
    array: [],
    initialArray: [],
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    isSorting: false,
    isPaused: false,
    isStepMode: false, // Default to auto mode
    speed: 1,
    selectedAlgorithm: 'bubble',
    currentStep: 0,
    totalSteps: 0,
    comparisonCount: 0, // Initialize comparison counter
    swapCount: 0, // Initialize swap counter
    currentOperation: '', // Initialize operation description
  });
  
  const sortingRef = useRef({
    isSorting: false,
    isPaused: false,
    isStepMode: false,
    isWaitingForStep: false,
    timeoutIds: [] as number[],
    sortingPromiseResolve: null as null | (() => void),
  });

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      sortingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Initialize array when component mounts
  useEffect(() => {
    generateNewArray(16); // Start with 16 elements (changed from 20)
  }, []);
  
  // Verify the array is properly sorted by comparing values
  const verifySorting = useCallback(() => {
    for (let i = 0; i < state.array.length - 1; i++) {
      if (state.array[i] > state.array[i + 1]) {
        console.error("Array not correctly sorted!");
        return false;
      }
    }
    return true;
  }, [state.array]);
  
  // When sorting is complete, verify and mark all as sorted
  useEffect(() => {
    if (state.isSorting === false && 
        state.sortedIndices.length > 0 && 
        state.sortedIndices.length < state.array.length) {
      // Check if the array is actually sorted
      if (verifySorting()) {
        // Mark all indices as sorted
        setState(prev => ({
          ...prev,
          sortedIndices: Array.from({ length: prev.array.length }, (_, i) => i)
        }));
      }
    }
  }, [state.isSorting, state.sortedIndices.length, state.array.length, verifySorting]);

  // Next step function for manual advancement
  const nextStep = useCallback(() => {
    if (sortingRef.current.isWaitingForStep && sortingRef.current.sortingPromiseResolve) {
      // Resolve the promise to continue to the next step
      sortingRef.current.isWaitingForStep = false;
      sortingRef.current.sortingPromiseResolve();
      sortingRef.current.sortingPromiseResolve = null;
    }
  }, []);

  // Toggle step mode
  const toggleStepMode = useCallback(() => {
    setState(prev => ({ ...prev, isStepMode: !prev.isStepMode }));
    sortingRef.current.isStepMode = !sortingRef.current.isStepMode;
  }, []);

  // Compare two elements with animation
  const compareElements = useCallback(async (i: number, j: number): Promise<boolean> => {
    // Increment comparison count
    setState(prev => ({ 
      ...prev, 
      comparisonCount: prev.comparisonCount + 1,
      currentOperation: `Comparing elements at positions ${i} and ${j}`
    }));

    if (sortingRef.current.isStepMode) {
      // In step mode, we wait for user to press "Next" button
      setState(prev => ({ 
        ...prev, 
        comparingIndices: [i, j],
        currentStep: prev.currentStep + 1,
        totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      }));
      
      return new Promise<boolean>(resolve => {
        sortingRef.current.isWaitingForStep = true;
        sortingRef.current.sortingPromiseResolve = () => {
          let comparisonResult = false;
          setState(prev => {
            comparisonResult = prev.array[i] > prev.array[j];
            return { ...prev, comparingIndices: [] };
          });
          setTimeout(() => {
            resolve(comparisonResult);
          }, 10);
        };
      });
    }

    if (!sortingRef.current.isSorting || sortingRef.current.isPaused) {
      return new Promise(resolve => {
        // Store the timeout ID so we can clear it if needed
        const checkPauseInterval = setInterval(() => {
          if (sortingRef.current.isSorting && !sortingRef.current.isPaused) {
            clearInterval(checkPauseInterval);
            
            setState(prev => ({ 
              ...prev, 
              comparingIndices: [i, j],
              currentStep: prev.currentStep + 1,
              totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
            }));
            
            // Wait for animation
            const timeoutId = setTimeout(() => {
              // Get the comparison result from the latest state
              let comparisonResult = false;
              setState(prev => {
                comparisonResult = prev.array[i] > prev.array[j];
                return { ...prev, comparingIndices: [] };
              });
              
              setTimeout(() => {
                resolve(comparisonResult);
              }, 10);
            }, 1000 / state.speed);
            
            sortingRef.current.timeoutIds.push(timeoutId);
          }
        }, 100);
        
        sortingRef.current.timeoutIds.push(checkPauseInterval as unknown as number);
      });
    }
    
    return new Promise(resolve => {
      setState(prev => ({ 
        ...prev, 
        comparingIndices: [i, j],
        currentStep: prev.currentStep + 1,
        totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      }));
      
      // Wait for animation
      const timeoutId = setTimeout(() => {
        // Get the comparison result from the latest state
        let comparisonResult = false;
        setState(prev => {
          comparisonResult = prev.array[i] > prev.array[j];
          return { ...prev, comparingIndices: [] };
        });
        
        setTimeout(() => {
          resolve(comparisonResult);
        }, 10);
      }, 1000 / state.speed);
      
      sortingRef.current.timeoutIds.push(timeoutId);
    });
  }, [state.speed]);

  // Swap two elements with animation
  const swapElements = useCallback(async (i: number, j: number) => {
    // Increment swap count
    setState(prev => ({ 
      ...prev, 
      swapCount: prev.swapCount + 1,
      currentOperation: `Swapping elements at positions ${i} and ${j}`
    }));

    if (sortingRef.current.isStepMode) {
      // In step mode, we wait for user to press "Next" button
      setState(prev => ({ 
        ...prev, 
        swappingIndices: [i, j],
        currentStep: prev.currentStep + 1,
        totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      }));
      
      return new Promise<void>(resolve => {
        sortingRef.current.isWaitingForStep = true;
        sortingRef.current.sortingPromiseResolve = () => {
          setState(prev => {
            const newArray = [...prev.array];
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            return {
              ...prev,
              array: newArray,
              swappingIndices: [],
            };
          });
          resolve();
        };
      });
    }

    if (!sortingRef.current.isSorting || sortingRef.current.isPaused) {
      return new Promise<void>(resolve => {
        // Store the timeout ID so we can clear it if needed
        const checkPauseInterval = setInterval(() => {
          if (sortingRef.current.isSorting && !sortingRef.current.isPaused) {
            clearInterval(checkPauseInterval);
            
            setState(prev => ({ 
              ...prev, 
              swappingIndices: [i, j],
              currentStep: prev.currentStep + 1,
              totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
            }));
            
            // Wait for animation
            const timeoutId = setTimeout(() => {
              setState(prev => {
                const newArray = [...prev.array];
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
                return {
                  ...prev,
                  array: newArray,
                  swappingIndices: [],
                };
              });
              resolve();
            }, 1000 / state.speed);
            
            sortingRef.current.timeoutIds.push(timeoutId);
          }
        }, 100);
        
        sortingRef.current.timeoutIds.push(checkPauseInterval as unknown as number);
      });
    }
    
    return new Promise<void>(resolve => {
      setState(prev => ({ 
        ...prev, 
        swappingIndices: [i, j],
        currentStep: prev.currentStep + 1,
        totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      }));
      
      // Wait for animation
      const timeoutId = setTimeout(() => {
        setState(prev => {
          const newArray = [...prev.array];
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          return {
            ...prev,
            array: newArray,
            swappingIndices: [],
          };
        });
        resolve();
      }, 1000 / state.speed);
      
      sortingRef.current.timeoutIds.push(timeoutId);
    });
  }, [state.speed]);

  // Mark elements as sorted
  const markSorted = useCallback((indices: number[]) => {
    setState(prev => ({
      ...prev,
      sortedIndices: [...new Set([...prev.sortedIndices, ...indices])],
      currentStep: prev.currentStep + 1,
      totalSteps: Math.max(prev.totalSteps, prev.currentStep + 1),
      currentOperation: `Marking elements as sorted: [${indices.join(', ')}]`
    }));
  }, []);

  // Generate a new random array
  const generateNewArray = useCallback((size: number) => {
    // Clear any ongoing sorting operations
    sortingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    sortingRef.current.isSorting = false;
    sortingRef.current.isPaused = false;
    sortingRef.current.isWaitingForStep = false;
    sortingRef.current.timeoutIds = [];
    
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setState(prev => ({
      ...prev,
      array: newArray,
      initialArray: [...newArray], // Store a copy of the initial array
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      swapCount: 0,
      currentOperation: '',
    }));
  }, []);

  // Set a custom array provided by the user
  const setCustomArray = useCallback((values: number[]) => {
    // Clear any ongoing sorting operations
    sortingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    sortingRef.current.isSorting = false;
    sortingRef.current.isPaused = false;
    sortingRef.current.isWaitingForStep = false;
    sortingRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      array: [...values],
      initialArray: [...values], // Store a copy of the initial array
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      swapCount: 0,
      currentOperation: '',
    }));
  }, []);

  // Set animation speed
  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  // Select sorting algorithm
  const selectAlgorithm = useCallback((algorithm: AlgorithmType) => {
    // Clear any ongoing sorting operations
    sortingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    sortingRef.current.isSorting = false;
    sortingRef.current.isPaused = false;
    sortingRef.current.isWaitingForStep = false;
    sortingRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      selectedAlgorithm: algorithm,
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      swapCount: 0,
      currentOperation: '',
    }));
  }, []);

  // Start sorting
  const startSorting = useCallback(async () => {
    // If already sorting, resume from pause
    if (state.isPaused) {
      sortingRef.current.isPaused = false;
      setState(prev => ({ ...prev, isPaused: false, isSorting: true }));
      return;
    }
    
    // If already sorting, don't start again
    if (state.isSorting) return;
    
    const algorithm = sortingAlgorithms[state.selectedAlgorithm];
    if (!algorithm) return;
    
    // Clear any remaining timeouts
    sortingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    sortingRef.current.timeoutIds = [];

    // Set sorting state
    sortingRef.current.isSorting = true;
    sortingRef.current.isPaused = false;
    sortingRef.current.isStepMode = state.isStepMode;
    
    setState(prev => ({ 
      ...prev, 
      isSorting: true,
      isPaused: false,
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      swapCount: 0,
      currentOperation: `Starting ${algorithm.name} algorithm`,
    }));

    try {
      // Create a context object with a getter for isSorting to always use the latest value
      const algorithmContext = {
        compareElements,
        swapElements,
        markSorted,
        // Use a getter to always return the current value from the ref
        get isSorting() {
          return sortingRef.current.isSorting;
        }
      };
      
      await algorithm.execute(algorithmContext, [...state.array]);
      
      // Mark all indices as sorted when done - with a small delay to ensure animations complete
      if (sortingRef.current.isSorting) {
        const finalTimeoutId = setTimeout(() => {
          // Verify array is sorted using values
          if (verifySorting()) {
            setState(prev => ({
              ...prev,
              sortedIndices: Array.from({ length: prev.array.length }, (_, i) => i),
              isSorting: false,
              currentStep: prev.totalSteps,
              currentOperation: 'Sorting completed successfully',
            }));
          }
        }, 500);
        
        sortingRef.current.timeoutIds.push(finalTimeoutId);
      }
    } catch (error) {
      console.error('Error during sorting:', error);
    } finally {
      // Don't set isSorting to false immediately, let the final timeout handle it
      sortingRef.current.isSorting = false;
    }
  }, [state.selectedAlgorithm, state.array, state.isSorting, state.isPaused, state.isStepMode, verifySorting, compareElements, swapElements, markSorted]);

  // Pause sorting
  const pauseSorting = useCallback(() => {
    sortingRef.current.isPaused = true;
    setState(prev => ({ ...prev, isPaused: true, isSorting: false }));
  }, []);

  // Reset array to unsorted state (keeps the same values)
  const resetArray = useCallback(() => {
    // Clear any ongoing sorting operations
    sortingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    sortingRef.current.isSorting = false;
    sortingRef.current.isPaused = false;
    sortingRef.current.isWaitingForStep = false;
    sortingRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      array: [...prev.initialArray], // Use a new copy of the initial array
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      swapCount: 0,
      currentOperation: '',
    }));
  }, []);

  // Replay sorting with the same array
  const replayArray = useCallback(() => {
    // Clear any ongoing sorting operations
    sortingRef.current.timeoutIds.forEach(id => clearTimeout(id));
    sortingRef.current.isSorting = false;
    sortingRef.current.isPaused = false;
    sortingRef.current.isWaitingForStep = false;
    sortingRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      array: [...prev.initialArray], // Reset to initial array
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: [],
      isSorting: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      comparisonCount: 0,
      swapCount: 0,
      currentOperation: '',
    }));
  }, []);

  return (
    <SortingContext.Provider
      value={{
        ...state,
        generateNewArray,
        setCustomArray,
        setSpeed,
        startSorting,
        pauseSorting,
        resetArray,
        replayArray,
        selectAlgorithm,
        compareElements,
        swapElements,
        markSorted,
        nextStep,
        toggleStepMode,
      }}
    >
      {children}
    </SortingContext.Provider>
  );
}; 