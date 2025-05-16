import React, { useState } from 'react';
import { GraphVisualization } from '../components/graph/GraphVisualization';
import { GraphControls } from '../components/graph/GraphControls';
import { GraphProvider } from '../context/GraphContext';
import { GraphAlgorithmDetails } from '../components/graph/GraphAlgorithmDetails';

export const GraphPage: React.FC = () => {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <GraphProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main visualization area with algo details below */}
          <div className="lg:col-span-3">
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-card dark:shadow-card-dark transition-colors duration-200">
              <div className="p-6 border-b border-border dark:border-border-dark">
                <h2 className="text-2xl font-bold text-text dark:text-text-dark">Graph Algorithm Visualization</h2>
              </div>
              <div className="p-6">
                <GraphVisualization />
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
              
              {showDetails && <GraphAlgorithmDetails />}
            </div>
          </div>
          
          {/* Control panel sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-card dark:shadow-card-dark p-6 transition-colors duration-200">
              <h3 className="text-xl font-bold text-text dark:text-text-dark mb-4">Controls</h3>
              <GraphControls />
            </div>
          </div>
        </div>
      </div>
    </GraphProvider>
  );
}; 