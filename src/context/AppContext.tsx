import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the application state
interface AppState {
  selectedAlgorithm: string | null;
  steps: any[];
  currentStep: number;
  isPlaying: boolean;
  animationSpeed: number;
  userArray: number[] | null;
  userTarget: number | null;
  userGraph: Record<number, number[]> | null;
  theme: 'light' | 'dark';
}

// Define the shape of the context value (state + update functions)
interface AppContextType {
  state: AppState;
  selectAlgorithm: (algo: string) => void;
  setCurrentStep: (step: number) => void;
  runAlgorithm: (algo: string) => void;
  start: () => void;
  pause: () => void;
  setAnimationSpeed: (speed: number) => void;
  setUserArray: (arr: number[] | null) => void; // Allow null
  setUserTarget: (target: number | null) => void; // Allow null
  setUserGraph: (graph: Record<number, number[]> | null) => void; // Allow null
  toggleTheme: () => void;
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Import algorithm step generators
import { getBubbleSortSteps } from '../algorithms/sorting/bubbleSort';
import { getSelectionSortSteps } from '../algorithms/sorting/selectionSort';
import { getInsertionSortSteps } from '../algorithms/sorting/insertionSort';
import { getMergeSortSteps } from '../algorithms/sorting/mergeSort';
import { getQuickSortSteps } from '../algorithms/sorting/quickSort';
import { getLinearSearchSteps } from '../algorithms/searching/linearSearch';
import { getBinarySearchSteps } from '../algorithms/searching/binarySearch';
import { getBFSSteps } from '../algorithms/graph/bfs';
import { getDFSSteps } from '../algorithms/graph/dfs';

// Create the provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    selectedAlgorithm: null,
    steps: [],
    currentStep: 0,
    isPlaying: false,
    animationSpeed: 5,
    userArray: null,
    userTarget: null,
    userGraph: null,
    theme: 'dark', // Default theme
  });

  // Effect to apply the theme data attribute to the HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', state.theme); // Set data-theme attribute
  }, [state.theme]);

  // Function to update the selected algorithm and run it
  const selectAlgorithm = (algo: string) => {
    runAlgorithm(algo);
    setState(prevState => ({
      ...prevState,
      selectedAlgorithm: algo,
      currentStep: 0,
      isPlaying: false,
    }));
  };

  // Function to set the current step
  const setCurrentStep = (step: number) => {
    setState(prevState => ({
      ...prevState,
      currentStep: step,
    }));
  };

  // Set user array (allow null)
  const setUserArray = (arr: number[] | null) => {
    setState(prevState => ({
      ...prevState,
      userArray: arr, // Can be null now
    }));
  };

  // Set user target (allow null)
  const setUserTarget = (target: number | null) => {
    setState(prevState => ({
      ...prevState,
      userTarget: target, // Can be null now
    }));
  };

  // Set user graph (allow null)
  const setUserGraph = (graph: Record<number, number[]> | null) => {
    setState(prevState => ({
      ...prevState,
      userGraph: graph,
    }));
  };

  // Function to generate steps for the selected algorithm
  const runAlgorithm = (algo: string) => {
    let steps: any[] = [];
    // Use user input if available, otherwise default
    const defaultArray = [5, 2, 9, 1, 6];
    const defaultTarget = 6;
    const defaultGraph = {
      0: [1, 2],
      1: [0, 3],
      2: [0, 4],
      3: [1],
      4: [2],
    };
    const arr = state.userArray && state.userArray.length > 0 ? state.userArray : defaultArray;
    const target = state.userTarget !== null ? state.userTarget : defaultTarget;
    const graph = state.userGraph && Object.keys(state.userGraph).length > 0 ? state.userGraph : defaultGraph;
    switch (algo) {
      case 'bubbleSort':
        steps = getBubbleSortSteps(arr);
        break;
      case 'selectionSort':
        steps = getSelectionSortSteps(arr);
        break;
      case 'insertionSort':
        steps = getInsertionSortSteps(arr);
        break;
      case 'mergeSort':
        steps = getMergeSortSteps(arr);
        break;
      case 'quickSort':
        steps = getQuickSortSteps(arr);
        break;
      case 'linearSearch':
        steps = getLinearSearchSteps(arr, target);
        break;
      case 'binarySearch':
        steps = getBinarySearchSteps([...arr].sort((a, b) => a - b), target);
        break;
      case 'bfs':
        steps = getBFSSteps(graph, 0);
        break;
      case 'dfs':
        steps = getDFSSteps(graph, 0);
        break;
      default:
        steps = [];
    }
    setState(prevState => ({
      ...prevState,
      steps,
      currentStep: 0,
      isPlaying: false,
    }));
  };

  // Start auto-play
  const start = () => {
    setState(prevState => ({
      ...prevState,
      isPlaying: true,
    }));
  };

  // Pause auto-play
  const pause = () => {
    setState(prevState => ({
      ...prevState,
      isPlaying: false,
    }));
  };

  // Set animation speed
  const setAnimationSpeed = (speed: number) => {
    setState(prevState => ({
      ...prevState,
      animationSpeed: speed,
    }));
  };

  // Helper function to toggle theme (moved inside the component)
  const toggleTheme = () => {
    setState((prevState: AppState) => {
      const newTheme = prevState.theme === 'light' ? 'dark' : 'light';
      return { ...prevState, theme: newTheme };
    });
  };

  // Value provided by the context
  const value = {
    state,
    selectAlgorithm,
    setCurrentStep,
    runAlgorithm,
    start,
    pause,
    setAnimationSpeed,
    setUserArray,
    setUserTarget,
    setUserGraph,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
