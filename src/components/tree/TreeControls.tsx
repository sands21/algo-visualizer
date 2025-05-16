import React, { useState } from 'react';
import { useTree, TreeOperationType } from '../../context/TreeContext';

export const TreeControls: React.FC = () => {
  const {
    createRandomTree,
    insertNode,
    deleteNode,
    searchNode,
    traverseInOrder,
    traversePreOrder,
    traversePostOrder,
    traverseLevelOrder,
    isRunning,
    selectedOperation,
    setTreeType,
    treeType,
    startOperation,
  } = useTree();

  const [nodeValue, setNodeValue] = useState<string>('');
  const [treeSize, setTreeSize] = useState<string>('7');
  
  // Handle node operations
  const handleOperationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(nodeValue);
    
    if (isNaN(value)) {
      return; // Invalid input
    }
    
    switch (selectedOperation) {
      case 'insert':
        insertNode(value);
        break;
      case 'delete':
        deleteNode(value);
        break;
      case 'search':
        searchNode(value);
        break;
      default:
        break;
    }
    
    setNodeValue('');
  };
  
  // Handle tree traversal
  const handleTraversal = (traversalType: TreeOperationType) => {
    switch (traversalType) {
      case 'inorder':
        traverseInOrder();
        break;
      case 'preorder':
        traversePreOrder();
        break;
      case 'postorder':
        traversePostOrder();
        break;
      case 'levelorder':
        traverseLevelOrder();
        break;
      default:
        break;
    }
  };
  
  // Handle random tree generation
  const handleRandomTree = (e: React.FormEvent) => {
    e.preventDefault();
    const size = parseInt(treeSize);
    
    if (isNaN(size) || size < 1) {
      return; // Invalid input
    }
    
    createRandomTree(size);
  };
  
  return (
    <div className="space-y-6 bg-card dark:bg-card-dark p-4 rounded-md shadow-md text-text dark:text-text-dark">
      {/* Tree Type Selection */}
      <div>
        <h3 className="text-sm font-medium mb-2">Tree Type</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              treeType === 'bst' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => setTreeType('bst')}
          >
            Binary Search Tree
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              treeType === 'avl' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => setTreeType('avl')}
          >
            AVL Tree
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              treeType === 'redblack' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => setTreeType('redblack')}
          >
            Red-Black Tree
          </button>
        </div>
      </div>
      
      {/* Tree Generation */}
      <div>
        <h3 className="text-sm font-medium mb-2">Tree Generation</h3>
        <form onSubmit={handleRandomTree} className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="treeSize" className="sr-only">Tree Size</label>
            <input
              id="treeSize"
              type="number"
              min="1"
              max="15"
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              value={treeSize}
              onChange={(e) => setTreeSize(e.target.value)}
              placeholder="Number of nodes"
            />
          </div>
          <button
            type="submit"
            className="bg-primary dark:bg-primary-dark text-white px-3 py-1.5 rounded-md text-sm"
            disabled={isRunning}
          >
            Generate Random Tree
          </button>
        </form>
      </div>
      
      {/* Node Operations */}
      <div>
        <h3 className="text-sm font-medium mb-2">Node Operations</h3>
        <div className="flex space-x-2 mb-2">
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedOperation === 'insert' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => startOperation('insert')}
            disabled={isRunning}
          >
            Insert
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedOperation === 'delete' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => startOperation('delete')}
            disabled={isRunning}
          >
            Delete
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedOperation === 'search' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => startOperation('search')}
            disabled={isRunning}
          >
            Search
          </button>
        </div>
        
        <form onSubmit={handleOperationSubmit} className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="nodeValue" className="sr-only">Node Value</label>
            <input
              id="nodeValue"
              type="number"
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              value={nodeValue}
              onChange={(e) => setNodeValue(e.target.value)}
              placeholder="Enter node value"
              disabled={isRunning && !['insert', 'delete', 'search'].includes(selectedOperation)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary dark:bg-primary-dark text-white px-3 py-1.5 rounded-md text-sm"
            disabled={isRunning || !['insert', 'delete', 'search'].includes(selectedOperation)}
          >
            Apply
          </button>
        </form>
      </div>
      
      {/* Tree Traversals */}
      <div>
        <h3 className="text-sm font-medium mb-2">Tree Traversals</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedOperation === 'inorder' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => handleTraversal('inorder')}
            disabled={isRunning}
          >
            In-Order
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedOperation === 'preorder' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => handleTraversal('preorder')}
            disabled={isRunning}
          >
            Pre-Order
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedOperation === 'postorder' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => handleTraversal('postorder')}
            disabled={isRunning}
          >
            Post-Order
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${
              selectedOperation === 'levelorder' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            onClick={() => handleTraversal('levelorder')}
            disabled={isRunning}
          >
            Level-Order
          </button>
        </div>
      </div>
    </div>
  );
}; 