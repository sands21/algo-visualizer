import React from 'react';
import { useGraph } from '../../context/GraphContext';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';

export const GraphAlgorithmDetails: React.FC = () => {
  const { selectedAlgorithm, currentStep, isRunning, steps } = useGraph();
  const { theme } = useTheme();

  // Pseudo code and explanations for each algorithm
  const algorithmDetails: Record<
    string,
    {
      title: string;
      description: string;
      pseudoCode: string;
      timeComplexity: string;
      spaceComplexity: string;
      applications: string[];
      codeLine?: number;
    }
  > = {
    bfs: {
      title: 'Breadth-First Search (BFS)',
      description: 
        'BFS explores a graph layer by layer, visiting all neighbors of a node before moving to the next level. ' +
        'It uses a queue data structure to keep track of nodes to visit next. ' +
        'BFS is particularly useful for finding the shortest path in an unweighted graph.',
      pseudoCode: 
`function BFS(graph, start):
  queue = [start]
  visited = [start]
  
  while queue is not empty:
    node = queue.dequeue()
    
    for each neighbor of node:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)
  
  return visited`,
      timeComplexity: 'O(V + E) where V is the number of vertices and E is the number of edges.',
      spaceComplexity: 'O(V) for storing the queue and visited set.',
      applications: [
        'Shortest path in unweighted graphs',
        'Connected components',
        'Level-order traversal of trees',
        'Finding all nodes within one connected component',
        'Web crawlers',
      ],
      codeLine: steps[currentStep]?.codeLine,
    },
    dfs: {
      title: 'Depth-First Search (DFS)',
      description: 
        'DFS explores a graph by going as deep as possible along each branch before backtracking. ' +
        'It uses a stack (or recursion) to keep track of nodes to visit. ' +
        'DFS is useful for topological sorting, finding connected components, and maze generation.',
      pseudoCode: 
`function DFS(graph, start):
  stack = [start]
  visited = []
  
  while stack is not empty:
    node = stack.pop()
    
    if node not in visited:
      visited.add(node)
      
      for each neighbor of node:
        if neighbor not in visited:
          stack.push(neighbor)
  
  return visited`,
      timeComplexity: 'O(V + E) where V is the number of vertices and E is the number of edges.',
      spaceComplexity: 'O(V) for storing the stack and visited set.',
      applications: [
        'Topological sorting',
        'Cycle detection',
        'Path finding',
        'Maze generation',
        'Strongly connected components',
      ],
      codeLine: steps[currentStep]?.codeLine,
    },
    dijkstra: {
      title: 'Dijkstra\'s Algorithm',
      description: 
        'Dijkstra\'s algorithm finds the shortest path from a start node to all other nodes in a weighted graph. ' +
        'It uses a priority queue to greedily select the next node with the smallest tentative distance. ' +
        'The algorithm only works with non-negative edge weights.',
      pseudoCode: 
`function Dijkstra(graph, start):
  distances = {node: Infinity for all nodes}
  distances[start] = 0
  priority_queue = [(0, start)]
  visited = []
  
  while priority_queue is not empty:
    current_distance, current_node = priority_queue.pop_min()
    
    if current_node in visited:
      continue
      
    visited.add(current_node)
    
    for each neighbor, weight of current_node:
      distance = current_distance + weight
      
      if distance < distances[neighbor]:
        distances[neighbor] = distance
        priority_queue.push((distance, neighbor))
  
  return distances`,
      timeComplexity: 'O((V + E) log V) with a binary heap implementation of the priority queue.',
      spaceComplexity: 'O(V) for storing the distances, priority queue, and visited set.',
      applications: [
        'Finding shortest paths in maps',
        'Network routing protocols',
        'Flight scheduling',
        'Robotics path planning',
        'Transportation networks',
      ],
    },
  };

  const details = algorithmDetails[selectedAlgorithm];

  // Function to determine the line highlights for the current step
  const getLineHighlights = () => {
    if (!isRunning || !details.codeLine) return '';
    return String(details.codeLine);
  };

  // Customize the oneLight theme for light mode
  const lightTheme = {
    ...oneLight,
    'pre[class*="language-"]': {
      ...oneLight['pre[class*="language-"]'],
      background: '#f8fafc', // slate-50
      margin: 0,
    },
    'code[class*="language-"]': {
      ...oneLight['code[class*="language-"]'],
      color: '#1e293b', // slate-800
    },
  };

  // Custom dark theme to match searching section
  const customDarkTheme = {
    'pre[class*="language-"]': {
      background: '#0f172a', // slate-900, matching the searching section's dark blue
      margin: 0,
      padding: '1rem',
    },
    'code[class*="language-"]': {
      color: '#e2e8f0', // slate-200
    },
    'comment': {
      color: '#64748b', // slate-500
    },
    'function': {
      color: '#93c5fd', // blue-300
    },
    'keyword': {
      color: '#c4b5fd', // violet-300
    },
    'string': {
      color: '#86efac', // green-300
    },
    'number': {
      color: '#fdba74', // orange-300
    },
    'operator': {
      color: '#e2e8f0', // slate-200
    },
    'punctuation': {
      color: '#e2e8f0', // slate-200
    },
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Title */}
      <h3 className="text-xl font-bold text-text dark:text-text-dark">
        {details.title}
      </h3>

      {/* Algorithm Description */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
          Description
        </h4>
        <p className="text-muted-foreground dark:text-slate-300">
          {details.description}
        </p>
      </div>

      {/* Complexity Analysis */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-text dark:text-text-dark mb-4">
          Complexity Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-text dark:text-text-dark mb-2">
              Time Complexity
            </h5>
            <p className="text-muted-foreground dark:text-slate-300">
              {details.timeComplexity}
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-text dark:text-text-dark mb-2">
              Space Complexity
            </h5>
            <p className="text-muted-foreground dark:text-slate-300">
              {details.spaceComplexity}
            </p>
          </div>
        </div>
      </div>

      {/* Pseudo Code */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
          Pseudo Code
        </h4>
        <div className="rounded-md overflow-hidden">
          <SyntaxHighlighter
            language="python"
            style={theme === 'dark' ? customDarkTheme : lightTheme}
            showLineNumbers={true}
            wrapLines={true}
            lineProps={(lineNumber: number) => {
              const highlight = getLineHighlights()
                .split(',')
                .map((x) => parseInt(x))
                .includes(lineNumber);
              return {
                style: {
                  backgroundColor: highlight
                    ? theme === 'dark' 
                      ? 'rgba(59, 130, 246, 0.1)' // blue highlight for dark mode
                      : 'rgba(59, 130, 246, 0.1)' // same blue highlight for light mode
                    : undefined,
                  display: 'block',
                  width: '100%',
                },
              };
            }}
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
              fontSize: '0.9rem',
            }}
            codeTagProps={{
              style: {
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              },
            }}
          >
            {details.pseudoCode}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
          Applications
        </h4>
        <ul className="list-disc pl-5 text-muted-foreground dark:text-slate-300 space-y-1">
          {details.applications.map((application, index) => (
            <li key={index}>{application}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 