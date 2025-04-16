import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { useAppContext } from '../context/AppContext';
import styles from './VisualizationArea.module.css';

// --- Array Visualization with Animation ---
const renderArray = (array: number[], highlights: any) => {
  const getBarColor = (isComparing?: boolean, isSwapping?: boolean, isSorted?: boolean) => {
    if (isSorted) return '#22c55e'; // green-500
    if (isSwapping) return '#ef4444'; // red-500
    if (isComparing) return '#f59e0b'; // yellow-500
    return '#4f46e5'; // indigo-500 (default)
  };

  return (
    <motion.div layout className={styles.arrayContainer}> {/* Added layout to container */}
      <AnimatePresence> {/* To handle elements potentially being added/removed if needed */}
        {array.map((value, index) => {
          const isComparing = highlights?.compare?.includes(index);
          const isSwapping = highlights?.swap?.includes(index);
          const isSorted = highlights?.sorted?.includes(index);
          // Note: barClasses are less critical now as color is handled by animate
          const barClasses = styles.arrayBar; // Base class only

          return (
            // Wrap bar in motion.div for layout animation
            <motion.div
              key={value} // Use value as key for better animation tracking if values are unique
              layout // Enable automatic position animation
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                backgroundColor: getBarColor(isComparing, isSwapping, isSorted),
                transition: { duration: 0.3 }
              }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Spring animation for layout
              className={barClasses}
              style={{ height: `${Math.max(10, value * 2)}px`, width: '20px' }}
            >
              {value}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Graph Visualization Logic with Animation ---
const SVG_WIDTH = 500;
const SVG_HEIGHT = 300;
const NODE_RADIUS = 18;

const calculateNodePositions = (nodeIds: number[]) => {
  // ... (calculateNodePositions remains the same)
  const positions: { [key: number]: { x: number; y: number } } = {};
  const numNodes = nodeIds.length;
  if (numNodes === 0) return positions;
  const center = { x: SVG_WIDTH / 2, y: SVG_HEIGHT / 2 };
  const radius = Math.min(SVG_WIDTH, SVG_HEIGHT) / 2 - NODE_RADIUS * 2;
  nodeIds.forEach((id, index) => {
    const angle = (index / numNodes) * 2 * Math.PI - Math.PI / 2;
    positions[id] = {
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };
  });
  return positions;
};

const GraphVisualization: React.FC<{
  graph: Record<number, number[]>;
  visited: number[];
  current?: number;
}> = ({ graph, visited, current }) => {
  const nodeIds = useMemo(() => Object.keys(graph).map(Number).sort((a, b) => a - b), [graph]);
  const nodePositions = useMemo(() => calculateNodePositions(nodeIds), [nodeIds]);

  // Determine node styles based on state
  const getNodeStyle = (nodeId: number) => {
    const isVisited = visited.includes(nodeId);
    const isCurrent = nodeId === current;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isCurrent) {
      return {
        stroke: isDark ? '#fcd34d' : '#f59e0b', // yellow-300 / yellow-500
        fill: isDark ? '#422006' : '#fef3c7', // amber-900 / yellow-100
        strokeWidth: 3,
      };
    }
    if (isVisited) {
      return {
        stroke: isDark ? '#475569' : '#64748b', // slate-600 / slate-500
        fill: isDark ? '#334155' : '#f1f5f9', // slate-700 / slate-100
        strokeWidth: 2,
      };
    }
    // Default
    return {
      stroke: isDark ? '#818cf8' : '#4f46e5', // indigo-400 / indigo-500
      fill: isDark ? '#1e293b' : '#ffffff', // slate-800 / white
      strokeWidth: 2,
    };
  };

  // Determine text fill based on state
   const getTextFill = (nodeId: number) => {
    const isVisited = visited.includes(nodeId);
    const isCurrent = nodeId === current;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isCurrent) return isDark ? '#fcd34d' : '#f59e0b'; // Match current node stroke
    if (isVisited) return isDark ? '#64748b' : '#475569'; // Match visited node stroke/fill
    return isDark ? '#c7d2fe' : '#4f46e5'; // Default text color
  };


  return (
    <div className={styles.graphSvgContainer}>
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
        {/* Render Edges */}
        {nodeIds.map(nodeId => {
          // ... (Edge rendering remains the same)
          const startPos = nodePositions[nodeId];
          return graph[nodeId]?.map(neighborId => {
            if (nodePositions[neighborId] && nodeId < neighborId) {
              const endPos = nodePositions[neighborId];
              return (
                <line
                  key={`${nodeId}-${neighborId}`}
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  className={styles.graphEdge}
                />
              );
            }
            return null;
          });
        })}

        {/* Render Nodes with Animation */}
        {nodeIds.map(nodeId => {
          const pos = nodePositions[nodeId];
          const styleProps = getNodeStyle(nodeId);
          const textFill = getTextFill(nodeId);

          return (
            // Wrap node group in motion.g
            <motion.g
              key={nodeId}
              initial={false} // Don't animate on initial render unless needed
              animate={styleProps} // Animate stroke, fill, strokeWidth
              transition={{ duration: 0.3 }} // Smooth transition
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                // Styles are now controlled by motion.g's animate prop
              />
              <motion.text
                x={pos.x}
                y={pos.y}
                className={styles.graphNodeText}
                initial={false}
                animate={{ fill: textFill }} // Animate text fill color
                transition={{ duration: 0.3 }}
              >
                {nodeId}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};
// --- End Graph Visualization Logic ---


const ALGO_LABELS: Record<string, string> = {
  // ... (ALGO_LABELS remain the same)
  bubbleSort: 'Bubble Sort',
  selectionSort: 'Selection Sort',
  insertionSort: 'Insertion Sort',
  mergeSort: 'Merge Sort',
  quickSort: 'Quick Sort',
  heapSort: 'Heap Sort',
  binarySearch: 'Binary Search',
  linearSearch: 'Linear Search',
  graphTraversal: 'Graph Traversal',
  shortestPath: 'Shortest Path',
  dijkstraAlgorithm: 'Dijkstra\'s Algorithm',
  aStarAlgorithm: 'A* Algorithm',
  kruskalAlgorithm: 'Kruskal\'s Algorithm',
  primAlgorithm: 'Prim\'s Algorithm'
};

const VisualizationArea: React.FC = () => {
  const { state, setCurrentStep, pause } = useAppContext();
  const selected = state.selectedAlgorithm;
  const step = state.currentStep < state.steps.length ? state.steps[state.currentStep] : null;

  // Auto-play effect
  useEffect(() => {
    // ... (useEffect remains the same)
     if (!state.isPlaying) return;
    if (state.currentStep >= state.steps.length - 1) {
      pause();
      return;
    }
    const delay = 1100 - state.animationSpeed * 100;
    const timer = setTimeout(() => {
      setCurrentStep(state.currentStep + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [state.isPlaying, state.currentStep, state.steps.length, state.animationSpeed, setCurrentStep, pause]);

  return (
    <div className={styles.visualizationArea}>
      <div className={styles.container}>
        {!selected ? (
          // ... (Placeholder remains the same)
           <div className={styles.placeholderContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.placeholderIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className={styles.placeholderTextLarge}>
              Select an algorithm to visualize
            </p>
            <p className={styles.placeholderTextSmall}>
              You'll see the algorithm steps displayed here
            </p>
          </div>
        ) : (
          <div className={styles.contentContainer}>
            <div className={styles.header}>
              {/* ... (Header section remains the same) */}
               <h2 className={styles.title}>
                {ALGO_LABELS[selected] || selected}
              </h2>
              <div className={styles.progressContainer}>
                <span className={styles.progressText}>
                  Step {state.currentStep + 1} of {state.steps.length}
                </span>
                <div className={styles.progressBarBackground}>
                  <motion.div
                    className={styles.progressBarForeground}
                    initial={{ width: 0 }}
                    animate={{ width: `${((state.currentStep + 1) / Math.max(state.steps.length, 1)) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.visualizationContent}>
              {/* Visualization rendering */}
              {step ? (
                // Removed outer motion.div, animation handled internally now
                <>
                  {/* Sorting/Searching: Show array */}
                  {'array' in step && Array.isArray(step.array) && renderArray(
                    step.array,
                    {
                      compare: 'comparing' in step ? step.comparing : undefined,
                      swap: 'swapping' in step ? step.swapping : undefined,
                      sorted: 'sortedIndices' in step ? step.sortedIndices : undefined,
                    }
                  )}

                  {/* Graph: Show nodes using the new component */}
                  {'graph' in step && step.graph && (
                    <GraphVisualization
                      graph={step.graph}
                      visited={step.visited || []}
                      current={step.current}
                    />
                  )}

                  {/* Additional information display */}
                  {/* ... (Info grid remains the same) */}
                   <div className={styles.infoGrid}>
                    {'target' in step && typeof step.target === 'number' && (
                      <div className={`${styles.infoBox} ${styles.targetBox}`}>
                        <div className={`${styles.infoBoxLabel} ${styles.targetLabel}`}>Target</div>
                        <div className={`${styles.infoBoxValue} ${styles.targetValue}`}>{step.target}</div>
                      </div>
                    )}
                    {'queue' in step && step.queue && (
                      <div className={`${styles.infoBox} ${styles.queueBox}`}>
                        <div className={`${styles.infoBoxLabel} ${styles.queueLabel}`}>Queue</div>
                        <div className={`${styles.infoBoxValueSmall} ${styles.queueValue}`}>
                          [{step.queue.join(', ')}]
                        </div>
                      </div>
                    )}
                    {'stack' in step && step.stack && (
                      <div className={`${styles.infoBox} ${styles.stackBox}`}>
                        <div className={`${styles.infoBoxLabel} ${styles.stackLabel}`}>Stack</div>
                        <div className={`${styles.infoBoxValueSmall} ${styles.stackValue}`}>
                          [{step.stack.join(', ')}]
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {/* ... (Description box remains the same) */}
                   {step.description && (
                    <div className={styles.descriptionBox}>
                      <p className={styles.descriptionText}>{step.description}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className={styles.noStepsText}>No steps to display.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationArea;
