import React from 'react';
import { useAppContext } from '../context/AppContext';
import styles from './Sidebar.module.css'; // Import the CSS module

const ALGORITHMS = [
  {
    category: 'Sorting',
    items: [
      { key: 'bubbleSort', label: 'Bubble Sort' },
      { key: 'selectionSort', label: 'Selection Sort' },
      { key: 'insertionSort', label: 'Insertion Sort' },
      { key: 'mergeSort', label: 'Merge Sort' },
      { key: 'quickSort', label: 'Quick Sort' },
    ],
  },
  {
    category: 'Searching',
    items: [
      { key: 'linearSearch', label: 'Linear Search' },
      { key: 'binarySearch', label: 'Binary Search' },
    ],
  },
  {
    category: 'Graph Traversal',
    items: [
      { key: 'bfs', label: 'Breadth-First Search (BFS)' },
      { key: 'dfs', label: 'Depth-First Search (DFS)' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const { state, selectAlgorithm } = useAppContext();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Algorithms
        </h2>
        <div className={styles.categoriesContainer}>
          {ALGORITHMS.map((cat) => (
            <div key={cat.category}>
              <h3 className={styles.categoryTitle}>
                {cat.category}
              </h3>
              <ul className={styles.algorithmList}>
                {cat.items.map((algo) => (
                  <li key={algo.key}>
                    <button
                      className={`${styles.algorithmButton} ${
                        state.selectedAlgorithm === algo.key ? styles.algorithmButtonSelected : ''
                      }`}
                      onClick={() => selectAlgorithm(algo.key)}
                    >
                      {algo.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Removed extra closing div */}
    </aside>
  );
};

export default Sidebar;
