import { PropsWithChildren, Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps extends PropsWithChildren {
  currentPage: 'home' | 'sorting' | 'searching' | 'graph' | 'tree';
  onNavigate: Dispatch<SetStateAction<'home' | 'sorting' | 'searching' | 'graph' | 'tree'>>;
}

export const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  // We're not using the theme variable directly, but using dark mode classes
  // which are automatically applied by ThemeContext
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark transition-colors duration-200">
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

interface HeaderProps {
  currentPage: 'home' | 'sorting' | 'searching' | 'graph' | 'tree';
  onNavigate: Dispatch<SetStateAction<'home' | 'sorting' | 'searching' | 'graph' | 'tree'>>;
}

const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-card dark:bg-card-dark shadow-sm dark:shadow-card-dark border-b border-border dark:border-border-dark transition-colors duration-200">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <h1 
            className="text-xl font-semibold text-text dark:text-text-dark cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            AlgoVisua
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <NavButton 
            active={currentPage === 'sorting'} 
            onClick={() => onNavigate('sorting')}
          >
            Sorting
          </NavButton>
          <NavButton 
            active={currentPage === 'searching'} 
            onClick={() => onNavigate('searching')}
          >
            Searching
          </NavButton>
          <NavButton 
            active={currentPage === 'graph'} 
            onClick={() => onNavigate('graph')}
          >
            Graph
          </NavButton>
          <NavButton 
            active={currentPage === 'tree'} 
            onClick={() => onNavigate('tree')}
          >
            Tree
          </NavButton>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </motion.div>
      </nav>
    </header>
  );
};

interface NavButtonProps extends PropsWithChildren {
  active?: boolean;
  onClick: () => void;
}

const NavButton = ({ active, onClick, children }: NavButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active 
          ? 'bg-primary text-white' 
          : 'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark'
        }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}; 