import { SearchingProvider } from '../../context/SearchingContext';
import { SearchVisualization } from './SearchVisualization';
import { SearchingControls } from './SearchingControls';
import { AlgorithmDetails } from '../AlgorithmDetails';
import { useState } from 'react';

export const SearchingPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <SearchingProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Searching Algorithms Visualization</h1>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary dark:text-primary-dark hover:underline flex items-center"
          >
            {showDetails ? 'Hide Details' : 'Show Algorithm Details'}
            <svg 
              className={`ml-1 h-4 w-4 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {showDetails && (
          <div className="mb-6 p-4 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark">
            <AlgorithmDetails type="searching" />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SearchVisualization />
          </div>
          <div className="bg-card dark:bg-card-dark rounded-lg p-6 border border-border dark:border-border-dark">
            <SearchingControls />
          </div>
        </div>
      </div>
    </SearchingProvider>
  );
}; 