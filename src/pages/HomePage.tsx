import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

interface HomePageProps {
  onNavigate: Dispatch<SetStateAction<'home' | 'sorting' | 'searching' | 'graph' | 'tree'>>;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const algorithmCards = [
    {
      title: "Sorting Algorithms",
      description: "Visualize and understand popular sorting algorithms like Bubble Sort, Quick Sort, and Merge Sort.",
      icon: "📊",
      color: "from-blue-500 to-cyan-400",
      page: 'sorting' as const,
    },
    {
      title: "Searching Algorithms",
      description: "Explore how algorithms like Binary Search and Linear Search work through interactive visualizations.",
      icon: "🔍",
      color: "from-green-500 to-emerald-400",
      page: 'searching' as const,
    },
    {
      title: "Graph Algorithms",
      description: "Discover pathfinding algorithms like Dijkstra's and A* on interactive graph structures.",
      icon: "🕸️",
      color: "from-purple-500 to-pink-400",
      page: 'graph' as const,
    },
    {
      title: "Tree Algorithms",
      description: "Learn about tree traversal, balancing, and other tree operations through visualization.",
      icon: "🌳",
      color: "from-yellow-500 to-amber-400",
      page: 'tree' as const,
    },
  ];

  return (
    <div className="pt-8 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
            Algorithm Visualizer
          </h1>
          <p className="text-xl md:text-2xl text-text dark:text-text-dark opacity-80 max-w-3xl mx-auto mb-10">
            An interactive tool to visualize and understand how algorithms work, step by step.
          </p>
          
          <motion.button
            onClick={() => onNavigate('sorting')}
            className="px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Start Exploring
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-text dark:text-text-dark">
            Visualize Different Algorithm Types
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {algorithmCards.map((card, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${card.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden relative group`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => onNavigate(card.page)}
              >
                <div className="absolute -right-6 -top-6 text-5xl opacity-20 group-hover:opacity-30 transition-opacity">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-white text-opacity-90 text-sm">{card.description}</p>
                <div className="mt-4 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  <span>Explore</span>
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-text dark:text-text-dark">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Choose an Algorithm",
                description: "Select from our collection of sorting, searching, graph, and tree algorithms.",
                icon: "📋",
              },
              {
                title: "Configure Parameters",
                description: "Adjust speed, data size, and other parameters to customize your visualization.",
                icon: "⚙️",
              },
              {
                title: "Watch & Learn",
                description: "Observe the algorithm in action with step-by-step visualization and explanation.",
                icon: "🎬",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-card dark:bg-card-dark rounded-xl p-6 shadow-md border border-border dark:border-border-dark"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-text-dark">{item.title}</h3>
                <p className="text-text-muted dark:text-text-muted-dark">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          variants={itemVariants}
          className="text-center bg-card dark:bg-card-dark rounded-2xl p-12 shadow-lg border border-border dark:border-border-dark"
        >
          <h2 className="text-3xl font-bold mb-6 text-text dark:text-text-dark">Ready to dive in?</h2>
          <p className="text-text-muted dark:text-text-muted-dark max-w-2xl mx-auto mb-8">
            Start visualizing algorithms now and enhance your understanding of computer science fundamentals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {algorithmCards.map((card, index) => (
              <motion.button
                key={index}
                onClick={() => onNavigate(card.page)}
                className={`px-6 py-3 bg-gradient-to-r ${card.color} text-white rounded-lg font-medium shadow-md`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {card.title.replace(" Algorithms", "")}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 