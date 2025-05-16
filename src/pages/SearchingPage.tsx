import React, { useState } from 'react';
import { SearchVisualization } from '../components/searching/SearchVisualization';
import { SearchingControls } from '../components/searching/SearchingControls';
import { SearchingProvider } from '../context/SearchingContext';
import { SearchingAlgorithmDetails } from '../components/searching/SearchingAlgorithmDetails';

export const SearchingPage: React.FC = () => {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <SearchingProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main visualization area with algo details below */}
          <div className="lg:col-span-3">
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-card dark:shadow-card-dark transition-colors duration-200">
              <div className="p-6 border-b border-border dark:border-border-dark">
                <h2 className="text-2xl font-bold text-text dark:text-text-dark">Searching Algorithm Visualization</h2>
              </div>
              <div className="p-6">
                <SearchVisualization />
              </div>
            </div>
            
            {/* Algorithm Details Section */}
            <div className="mt-8 bg-card dark:bg-card-dark rounded-lg shadow-card dark:shadow-card-dark p-6 transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-text dark:text-text-dark">Algorithm Details</h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-text dark:hover:text-text-dark transition-colors"
                >
                  {showDetails ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showDetails && <SearchingAlgorithmDetails />}
            </div>
          </div>
          
          {/* Control panel sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-card dark:shadow-card-dark p-6 transition-colors duration-200">
              <h3 className="text-xl font-bold text-text dark:text-text-dark mb-4">Controls</h3>
              <SearchingControls />
            </div>
          </div>
        </div>
      </div>
    </SearchingProvider>
  );
}; 