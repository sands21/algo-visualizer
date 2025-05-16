import { createContext, useContext, useState, useCallback, PropsWithChildren, useEffect, useRef } from 'react';
import { getBFSSteps, BFSGraphStep } from '../algorithms/graph/bfs';
import { getDFSSteps, DFSGraphStep } from '../algorithms/graph/dfs';
import { getDijkstraSteps, DijkstraGraphStep } from '../algorithms/graph/dijkstra';

// Define the type for graph algorithms
type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra';

// Define node and edge types
export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  source: number;
  target: number;
  weight: number;
}

// Combined type for algorithm steps
export type GraphStep = BFSGraphStep | DFSGraphStep | DijkstraGraphStep;

// Graph state interface
interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  adjacencyList: Record<number, number[]>;
  startNode: number;
  endNode: number | null;
  visitedNodes: number[];
  currentNode: number | null;
  queue: number[] | [number, number][]; // For BFS (number[]) and Dijkstra ([node, distance][])
  stack: number[]; // For DFS
  path: number[]; // For path finding algorithms
  isRunning: boolean;
  isPaused: boolean;
  isStepMode: boolean;
  speed: number;
  selectedAlgorithm: AlgorithmType;
  currentStep: number;
  totalSteps: number;
  steps: GraphStep[];
  currentOperation: string;
}

// Graph context interface
interface GraphContextType extends GraphState {
  generateRandomGraph: (nodeCount: number, edgeProbability: number) => void;
  createGridGraph: (rows: number, cols: number) => void;
  setStartNode: (nodeId: number) => void;
  setEndNode: (nodeId: number) => void;
  addNode: (x: number, y: number, label?: string) => void;
  removeNode: (nodeId: number) => void;
  addEdge: (source: number, target: number, weight?: number) => void;
  removeEdge: (source: number, target: number) => void;
  startAlgorithm: () => Promise<void>;
  pauseAlgorithm: () => void;
  resetGraph: () => void;
  replayAlgorithm: () => void;
  selectAlgorithm: (algorithm: AlgorithmType) => void;
  setSpeed: (speed: number) => void;
  nextStep: () => void;
  toggleStepMode: () => void;
}

// Create context
const GraphContext = createContext<GraphContextType | null>(null);

// Custom hook to use the graph context
export const useGraph = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};

// Provider component
export const GraphProvider = ({ children }: PropsWithChildren) => {
  // Initialize state
  const [state, setState] = useState<GraphState>({
    nodes: [],
    edges: [],
    adjacencyList: {},
    startNode: 0,
    endNode: null,
    visitedNodes: [],
    currentNode: null,
    queue: [],
    stack: [],
    path: [],
    isRunning: false,
    isPaused: false,
    isStepMode: false,
    speed: 1,
    selectedAlgorithm: 'bfs',
    currentStep: 0,
    totalSteps: 0,
    steps: [],
    currentOperation: '',
  });

  // Refs for managing animations and async operations
  const graphRef = useRef({
    isRunning: false,
    isPaused: false,
    isStepMode: false,
    isWaitingForStep: false,
    timeoutIds: [] as number[],
    promiseResolve: null as null | (() => void),
  });

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      graphRef.current.timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Initialize a small graph when component mounts
  useEffect(() => {
    generateRandomGraph(8, 0.3);
  }, []);

  // Function to generate a random graph
  const generateRandomGraph = useCallback((nodeCount: number, edgeProbability: number) => {
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];
    const newAdjacencyList: Record<number, number[]> = {};

    // Create nodes in a circle layout
    const radius = 150;
    const centerX = 250;
    const centerY = 250;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      newNodes.push({
        id: i,
        x,
        y,
        label: String(i),
      });
      
      newAdjacencyList[i] = [];
    }

    // Create edges with the given probability
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < edgeProbability) {
          // Add edge (undirected graph)
          const weight = Math.floor(Math.random() * 10) + 1;
          newEdges.push({ source: i, target: j, weight });
          
          // Update adjacency list
          newAdjacencyList[i].push(j);
          newAdjacencyList[j].push(i);
        }
      }
    }

    // Update state
    setState(prev => ({
      ...prev,
      nodes: newNodes,
      edges: newEdges,
      adjacencyList: newAdjacencyList,
      startNode: 0,
      endNode: nodeCount > 1 ? nodeCount - 1 : null,
      visitedNodes: [],
      currentNode: null,
      queue: [],
      stack: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      currentOperation: 'Graph generated',
    }));
  }, []);

  // Create a grid graph
  const createGridGraph = useCallback((rows: number, cols: number) => {
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];
    const newAdjacencyList: Record<number, number[]> = {};

    // Node dimensions
    const nodeWidth = 500 / cols;
    const nodeHeight = 500 / rows;

    // Create nodes in a grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = row * cols + col;
        const x = col * nodeWidth + nodeWidth / 2;
        const y = row * nodeHeight + nodeHeight / 2;
        
        newNodes.push({
          id,
          x,
          y,
          label: String(id),
        });
        
        newAdjacencyList[id] = [];
      }
    }

    // Connect nodes in the grid (4-way connections)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = row * cols + col;
        
        // Connect to right neighbor
        if (col < cols - 1) {
          const rightId = id + 1;
          newEdges.push({ source: id, target: rightId, weight: 1 });
          newAdjacencyList[id].push(rightId);
          newAdjacencyList[rightId].push(id);
        }
        
        // Connect to bottom neighbor
        if (row < rows - 1) {
          const bottomId = id + cols;
          newEdges.push({ source: id, target: bottomId, weight: 1 });
          newAdjacencyList[id].push(bottomId);
          newAdjacencyList[bottomId].push(id);
        }
      }
    }

    // Update state
    setState(prev => ({
      ...prev,
      nodes: newNodes,
      edges: newEdges,
      adjacencyList: newAdjacencyList,
      startNode: 0,
      endNode: rows * cols - 1,
      visitedNodes: [],
      currentNode: null,
      queue: [],
      stack: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      currentOperation: 'Grid graph created',
    }));
  }, []);

  // Set start node
  const setStartNode = useCallback((nodeId: number) => {
    setState(prev => ({
      ...prev,
      startNode: nodeId,
      visitedNodes: [],
      currentNode: null,
      queue: [],
      stack: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      currentOperation: `Start node set to ${nodeId}`,
    }));
  }, []);

  // Set end node
  const setEndNode = useCallback((nodeId: number) => {
    setState(prev => ({
      ...prev,
      endNode: nodeId,
      visitedNodes: [],
      currentNode: null,
      queue: [],
      stack: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      currentOperation: `End node set to ${nodeId}`,
    }));
  }, []);

  // Add a new node
  const addNode = useCallback((x: number, y: number, label?: string) => {
    setState(prev => {
      const newId = prev.nodes.length > 0 
        ? Math.max(...prev.nodes.map(node => node.id)) + 1 
        : 0;
      
      const newNode: GraphNode = {
        id: newId,
        x,
        y,
        label: label || String(newId),
      };
      
      const newAdjacencyList = { ...prev.adjacencyList };
      newAdjacencyList[newId] = [];
      
      return {
        ...prev,
        nodes: [...prev.nodes, newNode],
        adjacencyList: newAdjacencyList,
        currentOperation: `Added node ${newId}`,
      };
    });
  }, []);

  // Remove a node
  const removeNode = useCallback((nodeId: number) => {
    setState(prev => {
      // Filter out the node
      const newNodes = prev.nodes.filter(node => node.id !== nodeId);
      
      // Filter out edges connected to this node
      const newEdges = prev.edges.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      );
      
      // Update adjacency list
      const newAdjacencyList = { ...prev.adjacencyList };
      delete newAdjacencyList[nodeId];
      
      // Remove references to this node from other nodes
      Object.keys(newAdjacencyList).forEach(key => {
        newAdjacencyList[Number(key)] = newAdjacencyList[Number(key)]
          .filter(neighbor => neighbor !== nodeId);
      });

      return {
        ...prev,
        nodes: newNodes,
        edges: newEdges,
        adjacencyList: newAdjacencyList,
        currentOperation: `Removed node ${nodeId}`,
      };
    });
  }, []);

  // Add an edge
  const addEdge = useCallback((source: number, target: number, weight: number = 1) => {
    setState(prev => {
      // Check if nodes exist
      if (!prev.nodes.some(node => node.id === source) || 
          !prev.nodes.some(node => node.id === target)) {
        return prev;
      }
      
      // Check if edge already exists
      if (prev.edges.some(edge => 
        (edge.source === source && edge.target === target) || 
        (edge.source === target && edge.target === source)
      )) {
        return prev;
      }
      
      // Add edge
      const newEdge: GraphEdge = { source, target, weight };
      const newEdges = [...prev.edges, newEdge];
      
      // Update adjacency list
      const newAdjacencyList = { ...prev.adjacencyList };
      newAdjacencyList[source] = [...(newAdjacencyList[source] || []), target];
      newAdjacencyList[target] = [...(newAdjacencyList[target] || []), source];
      
      return {
        ...prev,
        edges: newEdges,
        adjacencyList: newAdjacencyList,
        currentOperation: `Added edge from ${source} to ${target} with weight ${weight}`,
      };
    });
  }, []);

  // Remove an edge
  const removeEdge = useCallback((source: number, target: number) => {
    setState(prev => {
      // Filter out the edge
      const newEdges = prev.edges.filter(edge => 
        !((edge.source === source && edge.target === target) || 
          (edge.source === target && edge.target === source))
      );
      
      // Update adjacency list
      const newAdjacencyList = { ...prev.adjacencyList };
      newAdjacencyList[source] = newAdjacencyList[source]
        .filter(neighbor => neighbor !== target);
      newAdjacencyList[target] = newAdjacencyList[target]
        .filter(neighbor => neighbor !== source);
      
      return {
        ...prev,
        edges: newEdges,
        adjacencyList: newAdjacencyList,
        currentOperation: `Removed edge between ${source} and ${target}`,
      };
    });
  }, []);

  // Set animation speed
  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  // Toggle step mode
  const toggleStepMode = useCallback(() => {
    setState(prev => ({ ...prev, isStepMode: !prev.isStepMode }));
    graphRef.current.isStepMode = !graphRef.current.isStepMode;
  }, []);

  // Next step function for manual advancement
  const nextStep = useCallback(() => {
    if (graphRef.current.isWaitingForStep && graphRef.current.promiseResolve) {
      // Resolve the promise to continue to the next step
      graphRef.current.isWaitingForStep = false;
      graphRef.current.promiseResolve();
      graphRef.current.promiseResolve = null;
    }
  }, []);

  // Select algorithm
  const selectAlgorithm = useCallback((algorithm: AlgorithmType) => {
    setState(prev => ({
      ...prev,
      selectedAlgorithm: algorithm,
      visitedNodes: [],
      currentNode: null,
      queue: [],
      stack: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      currentOperation: `Selected algorithm: ${algorithm}`,
    }));
  }, []);

  // Reset graph to initial state
  const resetGraph = useCallback(() => {
    setState(prev => ({
      ...prev,
      visitedNodes: [],
      currentNode: null,
      queue: [],
      stack: [],
      path: [],
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      totalSteps: 0,
      steps: [],
      currentOperation: 'Graph reset',
    }));
  }, []);

  // Start algorithm execution
  const startAlgorithm = useCallback(async () => {
    // Don't start if already running
    if (graphRef.current.isRunning && !graphRef.current.isPaused) {
      return;
    }
    // Set up the algorithm
    let steps: GraphStep[] = [];

    if (state.selectedAlgorithm === 'bfs') {
      steps = getBFSSteps(state.adjacencyList, state.startNode);
    } else if (state.selectedAlgorithm === 'dfs') {
      steps = getDFSSteps(state.adjacencyList, state.startNode);
    } else if (state.selectedAlgorithm === 'dijkstra') {
      steps = getDijkstraSteps(
        state.adjacencyList,
        state.edges,
        state.startNode,
        state.endNode ?? Math.max(...Object.keys(state.adjacencyList).map(Number))
      );
    }

    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      steps,
      totalSteps: steps.length,
      currentStep: 0,
      visitedNodes: [],
      currentNode: null,
      queue: [],
      stack: [],
      path: [],
      currentOperation: `Starting ${prev.selectedAlgorithm}`,
    }));
    
    graphRef.current.isRunning = true;
    graphRef.current.isPaused = false;

    // Run through all steps
    for (let i = 0; i < steps.length; i++) {
      if (!graphRef.current.isRunning) {
        break;
      }

      // Handle pause logic
      if (graphRef.current.isPaused) {
        await new Promise<void>(resolve => {
          const checkInterval = setInterval(() => {
            if (!graphRef.current.isPaused && graphRef.current.isRunning) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          
          graphRef.current.timeoutIds.push(checkInterval as unknown as number);
        });
      }

      // Handle step mode
      if (graphRef.current.isStepMode) {
        await new Promise<void>(resolve => {
          graphRef.current.isWaitingForStep = true;
          graphRef.current.promiseResolve = resolve;

          setState(prev => {
            const step = steps[i];
            const newState = { 
              ...prev, 
              currentStep: i,
              visitedNodes: step.visited,
              currentNode: step.current || null,
              currentOperation: step.description
            };
            
            // Type checking for different algorithms
            if ('queue' in step) {
              newState.queue = step.queue;
            } else {
              newState.queue = [];
            }
            
            if ('stack' in step) {
              newState.stack = step.stack;
            } else {
              newState.stack = [];
            }
            
            if ('path' in step && 'distances' in step) {
              // For Dijkstra's algorithm
              newState.path = step.path;
            }
            
            return newState;
          });
        });
      } else {
        setState(prev => {
          const step = steps[i];
          const newState = { 
            ...prev, 
            currentStep: i,
            visitedNodes: step.visited,
            currentNode: step.current || null,
            currentOperation: step.description
          };
          
          // Type checking for different algorithms
          if ('queue' in step) {
            newState.queue = step.queue;
          } else {
            newState.queue = [];
          }
          
          if ('stack' in step) {
            newState.stack = step.stack;
          } else {
            newState.stack = [];
          }
          
          if ('path' in step && 'distances' in step) {
            // For Dijkstra's algorithm
            newState.path = step.path;
          }
          
          return newState;
        });

        await new Promise<void>(resolve => {
          const timeoutId = setTimeout(() => {
            resolve();
          }, 1000 / state.speed);
          
          graphRef.current.timeoutIds.push(timeoutId);
        });
      }
    }

    // Finish algorithm
    if (graphRef.current.isRunning) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        currentOperation: `${prev.selectedAlgorithm.toUpperCase()} completed`,
      }));
      
      graphRef.current.isRunning = false;
    }
  }, [state.adjacencyList, state.edges, state.selectedAlgorithm, state.startNode, state.endNode, state.speed]);

  // Pause algorithm execution
  const pauseAlgorithm = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    graphRef.current.isPaused = !graphRef.current.isPaused;
  }, []);

  // Replay algorithm
  const replayAlgorithm = useCallback(() => {
    resetGraph();
    startAlgorithm();
  }, [resetGraph, startAlgorithm]);

  // Context value
  const contextValue: GraphContextType = {
    ...state,
    generateRandomGraph,
    createGridGraph,
    setStartNode,
    setEndNode,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    startAlgorithm,
    pauseAlgorithm,
    resetGraph,
    replayAlgorithm,
    selectAlgorithm,
    setSpeed,
    nextStep,
    toggleStepMode,
  };

  return (
    <GraphContext.Provider value={contextValue}>
      {children}
    </GraphContext.Provider>
  );
}; 