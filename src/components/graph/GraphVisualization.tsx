import React, { useRef, useEffect } from 'react';
import { useGraph, GraphNode, GraphEdge } from '../../context/GraphContext';

export const GraphVisualization: React.FC = () => {
  const {
    nodes,
    edges,
    startNode,
    endNode,
    visitedNodes,
    currentNode,
    isRunning,
    isPaused,
    selectedAlgorithm,
    currentStep,
    totalSteps,
    currentOperation,
    queue,
    stack,
    path,
  } = useGraph();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Constants for node appearance
  const NODE_RADIUS = 20;
  const FONT_SIZE = 14;
  const COLORS = {
    node: '#64748b', // slate-500
    nodeStroke: '#475569', // slate-600
    edge: '#94a3b8', // slate-400
    visited: '#22c55e', // green-500
    current: '#eab308', // yellow-500
    start: '#3b82f6', // blue-500
    end: '#ef4444', // red-500
    text: '#f8fafc', // slate-50
  };

  // Draw the graph whenever the state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    drawEdges(ctx, edges, nodes);
    
    // Draw nodes
    drawNodes(ctx, nodes, visitedNodes, currentNode, startNode, endNode);
    
  }, [nodes, edges, visitedNodes, currentNode, startNode, endNode, isRunning]);

  // Function to draw all edges
  const drawEdges = (
    ctx: CanvasRenderingContext2D, 
    edges: GraphEdge[], 
    nodes: GraphNode[]
  ) => {
    edges.forEach(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      
      if (sourceNode && targetNode) {
        // Draw edge
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = COLORS.edge;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw weight if needed
        if (edge.weight !== 1) {
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          
          ctx.fillStyle = COLORS.edge;
          ctx.font = `${FONT_SIZE}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Background for weight text
          const textWidth = ctx.measureText(edge.weight.toString()).width;
          ctx.fillStyle = '#1e293b'; // slate-800
          ctx.beginPath();
          ctx.arc(midX, midY, textWidth / 1.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Weight text
          ctx.fillStyle = COLORS.text;
          ctx.fillText(edge.weight.toString(), midX, midY);
        }
      }
    });
  };

  // Function to draw all nodes
  const drawNodes = (
    ctx: CanvasRenderingContext2D, 
    nodes: GraphNode[], 
    visitedNodes: number[],
    currentNode: number | null,
    startNode: number,
    endNode: number | null
  ) => {
    nodes.forEach(node => {
      // Determine node color based on state
      let fillColor = COLORS.node;
      let strokeColor = COLORS.nodeStroke;
      
      if (node.id === startNode) {
        fillColor = COLORS.start;
        strokeColor = '#1d4ed8'; // blue-700
      } else if (node.id === endNode) {
        fillColor = COLORS.end;
        strokeColor = '#b91c1c'; // red-700
      } else if (node.id === currentNode) {
        fillColor = COLORS.current;
        strokeColor = '#a16207'; // yellow-700
      } else if (visitedNodes.includes(node.id)) {
        fillColor = COLORS.visited;
        strokeColor = '#166534'; // green-700
      }
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = COLORS.text;
      ctx.font = `${FONT_SIZE}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  };

  // Helper to get the formatted data structure information
  const getDataStructureInfo = () => {
    switch (selectedAlgorithm) {
      case 'bfs':
        return `Queue: [${(queue as number[]).join(', ')}]`;
      case 'dfs':
        return `Stack: [${stack.join(', ')}]`;
      case 'dijkstra':
        return `Priority Queue: [${(queue as [number, number][])
          .map(([node, dist]) => `(${node}, dist:${dist})`)
          .join(', ')}]`;
      default:
        return '';
    }
  };

  // Get the path information if available
  const getPathInfo = () => {
    if (path && path.length > 0) {
      return `Path: [${path.join(' → ')}]`;
    }
    return '';
  };

  // Algorithm names for display
  const algorithmNames = {
    bfs: 'Breadth-First Search',
    dfs: 'Depth-First Search',
    dijkstra: 'Dijkstra\'s Algorithm',
  };

  return (
    <div className="space-y-4">
      {/* Explanation Panel */}
      <div className="bg-card-alt dark:bg-card-alt-dark p-4 rounded-md shadow-sm text-text dark:text-text-dark">
        <div className="mb-2 flex justify-between items-center">
          <h3 className="text-md font-semibold">
            {algorithmNames[selectedAlgorithm]} Execution
          </h3>
          {isRunning && (
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span>
              <span className="text-sm">{isPaused ? 'Paused' : 'Running'}</span>
            </div>
          )}
        </div>

        {isRunning && (
          <>
            <div className="mb-2">
              <div className="text-sm mb-1">
                <span className="font-medium">Step {currentStep + 1} of {totalSteps}</span>
                <span className="mx-2">•</span>
                <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${Math.round(((currentStep + 1) / totalSteps) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p className="font-medium">Current Operation:</p>
              <p className="p-2 rounded bg-background dark:bg-background-dark">{currentOperation}</p>
              
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="font-medium">Current Node:</p>
                  <p className="p-2 rounded bg-background dark:bg-background-dark">
                    {currentNode !== null ? currentNode : 'None'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Visited Nodes:</p>
                  <p className="p-2 rounded bg-background dark:bg-background-dark truncate">
                    [{visitedNodes.join(', ')}]
                  </p>
                </div>
              </div>
              
              <div>
                <p className="font-medium">Data Structure:</p>
                <p className="p-2 rounded bg-background dark:bg-background-dark overflow-x-auto">
                  {getDataStructureInfo()}
                </p>
              </div>
              
              {path && path.length > 0 && (
                <div>
                  <p className="font-medium">Current Path:</p>
                  <p className="p-2 rounded bg-background dark:bg-background-dark overflow-x-auto">
                    {getPathInfo()}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        
        {!isRunning && (
          <div className="text-sm text-muted-foreground dark:text-muted-foreground">
            <p>Select an algorithm and click Start to begin visualization.</p>
            <div className="mt-2">
              <p className="font-medium">Node Colors:</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <li className="flex items-center">
                  <span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-2"></span>
                  Start Node
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 inline-block rounded-full bg-red-500 mr-2"></span>
                  End Node
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 inline-block rounded-full bg-yellow-500 mr-2"></span>
                  Current Node
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 inline-block rounded-full bg-green-500 mr-2"></span>
                  Visited Node
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Graph Canvas */}
      <div className="relative w-full flex justify-center">
        <canvas 
          ref={canvasRef}
          width={500} 
          height={500}
          className="border border-border dark:border-border-dark rounded-md bg-background dark:bg-background-dark"
        />
      </div>
    </div>
  );
}; 