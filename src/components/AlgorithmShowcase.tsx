import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";

export const AlgorithmShowcase = () => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const algorithms = [
    { name: "Bubble Sort", type: "sorting", icon: "🔄" },
    { name: "Binary Search", type: "searching", icon: "🎯" },
    { name: "A* Pathfinding", type: "pathfinding", icon: "🗺️" },
    { name: "Tree Traversal", type: "tree", icon: "🌳" },
  ];

  // Keep a ref of the paused state to avoid stale closures inside setInterval
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Cycle through algorithms every 4 seconds – single interval for the component lifetime
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentAlgorithm((prev) => (prev + 1) % algorithms.length);
      }
    }, 4000);

    return () => clearInterval(interval);
    // algorithms.length is constant (4) so it is safe to omit from deps
  }, []);

  // Sorting Animation Component
  const SortingAnimation = () => {
    const [bars, setBars] = useState([
      { height: 40, color: "from-blue-400 to-cyan-400", isActive: false },
      { height: 80, color: "from-blue-400 to-cyan-400", isActive: false },
      { height: 30, color: "from-blue-400 to-cyan-400", isActive: false },
      { height: 90, color: "from-blue-400 to-cyan-400", isActive: false },
      { height: 60, color: "from-blue-400 to-cyan-400", isActive: false },
      { height: 50, color: "from-blue-400 to-cyan-400", isActive: false },
    ]);

    useEffect(() => {
      const animateSort = async () => {
        // Bubble sort animation
        for (let i = 0; i < bars.length - 1; i++) {
          for (let j = 0; j < bars.length - i - 1; j++) {
            setBars((prev) =>
              prev.map((bar, idx) => ({
                ...bar,
                isActive: idx === j || idx === j + 1,
                color:
                  idx === j || idx === j + 1
                    ? "from-purple-400 to-pink-400"
                    : "from-blue-400 to-cyan-400",
              }))
            );

            await new Promise((resolve) => setTimeout(resolve, 300));

            setBars((prev) => {
              const newBars = [...prev];
              if (newBars[j].height > newBars[j + 1].height) {
                [newBars[j], newBars[j + 1]] = [newBars[j + 1], newBars[j]];
              }
              return newBars.map((bar) => ({
                ...bar,
                isActive: false,
                color: "from-emerald-400 to-teal-400",
              }));
            });
          }
        }

        // Reset animation
        setTimeout(() => {
          setBars([
            { height: 40, color: "from-blue-400 to-cyan-400", isActive: false },
            { height: 80, color: "from-blue-400 to-cyan-400", isActive: false },
            { height: 30, color: "from-blue-400 to-cyan-400", isActive: false },
            { height: 90, color: "from-blue-400 to-cyan-400", isActive: false },
            { height: 60, color: "from-blue-400 to-cyan-400", isActive: false },
            { height: 50, color: "from-blue-400 to-cyan-400", isActive: false },
          ]);
        }, 500);
      };

      animateSort();
    }, []);

    return (
      <div className="flex items-end justify-center gap-2 h-32">
        {bars.map((bar, index) => (
          <motion.div
            key={index}
            className={`w-8 bg-gradient-to-t ${bar.color} rounded-t-lg shadow-lg`}
            style={{ height: bar.height }}
            animate={{
              height: bar.height,
              scale: bar.isActive ? 1.1 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        ))}
      </div>
    );
  };

  // Binary Search Animation Component
  const BinarySearchAnimation = () => {
    const [array] = useState([2, 5, 8, 12, 16, 23, 38, 45, 67, 78]);
    const [target] = useState(23);
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(9);
    const [mid, setMid] = useState(4);
    const [found, setFound] = useState(false);

    useEffect(() => {
      const animateSearch = async () => {
        let l = 0,
          r = 9;
        setLeft(l);
        setRight(r);
        setFound(false);

        while (l <= r) {
          const m = Math.floor((l + r) / 2);
          setMid(m);
          await new Promise((resolve) => setTimeout(resolve, 800));

          if (array[m] === target) {
            setFound(true);
            break;
          } else if (array[m] < target) {
            l = m + 1;
            setLeft(l);
          } else {
            r = m - 1;
            setRight(r);
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Reset animation
        setTimeout(() => {
          setLeft(0);
          setRight(9);
          setMid(4);
          setFound(false);
        }, 1000);
      };

      animateSearch();
    }, [array, target]);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm text-text-muted text-code">
          Target: {target}
        </div>
        <div className="flex gap-1">
          {array.map((num, index) => (
            <motion.div
              key={index}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded border ${
                found && index === mid
                  ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg"
                  : index === mid
                  ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-md"
                  : index >= left && index <= right
                  ? "bg-gradient-to-br from-blue-400 to-cyan-400 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
              animate={{
                scale: index === mid ? 1.2 : 1,
                y: index === mid ? -4 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Pathfinding Animation Component
  const PathfindingAnimation = () => {
    const [grid] = useState(() => {
      const newGrid = Array(6)
        .fill(null)
        .map(() => Array(8).fill("empty"));
      newGrid[1][1] = "start";
      newGrid[4][6] = "end";
      newGrid[2][3] = "wall";
      newGrid[2][4] = "wall";
      newGrid[3][4] = "wall";
      return newGrid;
    });
    const [visitedCells, setVisitedCells] = useState(new Set());
    const [pathCells, setPathCells] = useState(new Set());

    useEffect(() => {
      const animatePathfinding = async () => {
        setVisitedCells(new Set());
        setPathCells(new Set());

        // Simulate A* exploration
        const toVisit = [
          [1, 2],
          [2, 1],
          [1, 3],
          [3, 1],
          [2, 2],
          [3, 2],
          [3, 3],
          [4, 3],
          [4, 4],
          [4, 5],
        ];

        for (const [row, col] of toVisit) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setVisitedCells((prev) => new Set([...prev, `${row}-${col}`]));
        }

        // Animate path
        await new Promise((resolve) => setTimeout(resolve, 500));
        const path = [
          [1, 1],
          [2, 1],
          [3, 1],
          [3, 2],
          [3, 3],
          [4, 3],
          [4, 4],
          [4, 5],
          [4, 6],
        ];

        for (const [row, col] of path) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          setPathCells((prev) => new Set([...prev, `${row}-${col}`]));
        }

        // Reset animation
        setTimeout(() => {
          setVisitedCells(new Set());
          setPathCells(new Set());
        }, 1500);
      };

      animatePathfinding();
    }, []);

    const getCellStyle = (row: number, col: number) => {
      const cellKey = `${row}-${col}`;
      const cellType = grid[row][col];

      if (cellType === "start")
        return "bg-gradient-to-br from-emerald-400 to-teal-400";
      if (cellType === "end")
        return "bg-gradient-to-br from-red-400 to-pink-400";
      if (cellType === "wall") return "bg-gray-600";
      if (pathCells.has(cellKey))
        return "bg-gradient-to-br from-yellow-400 to-orange-400";
      if (visitedCells.has(cellKey))
        return "bg-gradient-to-br from-blue-400 to-cyan-400";

      return "bg-gray-800 border border-gray-700";
    };

    return (
      <div className="grid grid-cols-8 gap-1 w-fit mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={`w-4 h-4 rounded-sm ${getCellStyle(
                rowIndex,
                colIndex
              )}`}
              animate={{
                scale: pathCells.has(`${rowIndex}-${colIndex}`) ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))
        )}
      </div>
    );
  };

  // Tree Traversal Animation Component
  const TreeTraversalAnimation = () => {
    const [activeNode, setActiveNode] = useState<number | null>(null);
    const [visitedNodes, setVisitedNodes] = useState(new Set<number>());

    // Memoize nodes to prevent re-creation on re-renders
    const nodes = useMemo(
      () => [
        { id: 1, value: 50, x: 50, y: 10 },
        { id: 2, value: 30, x: 25, y: 40 },
        { id: 3, value: 70, x: 75, y: 40 },
        { id: 4, value: 20, x: 12, y: 70 },
        { id: 5, value: 40, x: 38, y: 70 },
        { id: 6, value: 60, x: 62, y: 70 },
        { id: 7, value: 80, x: 88, y: 70 },
      ],
      []
    );

    // Use ref to track animation state
    const animationRef = useRef<number | null>(null);
    const isRunningRef = useRef(false);

    useEffect(() => {
      const animateTraversal = async () => {
        if (isRunningRef.current) return; // Prevent multiple simultaneous animations
        isRunningRef.current = true;

        setVisitedNodes(new Set());
        setActiveNode(null);

        // Small delay before starting
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Inorder traversal: 20, 30, 40, 50, 60, 70, 80
        const traversalOrder = [4, 2, 5, 1, 6, 3, 7];

        for (const nodeId of traversalOrder) {
          if (!isRunningRef.current) break; // Exit if component unmounted

          setActiveNode(nodeId);
          await new Promise((resolve) => setTimeout(resolve, 600));

          if (!isRunningRef.current) break;

          setVisitedNodes((prev) => new Set([...prev, nodeId]));
          setActiveNode(null);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Reset animation with cleanup check
        animationRef.current = setTimeout(() => {
          if (isRunningRef.current) {
            setVisitedNodes(new Set());
            setActiveNode(null);
            isRunningRef.current = false;
          }
        }, 1000);
      };

      // Clear any existing timeout
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }

      animateTraversal();

      // Cleanup function
      return () => {
        isRunningRef.current = false;
        if (animationRef.current) {
          clearTimeout(animationRef.current);
          animationRef.current = null;
        }
      };
    }, []); // Empty dependency array to run only once per mount

    return (
      <div className="relative w-full h-32 pointer-events-none">
        {/* Edges */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
        >
          <line
            x1="50%"
            y1="20%"
            x2="25%"
            y2="50%"
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1="50%"
            y1="20%"
            x2="75%"
            y2="50%"
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1="25%"
            y1="50%"
            x2="12%"
            y2="80%"
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1="25%"
            y1="50%"
            x2="38%"
            y2="80%"
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1="75%"
            y1="50%"
            x2="62%"
            y2="80%"
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1="75%"
            y1="50%"
            x2="88%"
            y2="80%"
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={`tree-node-${node.id}`}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              activeNode === node.id
                ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg"
                : visitedNodes.has(node.id)
                ? "bg-gradient-to-br from-emerald-400 to-teal-400 text-white"
                : "bg-gradient-to-br from-blue-400 to-cyan-400 text-white"
            }`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: activeNode === node.id ? 1.3 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            initial={false} // Prevent initial animation
          >
            {node.value}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCurrentAnimation = () => {
    switch (currentAlgorithm) {
      case 0:
        return <SortingAnimation />;
      case 1:
        return <BinarySearchAnimation />;
      case 2:
        return <PathfindingAnimation />;
      case 3:
        return <TreeTraversalAnimation />;
      default:
        return <SortingAnimation />;
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Animation Container */}
      <div
        className="card-premium p-6 min-h-[280px] flex flex-col justify-between"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Algorithm Label */}
        <motion.div
          className="text-center mb-4"
          key={currentAlgorithm}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">
              {algorithms[currentAlgorithm].icon}
            </span>
            <h3 className="text-lg text-algorithm-name text-gradient">
              {algorithms[currentAlgorithm].name}
            </h3>
          </div>
          <div className="text-xs text-text-muted uppercase tracking-wider text-code">
            Live Algorithm Demo
          </div>
        </motion.div>

        {/* Animation Area */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAlgorithm}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {renderCurrentAnimation()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {algorithms.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentAlgorithm
                  ? "bg-gradient-to-r from-primary-400 to-accent-400"
                  : "bg-gray-600"
              }`}
              animate={{
                scale: index === currentAlgorithm ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Pause Indicator */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
          >
            Paused
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
