// Define the structure for each step in the visualization
export interface DFSGraphStep {
  graph: Record<number, number[]>; // adjacency list
  visited: number[];
  stack: number[];
  current?: number;
  description: string;
  codeLine?: number; // Add codeLine property
}

// DFS algorithm implementation that generates visualization steps (iterative)
export function getDFSSteps(
  graph: Record<number, number[]>,
  start: number
): DFSGraphStep[] {
  const steps: DFSGraphStep[] = [];
  const visited: number[] = [];
  const stack: number[] = [];

  // Initial state
  steps.push({
    graph: { ...graph },
    visited: [],
    stack: [start],
    current: start,
    description: `Start DFS from node ${start}.`,
    codeLine: 0, // Corresponds to 'stack = [start]'
  });

  stack.push(start);

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (!visited.includes(node)) {
      visited.push(node);
      steps.push({
        graph: { ...graph },
        visited: [...visited],
        stack: [...stack],
        current: node,
        description: `Visiting node ${node}.`,
        codeLine: 5, // Corresponds to 'visited.add(node)'
      });

      // Add neighbors to stack (in reverse order for correct traversal)
      const neighbors = (graph[node] || []).slice().reverse();
      for (const neighbor of neighbors) {
        if (!visited.includes(neighbor)) {
          stack.push(neighbor);
          steps.push({
            graph: { ...graph },
            visited: [...visited],
            stack: [...stack],
            current: neighbor,
            description: `Discovered node ${neighbor} from node ${node}, adding to stack.`,
            codeLine: 7, // Corresponds to 'stack.push(neighbor)'
          });
        }
      }
    }
  }

  steps.push({
    graph: { ...graph },
    visited: [...visited],
    stack: [],
    description: `DFS complete. All reachable nodes from ${start} have been visited.`,
    codeLine: 2, // Corresponds to 'while stack not empty' (end condition)
  });

  return steps;
}
