import { createContext, useContext, useState, useCallback, PropsWithChildren, useEffect, useRef } from 'react';
// Import tree algorithms
import {
  getBSTInsertSteps,
  getBSTSearchSteps,
  getBSTDeleteSteps,
  getInOrderTraversalSteps,
  getPreOrderTraversalSteps,
  getPostOrderTraversalSteps,
  getLevelOrderTraversalSteps,
} from '../algorithms/tree/bst';

// Tree node structure
export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
  height?: number; 
  color?: 'red' | 'black'; 
}

// Tree operation types
export type TreeOperationType = 'insert' | 'delete' | 'search' | 'inorder' | 'preorder' | 'postorder' | 'levelorder';
export type TreeType = 'bst' | 'avl' | 'redblack';

// Tree visualization step
export interface TreeStep {
  tree: TreeNode | null;
  currentNode: number | null;
  visitedNodes: number[];
  path: number[];
  operation: string;
  description: string;
  codeLine?: number;
  highlightedNodes?: number[];
  comparison?: [number, number];
}

// Tree state interface
interface TreeState {
  root: TreeNode | null;
  currentNode: number | null;
  visitedNodes: number[];
  path: number[];
  isRunning: boolean;
  isPaused: boolean;
  isStepMode: boolean;
  speed: number;
  selectedOperation: TreeOperationType;
  currentStep: number;
  totalSteps: number;
  steps: TreeStep[];
  currentOperation: string;
  treeType: 'bst' | 'avl' | 'redblack';
}

// Tree context interface
interface TreeContextType extends TreeState {
  createRandomTree: (nodeCount: number) => void;
  insertNode: (value: number) => void;
  deleteNode: (value: number) => void;
  searchNode: (value: number) => void;
  traverseInOrder: () => void;
  traversePreOrder: () => void;
  traversePostOrder: () => void;
  traverseLevelOrder: () => void;
  startOperation: (operation: TreeOperationType, value?: number) => Promise<void>;
  pauseOperation: () => void;
  resetTree: () => void;
  replayOperation: () => void;
  setSpeed: (speed: number) => void;
  nextStep: () => void;
  toggleStepMode: () => void;
  setTreeType: (type: 'bst' | 'avl' | 'redblack') => void;
}

// Create context
const TreeContext = createContext<TreeContextType | null>(null);

// Custom hook to use the tree context
export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

// Helper to calculate tree layout coordinates
const calculateTreeLayout = (root: TreeNode | null): TreeNode | null => {
  if (!root) return null;
  
  // Clone tree to avoid mutating the original
  const cloneTree = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      value: node.value,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
      height: node.height,
      color: node.color
    };
  };
  
  const tree = cloneTree(root);
  
  // Get tree dimensions
  const getTreeDimensions = (node: TreeNode | null): { depth: number; width: number } => {
    if (!node) return { depth: 0, width: 1 };
    
    const left = getTreeDimensions(node.left);
    const right = getTreeDimensions(node.right);
    
    return {
      depth: Math.max(left.depth, right.depth) + 1,
      width: left.width + right.width
    };
  };
  
  const dimensions = getTreeDimensions(tree);
  const verticalSpacing = 80;
  const horizontalSpacing = 60;
  const width = dimensions.width * horizontalSpacing;
  
  // Calculate the positions
  const setCoordinates = (
    node: TreeNode | null,
    depth: number = 0,
    leftBound: number = 0,
    rightBound: number = width
  ): number => {
    if (!node) return 0;
    
    const y = verticalSpacing + depth * verticalSpacing; // Vertical spacing
    const midPoint = (leftBound + rightBound) / 2;
    
    // Set coordinates for current node
    node.x = midPoint;
    node.y = y;
    
    // Position children
    if (node.left) setCoordinates(node.left, depth + 1, leftBound, midPoint);
    if (node.right) setCoordinates(node.right, depth + 1, midPoint, rightBound);
    
    return midPoint;
  };
  
  setCoordinates(tree);
  return tree;
};

// Provider component
export const TreeProvider = ({ children }: PropsWithChildren) => {
  // Initialize state
  const [state, setState] = useState<TreeState>({
    root: null,
    currentNode: null,
    visitedNodes: [],
    path: [],
    isRunning: false,
    isPaused: false,
    isStepMode: false,
    speed: 1,
    selectedOperation: 'insert',
    currentStep: 0,
    totalSteps: 0,
    steps: [],
    currentOperation: '',
    treeType: 'bst',
  });

  // Refs for managing animations and async operations
  const treeRef = useRef({
    isRunning: false,
    isPaused: false,
    isStepMode: false,
    isWaitingForStep: false,
    timeoutIds: [] as number[],
    promiseResolve: null as null | (() => void),
  });

  // Animation function
  const animateSteps = useCallback(async (steps: TreeStep[]) => {
    treeRef.current.isRunning = true;
    
    for (let i = 0; i < steps.length; i++) {
      // Check for pause
      if (treeRef.current.isPaused) {
        await new Promise<void>(resolve => {
          treeRef.current.promiseResolve = resolve;
        });
      }

      // Check for step mode
      if (treeRef.current.isStepMode) {
        treeRef.current.isWaitingForStep = true;
        treeRef.current.isPaused = true;
        setState(prev => ({ ...prev, isPaused: true }));
        
        await new Promise<void>(resolve => {
          treeRef.current.promiseResolve = resolve;
        });
        
        treeRef.current.isWaitingForStep = false;
      }

      // Update state for current step
      setState(prev => ({
        ...prev,
        currentStep: i,
        currentNode: steps[i].currentNode,
        visitedNodes: steps[i].visitedNodes,
        path: steps[i].path,
        currentOperation: steps[i].description,
      }));

      // Wait for the appropriate time based on speed
      if (i < steps.length - 1 && !treeRef.current.isStepMode) {
        await new Promise<void>(resolve => {
          const timeoutId = setTimeout(() => {
            resolve();
          }, 1000 / state.speed);
          treeRef.current.timeoutIds.push(timeoutId);
        });
      }
    }

    treeRef.current.isRunning = false;
    treeRef.current.isPaused = false;
    treeRef.current.isWaitingForStep = false;
    
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentOperation: `${state.selectedOperation} operation completed`,
    }));
  }, [state.speed, state.selectedOperation]);

  // Start an operation
  const startOperation = useCallback(async (operation: TreeOperationType, value?: number) => {
    // Clear any running operations
    treeRef.current.timeoutIds.forEach(id => clearTimeout(id));
    treeRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentStep: 0,
      steps: [],
      selectedOperation: operation,
      currentOperation: `Starting ${operation} operation...`,
    }));

    // Generate steps based on operation
    let steps: TreeStep[] = [];
    let root = state.root;

    switch (operation) {
      case 'insert':
        if (value !== undefined) {
          const [newRoot, insertSteps] = getBSTInsertSteps(state.root, value);
          root = newRoot;
          steps = insertSteps;
        }
        break;
      case 'delete':
        if (value !== undefined) {
          const [newRoot, deleteSteps] = getBSTDeleteSteps(state.root, value);
          root = newRoot;
          steps = deleteSteps;
        }
        break;
      case 'search':
        if (value !== undefined) {
          steps = getBSTSearchSteps(state.root, value);
        }
        break;
      case 'inorder':
        steps = getInOrderTraversalSteps(state.root);
        break;
      case 'preorder':
        steps = getPreOrderTraversalSteps(state.root);
        break;
      case 'postorder':
        steps = getPostOrderTraversalSteps(state.root);
        break;
      case 'levelorder':
        steps = getLevelOrderTraversalSteps(state.root);
        break;
    }

    // Update state with steps
    setState(prev => ({
      ...prev,
      root,
      totalSteps: steps.length,
      steps,
      currentOperation: `${operation} operation prepared with ${steps.length} steps`,
    }));

    // Run the animation
    await animateSteps(steps);
  }, [state.root, animateSteps]);

  // Function to insert a node
  const insertNode = useCallback((value: number) => {
    startOperation('insert', value);
  }, [startOperation]);

  // Function to search for a node
  const searchNode = useCallback((value: number) => {
    startOperation('search', value);
  }, [startOperation]);

  // Implement other operations
  const deleteNode = useCallback((value: number) => {
    startOperation('delete', value);
  }, [startOperation]);

  const traverseInOrder = useCallback(() => {
    startOperation('inorder');
  }, [startOperation]);

  const traversePreOrder = useCallback(() => {
    startOperation('preorder');
  }, [startOperation]);

  const traversePostOrder = useCallback(() => {
    startOperation('postorder');
  }, [startOperation]);

  const traverseLevelOrder = useCallback(() => {
    startOperation('levelorder');
  }, [startOperation]);

  // Pause the animation
  const pauseOperation = useCallback(() => {
    const newPausedState = !treeRef.current.isPaused;
    treeRef.current.isPaused = newPausedState;
    setState(prev => ({ ...prev, isPaused: newPausedState }));
    
    // If unpausing, resolve the promise to continue animation
    if (!newPausedState && treeRef.current.promiseResolve) {
      treeRef.current.promiseResolve();
      treeRef.current.promiseResolve = null;
    }
  }, []);

  // Reset the tree visualization
  const resetTree = useCallback(() => {
    treeRef.current.timeoutIds.forEach(id => clearTimeout(id));
    treeRef.current.timeoutIds = [];
    treeRef.current.isRunning = false;
    treeRef.current.isPaused = false;

    setState(prev => ({
      ...prev,
      currentNode: null,
      visitedNodes: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      currentOperation: 'Reset visualization',
    }));
  }, []);

  // Replay the current operation
  const replayOperation = useCallback(() => {
    if (state.steps.length === 0) return;
    
    treeRef.current.timeoutIds.forEach(id => clearTimeout(id));
    treeRef.current.timeoutIds = [];
    
    setState(prev => ({
      ...prev,
      currentNode: null,
      visitedNodes: [],
      path: [],
      isRunning: true,
      isPaused: false,
      currentStep: 0,
      currentOperation: `Replaying ${state.selectedOperation} operation`,
    }));
    
    animateSteps(state.steps);
  }, [state.steps, state.selectedOperation, animateSteps]);

  // Set animation speed
  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  // Go to next step in step mode
  const nextStep = useCallback(() => {
    if (treeRef.current.isWaitingForStep && treeRef.current.promiseResolve) {
      treeRef.current.promiseResolve();
      treeRef.current.promiseResolve = null;
    }
  }, []);

  // Toggle step mode
  const toggleStepMode = useCallback(() => {
    const newStepMode = !treeRef.current.isStepMode;
    treeRef.current.isStepMode = newStepMode;
    
    // If turning on step mode during animation, pause it
    if (newStepMode && state.isRunning && !state.isPaused) {
      treeRef.current.isPaused = true;
      setState(prev => ({ ...prev, isPaused: true }));
    }
    
    setState(prev => ({ ...prev, isStepMode: newStepMode }));
  }, [state.isRunning, state.isPaused]);

  // Set tree type
  const setTreeType = useCallback((treeType: 'bst' | 'avl' | 'redblack') => {
    setState(prev => ({ ...prev, treeType }));
  }, []);

  // Function to create a random BST
  const createRandomTree = useCallback((nodeCount: number) => {
    // Start with an empty tree
    setState(prev => ({
      ...prev,
      root: null,
      currentNode: null,
      visitedNodes: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      currentOperation: 'Tree generated',
    }));

    // Generate random values
    const values = Array.from({ length: nodeCount }, 
      () => Math.floor(Math.random() * 100));
    
    // Insert values one by one
    let root: TreeNode | null = null;
    for (const value of values) {
      const [newRoot] = getBSTInsertSteps(root, value);
      root = newRoot;
    }

    // Calculate layout for visualization
    const layoutRoot = calculateTreeLayout(root);

    // Update state
    setState(prev => ({
      ...prev,
      root: layoutRoot,
      currentOperation: `Random tree created with ${nodeCount} nodes`,
    }));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      treeRef.current.timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Create a random tree when component mounts
  useEffect(() => {
    createRandomTree(7);
  }, [createRandomTree]);

  return (
    <TreeContext.Provider
      value={{
        ...state,
        createRandomTree,
        insertNode,
        deleteNode,
        searchNode,
        traverseInOrder,
        traversePreOrder,
        traversePostOrder,
        traverseLevelOrder,
        startOperation,
        pauseOperation,
        resetTree,
        replayOperation,
        setSpeed,
        nextStep,
        toggleStepMode,
        setTreeType,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}; 