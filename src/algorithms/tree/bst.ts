import { TreeNode, TreeStep } from '../../context/TreeContext';

// Helper function to create a new tree node
export const createNode = (value: number): TreeNode => ({
  value,
  left: null,
  right: null
});

// Helper to calculate tree layout coordinates
export const calculateTreeLayout = (root: TreeNode | null): TreeNode | null => {
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
  
  // Calculate the positions
  const setCoordinates = (
    node: TreeNode | null,
    depth: number = 0,
    leftBound: number = 0,
    rightBound: number = 800
  ): number => {
    if (!node) return 0;
    
    const y = 80 + depth * 100; // Vertical spacing
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

// BST Insert Operation
export const getBSTInsertSteps = (root: TreeNode | null, value: number): [TreeNode, TreeStep[]] => {
  const steps: TreeStep[] = [];
  
  const insert = (node: TreeNode | null, val: number): TreeNode => {
    if (!node) {
      const newNode = createNode(val);
      steps.push({
        tree: calculateTreeLayout(newNode),
        currentNode: val,
        visitedNodes: [val],
        path: [val],
        operation: 'insert',
        description: `Created new node with value ${val}`,
        codeLine: 1
      });
      return newNode;
    }
    
    steps.push({
      tree: calculateTreeLayout(node),
      currentNode: node.value,
      visitedNodes: [],
      path: [node.value],
      operation: 'insert',
      description: `Comparing ${val} with ${node.value}`,
      comparison: [val, node.value],
      codeLine: 3
    });
    
    if (val < node.value) {
      const newPath = [...steps[steps.length - 1].path, val];
      steps.push({
        tree: calculateTreeLayout(node),
        currentNode: node.value,
        visitedNodes: [],
        path: newPath,
        operation: 'insert',
        description: `${val} < ${node.value}, going to left subtree`,
        codeLine: 4
      });
      node.left = insert(node.left, val);
    } else if (val > node.value) {
      const newPath = [...steps[steps.length - 1].path, val];
      steps.push({
        tree: calculateTreeLayout(node),
        currentNode: node.value,
        visitedNodes: [],
        path: newPath,
        operation: 'insert',
        description: `${val} > ${node.value}, going to right subtree`,
        codeLine: 6
      });
      node.right = insert(node.right, val);
    } else {
      steps.push({
        tree: calculateTreeLayout(node),
        currentNode: node.value,
        visitedNodes: [node.value],
        path: steps[steps.length - 1].path,
        operation: 'insert',
        description: `Node with value ${val} already exists`,
        codeLine: 3
      });
    }
    
    return node;
  };
  
  const newRoot = insert(root, value);
  
  // Final state after insertion
  steps.push({
    tree: calculateTreeLayout(newRoot),
    currentNode: null,
    visitedNodes: [value],
    path: [],
    operation: 'insert',
    description: `Node with value ${value} inserted successfully`,
    highlightedNodes: [value],
    codeLine: 8
  });
  
  return [newRoot, steps];
};

// BST Search Operation
export const getBSTSearchSteps = (root: TreeNode | null, value: number): TreeStep[] => {
  const steps: TreeStep[] = [];
  
  const search = (node: TreeNode | null, val: number): boolean => {
    if (!node) {
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: null,
        visitedNodes: [],
        path: [],
        operation: 'search',
        description: `Node with value ${val} not found`,
        codeLine: 1
      });
      return false;
    }
    
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [],
      path: [node.value],
      operation: 'search',
      description: `Comparing ${val} with ${node.value}`,
      comparison: [val, node.value],
      codeLine: 2
    });
    
    if (val === node.value) {
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [node.value],
        path: steps[steps.length - 1].path,
        operation: 'search',
        description: `Found node with value ${val}`,
        highlightedNodes: [val],
        codeLine: 2
      });
      return true;
    }
    
    if (val < node.value) {
      const newPath = [...steps[steps.length - 1].path];
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [],
        path: newPath,
        operation: 'search',
        description: `${val} < ${node.value}, searching left subtree`,
        codeLine: 4
      });
      return search(node.left, val);
    } else {
      const newPath = [...steps[steps.length - 1].path];
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [],
        path: newPath,
        operation: 'search',
        description: `${val} > ${node.value}, searching right subtree`,
        codeLine: 6
      });
      return search(node.right, val);
    }
  };
  
  search(root, value);
  
  // Final state
  steps.push({
    tree: calculateTreeLayout(root),
    currentNode: null,
    visitedNodes: steps.some(step => step.description.includes('Found')) ? [value] : [],
    path: [],
    operation: 'search',
    description: steps.some(step => step.description.includes('Found')) 
      ? `Search for ${value} completed - node found` 
      : `Search for ${value} completed - node not found`,
    codeLine: 7
  });
  
  return steps;
};

// Find minimum value node (used in delete operation)
const findMinNode = (node: TreeNode): TreeNode => {
  let current = node;
  while (current.left !== null) {
    current = current.left;
  }
  return current;
};

// BST Delete Operation
export const getBSTDeleteSteps = (root: TreeNode | null, value: number): [TreeNode | null, TreeStep[]] => {
  const steps: TreeStep[] = [];
  
  const deleteNode = (node: TreeNode | null, val: number): TreeNode | null => {
    if (!node) {
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: null,
        visitedNodes: [],
        path: [],
        operation: 'delete',
        description: `Node with value ${val} not found for deletion`,
        codeLine: 1
      });
      return null;
    }
    
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [],
      path: [node.value],
      operation: 'delete',
      description: `Comparing ${val} with ${node.value}`,
      comparison: [val, node.value],
      codeLine: 3
    });
    
    // Search for the node to delete
    if (val < node.value) {
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [],
        path: [...steps[steps.length - 1].path],
        operation: 'delete',
        description: `${val} < ${node.value}, going to left subtree`,
        codeLine: 4
      });
      node.left = deleteNode(node.left, val);
    } else if (val > node.value) {
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [],
        path: [...steps[steps.length - 1].path],
        operation: 'delete',
        description: `${val} > ${node.value}, going to right subtree`,
        codeLine: 6
      });
      node.right = deleteNode(node.right, val);
    } else {
      // Node found - handle deletion based on number of children
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [node.value],
        path: steps[steps.length - 1].path,
        operation: 'delete',
        description: `Found node with value ${val} to delete`,
        highlightedNodes: [val],
        codeLine: 8
      });
      
      // Case 1: No children (leaf node)
      if (!node.left && !node.right) {
        steps.push({
          tree: calculateTreeLayout(root),
          currentNode: node.value,
          visitedNodes: [node.value],
          path: steps[steps.length - 1].path,
          operation: 'delete',
          description: `Node with value ${val} is a leaf node - deleting it`,
          codeLine: 9
        });
        return null;
      }
      
      // Case 2: Only right child
      if (!node.left) {
        steps.push({
          tree: calculateTreeLayout(root),
          currentNode: node.value,
          visitedNodes: [node.value],
          path: steps[steps.length - 1].path,
          operation: 'delete',
          description: `Node with value ${val} has only a right child - replacing with right child`,
          codeLine: 12
        });
        return node.right;
      }
      
      // Case 3: Only left child
      if (!node.right) {
        steps.push({
          tree: calculateTreeLayout(root),
          currentNode: node.value,
          visitedNodes: [node.value],
          path: steps[steps.length - 1].path,
          operation: 'delete',
          description: `Node with value ${val} has only a left child - replacing with left child`,
          codeLine: 10
        });
        return node.left;
      }
      
      // Case 4: Two children - find inorder successor (smallest in right subtree)
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [node.value],
        path: steps[steps.length - 1].path,
        operation: 'delete',
        description: `Node with value ${val} has two children - finding inorder successor`,
        codeLine: 16
      });
      
      const successor = findMinNode(node.right);
      
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: successor.value,
        visitedNodes: [node.value, successor.value],
        path: [...steps[steps.length - 1].path, successor.value],
        operation: 'delete',
        description: `Found inorder successor with value ${successor.value}`,
        highlightedNodes: [successor.value],
        codeLine: 16
      });
      
      // Replace node's value with successor's value
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [node.value, successor.value],
        path: steps[steps.length - 1].path,
        operation: 'delete',
        description: `Replacing value ${node.value} with successor value ${successor.value}`,
        codeLine: 17
      });
      
      node.value = successor.value;
      
      // Delete the successor
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: successor.value,
        visitedNodes: [successor.value],
        path: [...steps[steps.length - 1].path],
        operation: 'delete',
        description: `Deleting the successor node with value ${successor.value} from right subtree`,
        codeLine: 18
      });
      
      node.right = deleteNode(node.right, successor.value);
    }
    
    return node;
  };
  
  const newRoot = deleteNode(root, value);
  
  // Final state after deletion
  steps.push({
    tree: calculateTreeLayout(newRoot),
    currentNode: null,
    visitedNodes: [],
    path: [],
    operation: 'delete',
    description: `Delete operation completed for value ${value}`,
    codeLine: 19
  });
  
  return [newRoot, steps];
};

// In-Order Traversal
export const getInOrderTraversalSteps = (root: TreeNode | null): TreeStep[] => {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  
  const traverse = (node: TreeNode | null, path: number[] = []): void => {
    if (!node) return;
    
    const currentPath = [...path, node.value];
    
    // Visit left subtree
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'inorder',
      description: `Going to left subtree of ${node.value}`,
      codeLine: 3
    });
    
    traverse(node.left, currentPath);
    
    // Visit current node
    visited.push(node.value);
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'inorder',
      description: `Visiting node ${node.value}`,
      highlightedNodes: [node.value],
      codeLine: 4
    });
    
    // Visit right subtree
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'inorder',
      description: `Going to right subtree of ${node.value}`,
      codeLine: 5
    });
    
    traverse(node.right, currentPath);
  };
  
  traverse(root);
  
  // Final state
  steps.push({
    tree: calculateTreeLayout(root),
    currentNode: null,
    visitedNodes: [...visited],
    path: [],
    operation: 'inorder',
    description: `In-order traversal completed: [${visited.join(', ')}]`,
    codeLine: 6
  });
  
  return steps;
};

// Pre-Order Traversal
export const getPreOrderTraversalSteps = (root: TreeNode | null): TreeStep[] => {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  
  const traverse = (node: TreeNode | null, path: number[] = []): void => {
    if (!node) return;
    
    const currentPath = [...path, node.value];
    
    // Visit current node first
    visited.push(node.value);
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'preorder',
      description: `Visiting node ${node.value}`,
      highlightedNodes: [node.value],
      codeLine: 3
    });
    
    // Visit left subtree
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'preorder',
      description: `Going to left subtree of ${node.value}`,
      codeLine: 4
    });
    
    traverse(node.left, currentPath);
    
    // Visit right subtree
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'preorder',
      description: `Going to right subtree of ${node.value}`,
      codeLine: 5
    });
    
    traverse(node.right, currentPath);
  };
  
  traverse(root);
  
  // Final state
  steps.push({
    tree: calculateTreeLayout(root),
    currentNode: null,
    visitedNodes: [...visited],
    path: [],
    operation: 'preorder',
    description: `Pre-order traversal completed: [${visited.join(', ')}]`,
    codeLine: 6
  });
  
  return steps;
};

// Post-Order Traversal
export const getPostOrderTraversalSteps = (root: TreeNode | null): TreeStep[] => {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  
  const traverse = (node: TreeNode | null, path: number[] = []): void => {
    if (!node) return;
    
    const currentPath = [...path, node.value];
    
    // Visit left subtree first
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'postorder',
      description: `Going to left subtree of ${node.value}`,
      codeLine: 3
    });
    
    traverse(node.left, currentPath);
    
    // Visit right subtree
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'postorder',
      description: `Going to right subtree of ${node.value}`,
      codeLine: 4
    });
    
    traverse(node.right, currentPath);
    
    // Visit current node last
    visited.push(node.value);
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: node.value,
      visitedNodes: [...visited],
      path: currentPath,
      operation: 'postorder',
      description: `Visiting node ${node.value}`,
      highlightedNodes: [node.value],
      codeLine: 5
    });
  };
  
  traverse(root);
  
  // Final state
  steps.push({
    tree: calculateTreeLayout(root),
    currentNode: null,
    visitedNodes: [...visited],
    path: [],
    operation: 'postorder',
    description: `Post-order traversal completed: [${visited.join(', ')}]`,
    codeLine: 6
  });
  
  return steps;
};

// Level-Order Traversal
export const getLevelOrderTraversalSteps = (root: TreeNode | null): TreeStep[] => {
  const steps: TreeStep[] = [];
  const visited: number[] = [];
  
  if (!root) {
    steps.push({
      tree: null,
      currentNode: null,
      visitedNodes: [],
      path: [],
      operation: 'levelorder',
      description: 'Tree is empty, nothing to traverse',
      codeLine: 1
    });
    return steps;
  }
  
  // Initialize queue with root
  const queue: TreeNode[] = [root];
  let currentLevelNodes: number[] = [];
  let level = 1;
  
  steps.push({
    tree: calculateTreeLayout(root),
    currentNode: root.value,
    visitedNodes: [],
    path: [root.value],
    operation: 'levelorder',
    description: `Starting level-order traversal, adding root node ${root.value} to queue`,
    codeLine: 3
  });
  
  // Process all nodes in the queue
  while (queue.length > 0) {
    const levelSize = queue.length;
    currentLevelNodes = [];
    
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: null,
      visitedNodes: [...visited],
      path: queue.map(node => node.value),
      operation: 'levelorder',
      description: `Processing level ${level}, queue: [${queue.map(node => node.value).join(', ')}]`,
      codeLine: 5
    });
    
    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevelNodes.push(node.value);
      
      // Visit the node
      visited.push(node.value);
      steps.push({
        tree: calculateTreeLayout(root),
        currentNode: node.value,
        visitedNodes: [...visited],
        path: queue.map(n => n.value),
        operation: 'levelorder',
        description: `Visiting node ${node.value} at level ${level}`,
        highlightedNodes: [node.value],
        codeLine: 6
      });
      
      // Add children to queue
      if (node.left) {
        queue.push(node.left);
        steps.push({
          tree: calculateTreeLayout(root),
          currentNode: node.value,
          visitedNodes: [...visited],
          path: [node.value, node.left.value],
          operation: 'levelorder',
          description: `Adding left child ${node.left.value} of node ${node.value} to queue`,
          codeLine: 8
        });
      }
      
      if (node.right) {
        queue.push(node.right);
        steps.push({
          tree: calculateTreeLayout(root),
          currentNode: node.value,
          visitedNodes: [...visited],
          path: [node.value, node.right.value],
          operation: 'levelorder',
          description: `Adding right child ${node.right.value} of node ${node.value} to queue`,
          codeLine: 10
        });
      }
    }
    
    steps.push({
      tree: calculateTreeLayout(root),
      currentNode: null,
      visitedNodes: [...visited],
      path: queue.map(node => node.value),
      operation: 'levelorder',
      description: `Completed level ${level}, visited: [${currentLevelNodes.join(', ')}]`,
      codeLine: 6
    });
    
    level++;
  }
  
  // Final state
  steps.push({
    tree: calculateTreeLayout(root),
    currentNode: null,
    visitedNodes: [...visited],
    path: [],
    operation: 'levelorder',
    description: `Level-order traversal completed: [${visited.join(', ')}]`,
    codeLine: 11
  });
  
  return steps;
}; 