import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { AlgorithmShowcase } from "../components/AlgorithmShowcase";

// Animated Counter Component
const AnimatedCounter = ({
  value,
  duration = 2,
}: {
  value: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Handle special cases like "∞" and percentage
          if (value === "∞") {
            setCount(0);
            return;
          }

          const numericValue = parseInt(value.replace(/[^\d]/g, ""));
          if (isNaN(numericValue)) return;

          let startValue = 0;
          const increment = numericValue / (duration * 60); // 60fps

          const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(startValue));
            }
          }, 1000 / 60);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const displayValue = () => {
    if (value === "∞") return "∞";
    if (value.includes("%")) return `${count}%`;
    if (value.includes("+")) return `${count}+`;
    return count.toString();
  };

  return (
    <div
      ref={ref}
      className="text-lg sm:text-xl md:text-2xl font-bold text-gradient mb-1"
    >
      {displayValue()}
    </div>
  );
};

interface HomePageProps {
  onNavigate: Dispatch<
    SetStateAction<"home" | "sorting" | "searching" | "graph" | "tree">
  >;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleNavigation = (
    page: "home" | "sorting" | "searching" | "graph" | "tree"
  ) => {
    console.log(`HomePage navigating to: ${page}`); // Debug log
    onNavigate(page);
  };

  // Intersection observer for smooth section reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    const sections = document.querySelectorAll(".observe-section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Lightweight, reusable animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const algorithmCards = [
    {
      title: "Sorting Algorithms",
      description:
        "Watch data transform through elegant sorting algorithms with real-time visualization and step-by-step explanations.",
      icon: "📊",
      gradient: "from-blue-500 via-cyan-400 to-teal-400",
      shadowColor: "shadow-blue-500/20",
      hoverShadow: "hover:shadow-blue-500/40",
      page: "sorting" as const,
      features: ["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort"],
      demo: "🔄",
    },
    {
      title: "Searching Algorithms",
      description:
        "Discover how algorithms efficiently find data through intelligent search strategies and optimized pathways.",
      icon: "🔍",
      gradient: "from-emerald-500 via-green-400 to-lime-400",
      shadowColor: "shadow-emerald-500/20",
      hoverShadow: "hover:shadow-emerald-500/40",
      page: "searching" as const,
      features: ["Binary Search", "Linear Search", "Hash Table", "Tree Search"],
      demo: "🎯",
    },
    {
      title: "Graph Algorithms",
      description:
        "Navigate complex networks and find optimal paths through interactive graph exploration and pathfinding.",
      icon: "🕸️",
      gradient: "from-purple-500 via-violet-400 to-pink-400",
      shadowColor: "shadow-purple-500/20",
      hoverShadow: "hover:shadow-purple-500/40",
      page: "graph" as const,
      features: ["Dijkstra", "A* Search", "BFS", "DFS"],
      demo: "🗺️",
    },
    {
      title: "Tree Algorithms",
      description:
        "Explore hierarchical data structures with dynamic tree operations, balancing, and traversal techniques.",
      icon: "🌳",
      gradient: "from-amber-500 via-orange-400 to-red-400",
      shadowColor: "shadow-amber-500/20",
      hoverShadow: "hover:shadow-amber-500/40",
      page: "tree" as const,
      features: ["BST", "AVL Tree", "Red-Black", "Traversals"],
      demo: "🌲",
    },
  ];

  const howItWorksSteps = [
    {
      title: "Choose Your Algorithm",
      description:
        "Select from our comprehensive collection of algorithms across different categories and complexity levels.",
      icon: "🎯",
      color: "from-blue-400 to-cyan-400",
      step: "01",
    },
    {
      title: "Customize Parameters",
      description:
        "Fine-tune visualization speed, data size, and algorithm-specific parameters for optimal learning.",
      icon: "⚙️",
      color: "from-purple-400 to-pink-400",
      step: "02",
    },
    {
      title: "Watch & Understand",
      description:
        "Experience algorithms in action with real-time visualization, code highlighting, and detailed explanations.",
      icon: "🎬",
      color: "from-emerald-400 to-teal-400",
      step: "03",
    },
  ];

  const stats = [
    { value: "20+", label: "Algorithms", icon: "⚡" },
    { value: "4", label: "Categories", icon: "📚" },
    { value: "∞", label: "Possibilities", icon: "🚀" },
    { value: "100%", label: "Open Source", icon: "💻" },
  ];

  return (
    <div className="relative min-h-screen">
      
      {/* Dynamic gradient background */}
      <motion.div
        className="fixed inset-0 z-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 0%, rgba(17,24,39,0.6) 0%, rgba(0,0,0,0) 60%), radial-gradient(1200px 600px at 90% 10%, rgba(12,20,35,0.5) 0%, rgba(0,0,0,0) 60%)",
        }}
      >
        {/* Hero Section */}
        <motion.section className="relative pt-3 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Two Column Layout: Text Left, Animation Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center py-8">
              {/* Left Column - Text Content */}
              <motion.div
                variants={fadeUp}
                className="order-2 lg:order-1 pt-8 lg:pt-12 text-center lg:text-center xl:text-left flex flex-col items-center lg:items-center xl:items-start lg:ml-24"
              >
                <motion.h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-display mb-8 leading-[1.1]">
                  <span className="block text-gradient bg-gradient-to-r from-primary-300 via-accent-300 to-secondary-300 bg-300% animate-gradient">
                    Algorithm
                  </span>
                  <span className="block text-gradient-secondary mt-2">
                    Visualizer
                  </span>
                </motion.h1>

                <p className="text-base sm:text-lg md:text-xl text-text-muted mb-10 text-body max-w-xl lg:max-w-2xl">
                  Transform your understanding of computer science with our
                  <span className="text-gradient font-semibold">
                    {" "}
                    interactive algorithm visualizations
                  </span>
                  . Learn, explore, and master algorithms through cutting-edge
                  visual experiences.
                </p>

                <motion.div className="mb-8 flex justify-center">
                  <motion.button
                    onClick={() => handleNavigation("sorting")}
                    className="btn-primary group relative overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 shadow-lg hover:shadow-primary-500/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Start Exploring
                      <motion.span
                        className="text-xl"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                    {/* Enhanced shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    {/* Ripple effect on hover */}
                    <div className="absolute inset-0 rounded-lg bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Column - Algorithm Animation */}
              <motion.div
                variants={fadeUp}
                className="order-1 lg:order-2 flex items-center justify-center mb-8 lg:mb-0"
              >
                <div className="w-full max-w-sm sm:max-w-md mx-auto">
                  <AlgorithmShowcase />
                </div>
              </motion.div>
            </div>

            {/* Stats Section - Below both columns */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto mt-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + index * 0.1,
                    ease: [0.21, 0.45, 0.27, 0.9],
                  }}
                  className="text-center group py-4 px-3 rounded-xl hover:bg-primary-500/5 hover:backdrop-blur-sm border border-transparent hover:border-primary-500/20 cursor-pointer transition-all duration-300"
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                    transition: {
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }}
                >
                  <motion.div
                    className="text-xl sm:text-2xl mb-2"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{
                      type: "tween",
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  <AnimatedCounter value={stat.value} />
                  <div className="text-xs sm:text-sm text-text-muted font-medium group-hover:text-primary-300 transition-colors duration-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 observe-section">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-section-heading mb-6 text-gradient leading-[1.2]">
                Explore Algorithm Categories
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-3xl mx-auto text-body">
                Dive deep into different algorithm types with interactive
                visualizations that make complex concepts crystal clear.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {algorithmCards.map((card, index) => (
                <motion.div
                  key={index}
                  className={`card-premium cursor-pointer group ${card.shadowColor} ${card.hoverShadow} hover:shadow-2xl mx-4 md:mx-0`}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => handleNavigation(card.page)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-3xl">{card.icon}</span>
                    </div>
                    <div className="text-2xl opacity-60 group-hover:opacity-100 group-hover:animate-bounce-gentle transition-all">
                      {card.demo}
                    </div>
                  </div>

                  <h3 className="text-2xl text-algorithm-name mb-4 text-gradient-primary">
                    {card.title}
                  </h3>
                  <p className="text-text-muted mb-6 text-body">
                    {card.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {card.features.map((feature, i) => (
                      <motion.span
                        key={i}
                        className="px-3 py-1 text-sm backdrop-blur-md border rounded-full text-text glass-effect hover:bg-primary-500/20 hover:border-primary-400/50 hover:text-primary-300 cursor-pointer transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -1 }}
                        transition={{
                          type: "tween",
                          duration: 0.15,
                          ease: "easeOut",
                          delay: 0.1 * i,
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex items-center text-primary-400 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>Explore Now</span>
                    <motion.span
                      className="ml-2 text-xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 observe-section">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-section-heading mb-6 text-gradient leading-[1.2]">
                How It Works
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-3xl mx-auto text-body">
                Get started with algorithm visualization in three simple steps.
                Our intuitive interface makes learning algorithms effortless.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer"
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                >
                  {/* Connection line for desktop */}
                  {index < howItWorksSteps.length - 1 && (
                    <motion.div
                      className="hidden md:block absolute top-16 left-full w-12 h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform translate-x-4"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    />
                  )}

                  <div className="card-premium text-center relative overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500">
                    {/* Animated background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <motion.div
                      className="absolute top-4 right-4 text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{
                        type: "tween",
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                    >
                      {step.step}
                    </motion.div>

                    <motion.div
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ y: -2, rotateY: 3 }}
                      transition={{
                        type: "tween",
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                    >
                      <motion.span
                        className="text-3xl"
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: "tween",
                          duration: 0.15,
                          ease: "easeOut",
                        }}
                      >
                        {step.icon}
                      </motion.span>
                    </motion.div>

                    <h3 className="text-2xl text-algorithm-name mb-4 text-gradient-primary relative group-hover:text-primary-300 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-text-muted text-body group-hover:text-text transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 observe-section">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div className="card-premium relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl md:text-5xl text-section-heading mb-6 text-gradient leading-[1.2]">
                  Ready to Master Algorithms?
                </h2>
                <p className="text-lg sm:text-xl text-text-muted mb-8 max-w-2xl mx-auto text-body">
                  Join thousands of developers and students who have transformed
                  their understanding of computer science through interactive
                  visualization.
                </p>
                <motion.button
                  onClick={() => handleNavigation("sorting")}
                  className="btn-primary group relative overflow-hidden text-lg px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 shadow-lg hover:shadow-primary-500/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Start Your Journey
                    <motion.span
                      className="text-xl"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  {/* Enhanced shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  {/* Ripple effect on hover */}
                  <div className="absolute inset-0 rounded-lg bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};
