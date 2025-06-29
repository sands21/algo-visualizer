import { PropsWithChildren, Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps extends PropsWithChildren {
  currentPage: "home" | "sorting" | "searching" | "graph" | "tree";
  onNavigate: Dispatch<
    SetStateAction<"home" | "sorting" | "searching" | "graph" | "tree">
  >;
}

export const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className="pt-24">{children}</main>
    </div>
  );
};

interface HeaderProps {
  currentPage: "home" | "sorting" | "searching" | "graph" | "tree";
  onNavigate: Dispatch<
    SetStateAction<"home" | "sorting" | "searching" | "graph" | "tree">
  >;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (
    page: "home" | "sorting" | "searching" | "graph" | "tree"
  ) => {
    console.log(`Navigating to: ${page}`); // Debug log
    onNavigate(page);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-6 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-full px-6 py-3 flex items-center justify-between glass-effect"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => handleNavigation("home")}
              className="flex items-center space-x-3 text-text hover:text-primary transition-colors duration-200"
            >
              <img 
                src="logo/logo.png" 
                alt="AlgoVisua Logo" 
                className="h-12"
              />
            </button>
          </motion.div>

          {/* Desktop Navigation Pills */}
          <div className="hidden md:flex items-center space-x-2">
            <NavPill
              active={currentPage === "sorting"}
              onClick={() => handleNavigation("sorting")}
            >
              Sorting
            </NavPill>
            <NavPill
              active={currentPage === "searching"}
              onClick={() => handleNavigation("searching")}
            >
              Searching
            </NavPill>
            <NavPill
              active={currentPage === "graph"}
              onClick={() => handleNavigation("graph")}
            >
              Graph
            </NavPill>
            <NavPill
              active={currentPage === "tree"}
              onClick={() => handleNavigation("tree")}
            >
              Tree
            </NavPill>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <motion.button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-text hover:text-primary transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </motion.button>
        </motion.nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden absolute top-20 left-0 right-0 mx-4"
            >
              <div
                className="rounded-2xl p-4 glass-effect"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                <div className="space-y-2">
                  <MobileNavItem
                    active={currentPage === "sorting"}
                    onClick={() => handleNavigation("sorting")}
                  >
                    Sorting
                  </MobileNavItem>
                  <MobileNavItem
                    active={currentPage === "searching"}
                    onClick={() => handleNavigation("searching")}
                  >
                    Searching
                  </MobileNavItem>
                  <MobileNavItem
                    active={currentPage === "graph"}
                    onClick={() => handleNavigation("graph")}
                  >
                    Graph
                  </MobileNavItem>
                  <MobileNavItem
                    active={currentPage === "tree"}
                    onClick={() => handleNavigation("tree")}
                  >
                    Tree
                  </MobileNavItem>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

interface NavPillProps extends PropsWithChildren {
  active?: boolean;
  onClick: () => void;
}

const NavPill = ({ active, onClick, children }: NavPillProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
        ${active ? "text-white shadow-lg" : "text-text-muted hover:text-text"}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: active
          ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)"
          : "transparent",
        boxShadow: active ? "0 4px 20px rgba(59, 130, 246, 0.3)" : "none",
      }}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
            boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

interface MobileNavItemProps extends PropsWithChildren {
  active?: boolean;
  onClick: () => void;
}

const MobileNavItem = ({ active, onClick, children }: MobileNavItemProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
        ${active ? "text-white" : "text-text-muted hover:text-text"}
      `}
      whileTap={{ scale: 0.98 }}
      style={{
        background: active
          ? "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)"
          : "transparent",
        boxShadow: active ? "0 4px 20px rgba(59, 130, 246, 0.3)" : "none",
      }}
    >
      {children}
    </motion.button>
  );
};
