import React, { useState } from 'react';
import { useGraph } from '../../context/GraphContext';

export const GraphControls: React.FC = () => {
  const {
    selectedAlgorithm,
    selectAlgorithm,
    generateRandomGraph,
    createGridGraph,
    startAlgorithm,
    pauseAlgorithm,
    resetGraph,
    replayAlgorithm,
    isRunning,
    isPaused,
    speed,
    setSpeed,
    toggleStepMode,
    isStepMode,
    nextStep,
    currentOperation,
  } = useGraph();

  const [nodeCount, setNodeCount] = useState(8);
  const [edgeProbability, setEdgeProbability] = useState(0.3);
  const [gridSize, setGridSize] = useState(4);

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text dark:text-text-dark">
          Algorithm
        </label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => selectAlgorithm(e.target.value as 'bfs' | 'dfs' | 'dijkstra')}
          disabled={isRunning}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-input dark:border-input-dark rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          <option value="bfs" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">Breadth-First Search (BFS)</option>
          <option value="dfs" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">Depth-First Search (DFS)</option>
          <option value="dijkstra" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">Dijkstra's Algorithm</option>
        </select>
      </div>

      {/* Graph Generation */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-text dark:text-text-dark">
          Random Graph
        </label>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground dark:text-muted-foreground block mb-1">
              Nodes ({nodeCount})
            </label>
            <input
              type="range"
              min="4"
              max="15"
              value={nodeCount}
              onChange={(e) => setNodeCount(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground dark:text-muted-foreground block mb-1">
              Edge Density ({Math.round(edgeProbability * 100)}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={edgeProbability}
              onChange={(e) => setEdgeProbability(parseFloat(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
          </div>
        </div>
        <button
          onClick={() => generateRandomGraph(nodeCount, edgeProbability)}
          disabled={isRunning}
          className="w-full px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          Generate Random Graph
        </button>
      </div>

      {/* Grid Graph Generation */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text dark:text-text-dark">
          Grid Graph
        </label>
        <div>
          <label className="text-xs text-muted-foreground dark:text-muted-foreground block mb-1">
            Grid Size ({gridSize}x{gridSize})
          </label>
          <input
            type="range"
            min="2"
            max="8"
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full"
          />
        </div>
        <button
          onClick={() => createGridGraph(gridSize, gridSize)}
          disabled={isRunning}
          className="w-full px-4 py-2 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark disabled:opacity-50"
        >
          Create Grid Graph
        </button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text dark:text-text-dark">
          Animation Speed
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground dark:text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Operation Controls */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {!isRunning ? (
            <button
              onClick={startAlgorithm}
              className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseAlgorithm}
              className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button
            onClick={resetGraph}
            disabled={!isRunning && !isPaused}
            className="px-4 py-2 bg-secondary text-white font-medium rounded-md hover:bg-secondary-dark disabled:opacity-50"
          >
            Reset
          </button>
        </div>
        <button
          onClick={replayAlgorithm}
          disabled={isRunning && !isPaused}
          className="w-full px-4 py-2 bg-accent text-white font-medium rounded-md hover:bg-accent-dark disabled:opacity-50"
        >
          Replay
        </button>
      </div>

      {/* Step Mode Controls */}
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="stepMode"
            checked={isStepMode}
            onChange={toggleStepMode}
            disabled={isRunning && !isPaused}
            className="mr-2"
          />
          <label
            htmlFor="stepMode"
            className="text-sm font-medium text-text dark:text-text-dark cursor-pointer"
          >
            Step Mode
          </label>
        </div>
        <button
          onClick={nextStep}
          disabled={!isStepMode || !isRunning || isPaused}
          className="w-full px-4 py-2 bg-accent text-white font-medium rounded-md hover:bg-accent-dark disabled:opacity-50"
        >
          Next Step
        </button>
      </div>

      {/* Current Operation */}
      <div className="p-3 bg-card-alt dark:bg-card-alt-dark rounded-md">
        <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-1">
          Current Operation
        </h4>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
          {currentOperation || 'No operation in progress'}
        </p>
      </div>
    </div>
  );
}; 