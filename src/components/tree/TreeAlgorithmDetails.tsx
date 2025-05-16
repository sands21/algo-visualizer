import React from 'react';
import { useTree, TreeOperationType } from '../../context/TreeContext';

// Define the type for each algorithm info
interface AlgorithmDetail {
  title: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
}

// Define the type for the info object
const algorithmInfo: Record<'bst' | 'avl' | 'redblack', Partial<Record<TreeOperationType, AlgorithmDetail>>> = {
  bst: {
    insert: {
      title: 'BST Insert',
      description: 'Inserts a new node into a Binary Search Tree, maintaining the BST property where all left child values are less than the parent, and all right child values are greater.',
      timeComplexity: 'O(h) - where h is the height of the tree. Best case O(log n) for balanced trees, worst case O(n) for skewed trees.',
      spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
      pseudocode: [
        'function insert(root, value):',
        '  if root is null:',
        '    return new Node(value)',
        '  if value < root.value:',
        '    root.left = insert(root.left, value)',
        '  else if value > root.value:',
        '    root.right = insert(root.right, value)',
        '  return root'
      ]
    },
    delete: {
      title: 'BST Delete',
      description: 'Removes a node from a Binary Search Tree while maintaining the BST property. This involves finding the node and handling 3 cases: leaf node, node with one child, and node with two children.',
      timeComplexity: 'O(h) - where h is the height of the tree. Best case O(log n) for balanced trees, worst case O(n) for skewed trees.',
      spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
      pseudocode: [
        'function delete(root, value):',
        '  if root is null:',
        '    return null',
        '  if value < root.value:',
        '    root.left = delete(root.left, value)',
        '  else if value > root.value:',
        '    root.right = delete(root.right, value)',
        '  else:',
        '    // Node found, handle deletion based on number of children',
        '    if root has no children:',
        '      return null',
        '    if root has only left child:',
        '      return root.left',
        '    if root has only right child:',
        '      return root.right',
        '    // Node has two children',
        '    // Find inorder successor (smallest in right subtree)',
        '    successor = findMin(root.right)',
        '    root.value = successor.value',
        '    root.right = delete(root.right, successor.value)',
        '  return root'
      ]
    },
    search: {
      title: 'BST Search',
      description: 'Searches for a specific value in a Binary Search Tree by comparing the target value with the current node and recursively searching the appropriate subtree.',
      timeComplexity: 'O(h) - where h is the height of the tree. Best case O(log n) for balanced trees, worst case O(n) for skewed trees.',
      spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
      pseudocode: [
        'function search(root, value):',
        '  if root is null or root.value equals value:',
        '    return root',
        '  if value < root.value:',
        '    return search(root.left, value)',
        '  else:',
        '    return search(root.right, value)'
      ]
    },
    inorder: {
      title: 'In-Order Traversal',
      description: 'Visits all nodes of a binary tree by recursively traversing the left subtree, then the root, then the right subtree. For a BST, this yields nodes in sorted order.',
      timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
      spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
      pseudocode: [
        'function inorderTraversal(root):',
        '  if root is null:',
        '    return',
        '  inorderTraversal(root.left)',
        '  visit(root)',
        '  inorderTraversal(root.right)'
      ]
    },
    preorder: {
      title: 'Pre-Order Traversal',
      description: 'Visits the root first, then recursively traverses the left subtree, then the right subtree. Useful for creating a copy of the tree or prefix expression evaluation.',
      timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
      spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
      pseudocode: [
        'function preorderTraversal(root):',
        '  if root is null:',
        '    return',
        '  visit(root)',
        '  preorderTraversal(root.left)',
        '  preorderTraversal(root.right)'
      ]
    },
    postorder: {
      title: 'Post-Order Traversal',
      description: 'Recursively traverses the left subtree, then the right subtree, and finally visits the root. Useful for deleting a tree or evaluating postfix expressions.',
      timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
      spaceComplexity: 'O(h) for the recursive call stack, where h is the height of the tree.',
      pseudocode: [
        'function postorderTraversal(root):',
        '  if root is null:',
        '    return',
        '  postorderTraversal(root.left)',
        '  postorderTraversal(root.right)',
        '  visit(root)'
      ]
    },
    levelorder: {
      title: 'Level-Order Traversal',
      description: 'Visits all nodes level by level, from left to right. Uses a queue to keep track of nodes to visit. Also known as Breadth-First Search for trees.',
      timeComplexity: 'O(n) - where n is the number of nodes in the tree.',
      spaceComplexity: 'O(w) where w is the maximum width of the tree (maximum number of nodes at any level).',
      pseudocode: [
        'function levelOrderTraversal(root):',
        '  if root is null:',
        '    return',
        '  create empty queue q',
        '  q.enqueue(root)',
        '  while q is not empty:',
        '    node = q.dequeue()',
        '    visit(node)',
        '    if node.left is not null:',
        '      q.enqueue(node.left)',
        '    if node.right is not null:',
        '      q.enqueue(node.right)'
      ]
    }
  },
  avl: {
    insert: {
      title: 'AVL Insert',
      description: 'Inserts a node into an AVL tree and performs rotations if necessary to maintain balance.',
      timeComplexity: 'O(log n) - where n is the number of nodes in the tree.',
      spaceComplexity: 'O(log n) for the recursive call stack.',
      pseudocode: [
        'function insert(root, value):',
        '  // Standard BST insert',
        '  if root is null:',
        '    return new Node(value)',
        '  if value < root.value:',
        '    root.left = insert(root.left, value)',
        '  else if value > root.value:',
        '    root.right = insert(root.right, value)',
        '  else:',
        '    return root // Duplicate value',
        '',
        '  // Update height of current node',
        '  root.height = 1 + max(height(root.left), height(root.right))',
        '',
        '  // Get balance factor to check if unbalanced',
        '  balance = getBalance(root)',
        '',
        '  // Left Left Case',
        '  if balance > 1 and value < root.left.value:',
        '    return rightRotate(root)',
        '',
        '  // Right Right Case',
        '  if balance < -1 and value > root.right.value:',
        '    return leftRotate(root)',
        '',
        '  // Left Right Case',
        '  if balance > 1 and value > root.left.value:',
        '    root.left = leftRotate(root.left)',
        '    return rightRotate(root)',
        '',
        '  // Right Left Case',
        '  if balance < -1 and value < root.right.value:',
        '    root.right = rightRotate(root.right)',
        '    return leftRotate(root)',
        '',
        '  return root'
      ]
    }
  },
  redblack: {
    insert: {
      title: 'Red-Black Tree Insert',
      description: 'Inserts a node into a Red-Black tree and recolors or rotates nodes to maintain Red-Black properties.',
      timeComplexity: 'O(log n) - where n is the number of nodes in the tree.',
      spaceComplexity: 'O(log n) for the recursive call stack.',
      pseudocode: [
        'function insert(root, value):',
        '  // Standard BST insert with red node',
        '  root = bstInsert(root, value)',
        '  // Fix Red-Black tree violations',
        '  return fixViolations(root, value)'
      ]
    }
  }
};

export const TreeAlgorithmDetails: React.FC = () => {
  const { selectedOperation, treeType } = useTree();

  // Get appropriate algorithm info based on tree type and operation
  const getAlgorithmDetails = () => {
    const treeInfo = algorithmInfo[treeType] || algorithmInfo.bst;
    if (treeInfo[selectedOperation]) {
      return treeInfo[selectedOperation]!;
    }
    return treeInfo.insert!;
  };

  const algorithmDetails = getAlgorithmDetails();

  return (
    <div className="bg-card dark:bg-card-dark p-4 rounded-md shadow-md text-text dark:text-text-dark">
      <h2 className="text-lg font-semibold mb-3">{algorithmDetails.title}</h2>
      
      <div className="space-y-4">
        {/* Algorithm Description */}
        <div>
          <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-1">Description</h3>
          <p className="text-sm">{algorithmDetails.description}</p>
        </div>
        
        {/* Complexity Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-1">Time Complexity</h3>
            <p className="text-sm font-mono bg-canvas dark:bg-canvas-dark p-2 rounded">{algorithmDetails.timeComplexity}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-1">Space Complexity</h3>
            <p className="text-sm font-mono bg-canvas dark:bg-canvas-dark p-2 rounded">{algorithmDetails.spaceComplexity}</p>
          </div>
        </div>
        
        {/* Pseudocode */}
        <div>
          <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark mb-1">Pseudocode</h3>
          <div className="bg-canvas dark:bg-canvas-dark p-3 rounded overflow-auto max-h-56">
            <pre className="text-xs font-mono whitespace-pre">
              {algorithmDetails.pseudocode.join('\n')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}; 