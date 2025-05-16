import { Layout } from './components/ui/Layout';
import { SortingPage } from './pages/SortingPage';
import { SearchingPage } from './pages/SearchingPage';
import { GraphPage } from './pages/GraphPage';
import { TreePage } from './pages/TreePage';
import { HomePage } from './pages/HomePage';
import { ThemeProvider } from './context/ThemeContext';
import { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'sorting' | 'searching' | 'graph' | 'tree'>('home');
  
  return (
    <ThemeProvider>
      <Layout onNavigate={setCurrentPage} currentPage={currentPage}>
        {currentPage === 'home' ? <HomePage onNavigate={setCurrentPage} /> :
         currentPage === 'sorting' ? <SortingPage /> : 
         currentPage === 'searching' ? <SearchingPage /> : 
         currentPage === 'graph' ? <GraphPage /> :
         <TreePage />}
      </Layout>
    </ThemeProvider>
  );
}
