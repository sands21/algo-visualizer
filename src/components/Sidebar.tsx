import React from "react";
import { useAppContext } from "../context/AppContext";
import styles from "./Sidebar.module.css"; // Import the CSS module

const ALGORITHMS = [
  {
    category: "Sorting",
    items: [
      { key: "bubbleSort", label: "Bubble Sort" },
      { key: "selectionSort", label: "Selection Sort" },
      { key: "insertionSort", label: "Insertion Sort" },
      { key: "mergeSort", label: "Merge Sort" },
      { key: "quickSort", label: "Quick Sort" },
    ],
  },
  {
    category: "Searching",
    items: [
      { key: "linearSearch", label: "Linear Search" },
      { key: "binarySearch", label: "Binary Search" },
    ],
  },
  {
    category: "Graph Traversal",
    items: [
      { key: "bfs", label: "Breadth-First Search (BFS)" },
      { key: "dfs", label: "Depth-First Search (DFS)" },
    ],
  },
];

const Sidebar: React.FC = () => {
  // Get state and toggle function from context
  const { state, selectAlgorithm, toggleSidebar } = useAppContext();
  const { isSidebarOpen } = state;

  // Close sidebar when an algorithm is selected on mobile
  const handleAlgorithmSelect = (algoKey: string) => {
    selectAlgorithm(algoKey);
    // Check screen width or rely on CSS to only close if it's in mobile view
    // For simplicity, we can close it always, CSS will handle visibility
    if (isSidebarOpen) {
      // Check if window width is below the breakpoint (e.g., 1024px)
      if (window.innerWidth < 1024) {
        toggleSidebar();
      }
    }
  };

  return (
    <>
      {/* Overlay to close sidebar when clicked outside on mobile */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar}></div>
      )}

      {/* Apply 'sidebarOpen' class conditionally */}
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.container}>
          {/* Optional: Add a close button for mobile */}
          <button className={styles.closeButton} onClick={toggleSidebar}>
            &times; {/* Simple close icon */}
          </button>
          <h2 className={`${styles.title} text-section-heading`}>Algorithms</h2>
          <div className={styles.categoriesContainer}>
            {ALGORITHMS.map((cat) => (
              <div key={cat.category}>
                <h3 className={`${styles.categoryTitle} text-nav`}>
                  {cat.category}
                </h3>
                <ul className={styles.algorithmList}>
                  {cat.items.map((algo) => (
                    <li key={algo.key}>
                      <button
                        className={`${styles.algorithmButton} ${
                          state.selectedAlgorithm === algo.key
                            ? styles.algorithmButtonSelected
                            : ""
                        } text-algorithm-name`}
                        // Use the handler to potentially close sidebar on mobile
                        onClick={() => handleAlgorithmSelect(algo.key)}
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
    </>
  );
};

export default Sidebar;
