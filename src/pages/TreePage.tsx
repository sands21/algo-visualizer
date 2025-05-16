import React from 'react';
import { TreeProvider } from '../context/TreeContext';
import { TreeVisualization } from '../components/tree/TreeVisualization';
import { TreeControls } from '../components/tree/TreeControls';
import { TreeAlgorithmDetails } from '../components/tree/TreeAlgorithmDetails';

export const TreePage: React.FC = () => {
  return (
    <TreeProvider>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6 text-text dark:text-text-dark">Tree Algorithm Visualizer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <TreeVisualization />
          </div>
          
          {/* Controls and Details */}
          <div className="space-y-6">
            <TreeControls />
            <TreeAlgorithmDetails />
          </div>
        </div>
      </div>
    </TreeProvider>
  );
}; 