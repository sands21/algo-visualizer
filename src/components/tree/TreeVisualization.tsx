import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTree, TreeNode, TreeOperationType } from '../../context/TreeContext';

// Define static details for algorithms
interface AlgorithmDetails {
  title: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string;
}

const bstAlgorithmDetails: Partial<Record<TreeOperationType, AlgorithmDetails>> = {
  insert: {
    title: 'BST Insert',
    description: 'Inserts a new node into a Binary Search Tree, maintaining the BST property where all left child values are less than the parent, and all right child values are greater.',
    timeComplexity: 'O(h) - where h is the height of the tree.\nBest case O(log n) for balanced trees,\nworst case O(n) for skewed trees.',
    spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
    pseudocode: `function insert(root, value):\n  if root is null:\n    return new Node(value)\n  if value < root.value:\n    root.left = insert(root.left, value)\n  else if value > root.value:\n    root.right = insert(root.right, value)\n  return root`,
  },
  delete: {
    title: 'BST Delete',
    description: 'Deletes a node from a Binary Search Tree. Handles cases for nodes with 0, 1, or 2 children, often by finding the in-order successor or predecessor.',
    timeComplexity: 'O(h) - where h is the height of the tree.',
    spaceComplexity: 'O(h) for the recursive call stack.',
    pseudocode: `function deleteNode(root, value):\n  if root is null: return root\n  if value < root.value:\n    root.left = deleteNode(root.left, value)\n  else if value > root.value:\n    root.right = deleteNode(root.right, value)\n  else:\n    // Node with only one child or no child\n    if root.left is null:\n      return root.right\n    else if root.right is null:\n      return root.left\n    // Node with two children: Get the inorder successor (smallest in the right subtree)\n    root.value = minValue(root.right)\n    // Delete the inorder successor\n    root.right = deleteNode(root.right, root.value)\n  return root\n\nfunction minValue(node):\n  current = node\n  while current.left is not null:\n    current = current.left\n  return current.value`,
  },
  search: {
    title: 'BST Search',
    description: 'Searches for a value in a Binary Search Tree by comparing the target value with the current node\'s value and deciding whether to go left or right.',
    timeComplexity: 'O(h) - where h is the height of the tree.\nBest case O(log n) for balanced trees,\nworst case O(n) for skewed trees.',
    spaceComplexity: 'O(h) for the recursive call stack, or O(1) for iterative version.',
    pseudocode: `function search(root, value):\n  if root is null or root.value == value:\n    return root\n  if value < root.value:\n    return search(root.left, value)\n  else:\n    return search(root.right, value)`,
  },
};

const avlAlgorithmDetails: Partial<Record<TreeOperationType, AlgorithmDetails>> = {
  insert: {
    title: 'AVL Insert',
    description: 'Inserts a node into an AVL tree and performs rotations if necessary to maintain balance.',
    timeComplexity: 'O(log n) - where n is the number of nodes in the tree.',
    spaceComplexity: 'O(log n) for the recursive call stack.',
    pseudocode: `function insert(root, value):\n  // Standard BST insert\n  if root is null:\n    return new Node(value)\n  if value < root.value:\n    root.left = insert(root.left, value)\n  else if value > root.value:\n    root.right = insert(root.right, value)\n  else:\n    return root // Duplicate value\n\n  // Update height of current node\n  root.height = 1 + max(height(root.left), height(root.right))\n\n  // Get balance factor\n  balance = getBalance(root)\n\n  // If node becomes unbalanced, then there are 4 cases\n\n  // Left Left Case\n  if balance > 1 and value < root.left.value:\n    return rightRotate(root)\n\n  // Right Right Case\n  if balance < -1 and value > root.right.value:\n    return leftRotate(root)\n\n  // Left Right Case\n  if balance > 1 and value > root.left.value:\n    root.left = leftRotate(root.left)\n    return rightRotate(root)\n\n  // Right Left Case\n  if balance < -1 and value < root.right.value:\n    root.right = rightRotate(root.right)\n    return leftRotate(root)\n\n  return root`,
  },
  // Future: Add AVL Delete, AVL Search (if different from BST)
};

// Add RedBlack Tree details similarly if needed
// const redBlackAlgorithmDetails: Partial<Record<TreeOperationType, AlgorithmDetails>> = {};

const commonAlgorithmDetails: Partial<Record<TreeOperationType, AlgorithmDetails>> = {
  inorder: {
    title: 'In-Order Traversal',
    description: 'Recursively traverses the left subtree, then visits the root, and finally traverses the right subtree. For a BST, this yields nodes in sorted order.',
    timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
    spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
    pseudocode: `function inorderTraversal(root):\n  if root is null:\n    return\n  inorderTraversal(root.left)\n  visit(root)\n  inorderTraversal(root.right)`,
  },
  preorder: {
    title: 'Pre-Order Traversal',
    description: 'Visits the root first, then recursively traverses the left subtree, then the right subtree. Useful for creating a copy of the tree or prefix expression evaluation.',
    timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
    spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
    pseudocode: `function preorderTraversal(root):\n  if root is null:\n    return\n  visit(root)\n  preorderTraversal(root.left)\n  preorderTraversal(root.right)`,
  },
  postorder: {
    title: 'Post-Order Traversal',
    description: 'Recursively traverses the left subtree, then the right subtree, and finally visits the root. Useful for deleting a tree or evaluating postfix expressions.',
    timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
    spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
    pseudocode: `function postorderTraversal(root):\n  if root is null:\n    return\n  postorderTraversal(root.left)\n  postorderTraversal(root.right)\n  visit(root)`,
  },
  levelorder: {
    title: 'Level-Order Traversal',
    description: 'Visits nodes level by level from left to right. Uses a queue to keep track of nodes to visit.',
    timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
    spaceComplexity: 'O(n) in the worst case for a complete binary tree (for the queue).',
    pseudocode: `function levelorderTraversal(root):\n  if root is null:\n    return\n  queue q = new Queue()\n  q.enqueue(root)\n  while q is not empty:\n    node = q.dequeue()\n    visit(node)\n    if node.left is not null:\n      q.enqueue(node.left)\n    if node.right is not null:\n      q.enqueue(node.right)`,
  },
};

const deepCloneTree = (node: TreeNode | null): TreeNode | null => {
  if (!node) return null;
  return {
    ...node,
    left: deepCloneTree(node.left),
    right: deepCloneTree(node.right),
  };
};

const getTreeMinMaxX = (node: TreeNode | null): { minX: number, maxX: number } => {
  if (!node) return { minX: Infinity, maxX: -Infinity };
  
  let currentMinX = node.x !== undefined ? node.x : Infinity;
  let currentMaxX = node.x !== undefined ? node.x : -Infinity;

  const leftBounds = getTreeMinMaxX(node.left);
  currentMinX = Math.min(currentMinX, leftBounds.minX);
  currentMaxX = Math.max(currentMaxX, leftBounds.maxX);

  const rightBounds = getTreeMinMaxX(node.right);
  currentMinX = Math.min(currentMinX, rightBounds.minX);
  currentMaxX = Math.max(currentMaxX, rightBounds.maxX);
  
  return { minX: currentMinX, maxX: currentMaxX };
};

const shiftTreeXCoordinates = (node: TreeNode | null, shift: number): void => {
  if (!node) return;
  if (node.x !== undefined) {
      node.x += shift;
  }
  shiftTreeXCoordinates(node.left, shift);
  shiftTreeXCoordinates(node.right, shift);
};

export const TreeVisualization: React.FC = () => {
  const {
    root,
    currentNode,
    visitedNodes,
    path,
    isRunning,
    isPaused,
    selectedOperation,
    treeType,
    currentStep,
    totalSteps,
    currentOperation,
    steps,
    isStepMode,
    toggleStepMode,
    nextStep,
    pauseOperation,
    resetTree,
    replayOperation,
    speed,
    setSpeed,
  } = useTree();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const NODE_RADIUS = 25;
  const FONT_SIZE = 14;
  
  const COLORS = useMemo(() => ({
    node: '#64748b', // slate-500
    nodeStroke: '#475569', // slate-600
    edge: '#94a3b8', // slate-400
    visited: '#22c55e', // green-500
    current: '#eab308', // yellow-500
    highlighted: '#3b82f6', // blue-500
    text: '#f8fafc', // slate-50
    path: '#ef4444', // red-500
  }), []);

  const drawNodes = useCallback((ctx: CanvasRenderingContext2D, node: TreeNode | null) => {
    if (!node) return;
    
    let fillColor: string | CanvasGradient = COLORS.node;
    let strokeColor = COLORS.nodeStroke;
    
    const step = steps[currentStep];
    const highlightedNodes = step?.highlightedNodes || [];
    
    if (node.value === currentNode) {
      fillColor = COLORS.current;
      strokeColor = '#a16207'; // yellow-700
    } else if (visitedNodes.includes(node.value)) {
      fillColor = COLORS.visited;
      strokeColor = '#166534'; // green-700
    } else if (highlightedNodes.includes(node.value)) {
      fillColor = COLORS.highlighted;
      strokeColor = '#1d4ed8'; // blue-700
    } else if (path.includes(node.value)) {
      const pathGradient = ctx.createLinearGradient(0, 0, canvasRef.current?.width || 800, 0);
      pathGradient.addColorStop(0, '#9333ea'); // purple-600
      pathGradient.addColorStop(1, '#a855f7'); // purple-500
      fillColor = pathGradient;
      strokeColor = '#7e22ce'; // purple-700
    }
    
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, NODE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = COLORS.text;
    ctx.font = `${FONT_SIZE}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value.toString(), node.x!, node.y!);
    
    if (node.left) drawNodes(ctx, node.left); 
    if (node.right) drawNodes(ctx, node.right);
  }, [currentNode, visitedNodes, path, steps, currentStep, COLORS, NODE_RADIUS, FONT_SIZE, canvasRef]);

  const drawEdges = useCallback((ctx: CanvasRenderingContext2D, node: TreeNode | null) => {
    if (!node) return;
    
    if (node.left) {
      ctx.beginPath();
      ctx.moveTo(node.x!, node.y!);
      ctx.lineTo(node.left.x!, node.left.y!);
      
      if (
        path.includes(node.value) && 
        path.includes(node.left.value) &&
        Math.abs(path.indexOf(node.value) - path.indexOf(node.left.value)) === 1
      ) {
        ctx.strokeStyle = COLORS.path;
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = COLORS.edge;
        ctx.lineWidth = 2;
      }
      ctx.stroke();
      if (node.left) drawEdges(ctx, node.left);
    }
    
    if (node.right) {
      ctx.beginPath();
      ctx.moveTo(node.x!, node.y!);
      ctx.lineTo(node.right.x!, node.right.y!);
      if (
        path.includes(node.value) && 
        path.includes(node.right.value) &&
        Math.abs(path.indexOf(node.value) - path.indexOf(node.right.value)) === 1
      ) {
        ctx.strokeStyle = COLORS.path;
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = COLORS.edge;
        ctx.lineWidth = 2;
      }
      ctx.stroke();
      if (node.right) drawEdges(ctx, node.right);
    }
  }, [path, COLORS]);

  const drawTree = useCallback((ctx: CanvasRenderingContext2D, rootNode: TreeNode) => {
    drawEdges(ctx, rootNode);
    drawNodes(ctx, rootNode);
  }, [drawEdges, drawNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const { width: canvasActualWidth, height: canvasActualHeight } = container.getBoundingClientRect();
    canvas.width = canvasActualWidth;
    canvas.height = canvasActualHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!root) {
      return;
    }
    
    const treeToDraw = deepCloneTree(root);
    if (!treeToDraw) return; 

    const { minX, maxX } = getTreeMinMaxX(treeToDraw);

    if (minX !== Infinity && maxX !== -Infinity) {
      const shift = (canvasActualWidth / 2) - ((minX + maxX) / 2);
      shiftTreeXCoordinates(treeToDraw, shift);
    } else if (treeToDraw.x !== undefined) {
        const shift = (canvasActualWidth / 2) - treeToDraw.x;
        shiftTreeXCoordinates(treeToDraw, shift); 
    }
    
    drawTree(ctx, treeToDraw); 
    
  }, [root, currentNode, visitedNodes, path, isRunning, currentStep, drawTree]);

  // Operation names for display
  const operationDisplayNames = {
    insert: 'Insert Node',
    delete: 'Delete Node',
    search: 'Search Node',
    inorder: 'In-Order Traversal',
    preorder: 'Pre-Order Traversal',
    postorder: 'Post-Order Traversal',
    levelorder: 'Level-Order Traversal',
  };

  let currentStaticDetails: AlgorithmDetails | undefined;
  switch (treeType) {
    case 'bst':
      currentStaticDetails = bstAlgorithmDetails[selectedOperation];
      break;
    case 'avl':
      currentStaticDetails = avlAlgorithmDetails[selectedOperation];
      if (!currentStaticDetails && (selectedOperation === 'search' || selectedOperation === 'delete')) {
        currentStaticDetails = bstAlgorithmDetails[selectedOperation];
      }
      break;
    // case 'redblack': // Add Red-Black logic when details are available
    //   currentStaticDetails = redBlackAlgorithmDetails[selectedOperation];
    //   break;
    default:
      currentStaticDetails = bstAlgorithmDetails[selectedOperation]; // Default to BST for unknown types
  }
  // Always allow common traversal details if no specific one is found
  if (!currentStaticDetails && commonAlgorithmDetails[selectedOperation]) {
    currentStaticDetails = commonAlgorithmDetails[selectedOperation];
  }


  return (
    <div className="flex flex-col space-y-4">
      {/* Main Visualization Section */}
      <div className="bg-card dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
        {/* Tree Canvas Container */}
        <div className="relative w-full h-[500px] bg-canvas dark:bg-canvas-dark">
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: '100%', height: '100%' }}
          />
          
          {!root && (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted dark:text-text-muted-dark">
              No tree to visualize. Create a tree first.
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="p-4 border-t border-border dark:border-border-dark">
          <div className="flex flex-wrap items-center gap-3">
            {/* Step Mode Toggle */}
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isStepMode 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={toggleStepMode}
              disabled={isRunning && !isPaused}
            >
              Step Mode {isStepMode ? 'On' : 'Off'}
            </button>
            
            {/* Next Step Button */}
            {isStepMode && (
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isRunning && isPaused
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={nextStep}
                disabled={!isRunning || !isPaused}
              >
                Next Step
              </button>
            )}

            {/* Pause/Resume Button */}
            {isRunning && (
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={pauseOperation}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            
            {/* Reset Button */}
            {isRunning && (
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 hover:bg-rose-200 dark:hover:bg-rose-800"
                onClick={resetTree}
              >
                Reset
              </button>
            )}
            
            {/* Replay Button */}
            {!isRunning && steps.length > 0 && (
              <button
                className="px-4 py-2 rounded-md text-sm font-medium bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200 hover:bg-violet-200 dark:hover:bg-violet-800"
                onClick={replayOperation}
              >
                Replay
              </button>
            )}

            {/* Speed Control */}
            <div className="flex items-center gap-3 ml-auto">
              <label htmlFor="speedControl" className="text-sm font-medium">
                Speed: {speed}x
              </label>
              <input
                id="speedControl"
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-dark"
              />
            </div>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span className="text-primary dark:text-primary-dark">
                  {currentStaticDetails?.title || operationDisplayNames[selectedOperation]}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-primary dark:bg-primary-dark h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Algorithm Details Panel (Runtime Info) */}
      <div className="bg-card dark:bg-card-dark rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{currentStaticDetails?.title || operationDisplayNames[selectedOperation]} Details</h2>
          {isRunning && (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-sm">{isPaused ? 'Paused' : 'Running'}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Current Operation Description */}
          <div>
            <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-2">
              Current Operation
            </h3>
            <p className="text-sm bg-canvas dark:bg-canvas-dark p-3 rounded">
              {currentOperation}
            </p>
          </div>

          {/* Current Step Details */}
          {isRunning && steps[currentStep]?.description && (
            <div>
              <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-2">
                Step Details
              </h3>
              <div className="bg-canvas dark:bg-canvas-dark p-3 rounded">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {steps[currentStep].description}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Static Algorithm Information Panel */}
      {currentStaticDetails && (
        <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-6 rounded-lg shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currentStaticDetails.title}</h2>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">Description</h3>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{currentStaticDetails.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">Time Complexity</h3>
              <div className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-3 rounded whitespace-pre-line">
                {currentStaticDetails.timeComplexity}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">Space Complexity</h3>
              <div className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-3 rounded whitespace-pre-line">
                {currentStaticDetails.spaceComplexity}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-2">Pseudocode</h3>
            <pre className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 p-4 rounded-md text-sm whitespace-pre-wrap">
              <code>{currentStaticDetails.pseudocode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}; 