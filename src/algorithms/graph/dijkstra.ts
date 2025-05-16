// Define the structure for each step in the visualization
export interface DijkstraGraphStep {
  graph: Record<number, number[]>; // adjacency list
  distances: Record<number, number>; // current distance estimates
  previous: Record<number, number | null>; // previous node in shortest path
  visited: number[]; // nodes already processed
  current?: number; // current node being processed
  queue: [number, number][]; // priority queue of [node, distance] pairs
  path: number[]; // current shortest path to target (if found)
  description: string;
  codeLine?: number; // Add codeLine property
}

// Interface for edge with weight
interface WeightedAdjacencyList {
  [key: number]: { node: number; weight: number }[];
}

// Convert normal adjacency list to weighted one
function getWeightedAdjacencyList(
  graph: Record<number, number[]>,
  edges: { source: number; target: number; weight: number }[]
): WeightedAdjacencyList {
  const weightedGraph: WeightedAdjacencyList = {};
  
  // Initialize empty adjacency lists
  Object.keys(graph).forEach(node => {
    weightedGraph[Number(node)] = [];
  });
  
  // Add weighted edges
  edges.forEach(edge => {
    const { source, target, weight } = edge;
    weightedGraph[source].push({ node: target, weight });
    weightedGraph[target].push({ node: source, weight }); // For undirected graph
  });
  
  return weightedGraph;
}

// Dijkstra algorithm implementation that generates visualization steps
export function getDijkstraSteps(
  graph: Record<number, number[]>,
  edges: { source: number; target: number; weight: number }[],
  start: number,
  end: number
): DijkstraGraphStep[] {
  const steps: DijkstraGraphStep[] = [];
  const weightedGraph = getWeightedAdjacencyList(graph, edges);
  
  // Initialize data structures
  const distances: Record<number, number> = {};
  const previous: Record<number, number | null> = {};
  const visited: number[] = [];
  const queue: [number, number][] = []; // Priority queue of [node, distance] pairs
  
  // Initialize distances and previous
  Object.keys(graph).forEach(node => {
    const nodeId = Number(node);
    distances[nodeId] = nodeId === start ? 0 : Infinity;
    previous[nodeId] = null;
  });
  
  // Add start node to queue
  queue.push([start, 0]);
  
  // Initial state
  steps.push({
    graph: { ...graph },
    distances: { ...distances },
    previous: { ...previous },
    visited: [],
    current: start,
    queue: [...queue],
    path: [],
    description: `Start Dijkstra's algorithm from node ${start}.`,
    codeLine: 1, // Corresponds to initialization
  });
  
  while (queue.length > 0) {
    // Sort queue by distance (priority queue simulation)
    queue.sort((a, b) => a[1] - b[1]);
    
    // Get node with minimum distance
    const [currentNode, currentDistance] = queue.shift()!;
    
    // Skip if already visited
    if (visited.includes(currentNode)) {
      continue;
    }
    
    // Add to visited
    visited.push(currentNode);
    
    steps.push({
      graph: { ...graph },
      distances: { ...distances },
      previous: { ...previous },
      visited: [...visited],
      current: currentNode,
      queue: [...queue],
      path: getPath(previous, start, currentNode),
      description: `Visiting node ${currentNode} with current distance ${currentDistance}.`,
      codeLine: 6, // Corresponds to visiting a node
    });
    
    // If we reached the end node, we're done
    if (currentNode === end) {
      const finalPath = getPath(previous, start, end);
      steps.push({
        graph: { ...graph },
        distances: { ...distances },
        previous: { ...previous },
        visited: [...visited],
        queue: [...queue],
        path: finalPath,
        description: `Found shortest path to node ${end} with distance ${distances[end]}.`,
        codeLine: 7, // Corresponds to finding the target
      });
      break;
    }
    
    // Check all neighbors
    for (const { node: neighbor, weight } of weightedGraph[currentNode]) {
      // Skip if already visited
      if (visited.includes(neighbor)) {
        continue;
      }
      
      // Calculate new distance
      const distance = distances[currentNode] + weight;
      
      // If new distance is shorter than the current estimate
      if (distance < distances[neighbor]) {
        // Update distance and previous
        distances[neighbor] = distance;
        previous[neighbor] = currentNode;
        
        // Add to queue
        queue.push([neighbor, distance]);
        
        steps.push({
          graph: { ...graph },
          distances: { ...distances },
          previous: { ...previous },
          visited: [...visited],
          current: neighbor,
          queue: [...queue],
          path: getPath(previous, start, neighbor),
          description: `Updated distance to node ${neighbor} via ${currentNode}: ${distance}.`,
          codeLine: 12, // Corresponds to updating distance
        });
      }
    }
  }
  
  // If we didn't reach the end node
  if (!visited.includes(end)) {
    steps.push({
      graph: { ...graph },
      distances: { ...distances },
      previous: { ...previous },
      visited: [...visited],
      queue: [],
      path: [],
      description: `No path found from node ${start} to node ${end}.`,
      codeLine: 15, // Corresponds to no path found
    });
  }
  
  return steps;
}

// Helper function to reconstruct the path
function getPath(previous: Record<number, number | null>, start: number, end: number): number[] {
  const path: number[] = [];
  let current: number | null = end;
  
  while (current !== null && current !== start) {
    path.unshift(current);
    current = previous[current] !== undefined ? previous[current] : null;
  }
  
  if (current === start) {
    path.unshift(start);
    return path;
  }
  
  return []; // No path found
} 