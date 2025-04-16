// Define the structure for each step in the visualization
export interface BFSGraphStep {
  graph: Record<number, number[]>; // adjacency list
  visited: number[];
  queue: number[];
  current?: number;
  description: string;
  codeLine?: number; // Add codeLine property
}

// BFS algorithm implementation that generates visualization steps
export function getBFSSteps(
  graph: Record<number, number[]>,
  start: number
): BFSGraphStep[] {
  const steps: BFSGraphStep[] = [];
  const visited: number[] = [];
  const queue: number[] = [];

  // Initial state
  steps.push({
    graph: { ...graph },
    visited: [],
    queue: [start],
    current: start,
    description: `Start BFS from node ${start}.`,
    codeLine: 0, // Corresponds to 'queue = [start]'
  });

  queue.push(start);
  visited.push(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    steps.push({
      graph: { ...graph },
      visited: [...visited],
      queue: [...queue],
      current: node,
      description: `Visiting node ${node}.`,
      codeLine: 3, // Corresponds to 'node = queue.pop()'
    });

    for (const neighbor of graph[node] || []) {
      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        queue.push(neighbor);
        steps.push({
          graph: { ...graph },
          visited: [...visited],
          queue: [...queue],
          current: neighbor,
          description: `Discovered node ${neighbor} from node ${node}, adding to queue.`,
          codeLine: 7, // Corresponds to 'queue.push(neighbor)'
        });
      }
    }
  }

  steps.push({
    graph: { ...graph },
    visited: [...visited],
    queue: [],
    description: `BFS complete. All reachable nodes from ${start} have been visited.`,
    codeLine: 2, // Corresponds to 'while queue not empty' (end condition)
  });

  return steps;
}
