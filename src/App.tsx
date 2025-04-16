import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VisualizationArea from './components/VisualizationArea';
import ControlPanel from './components/ControlPanel';
import CodePanel from './components/CodePanel';
import styles from './App.module.css'; 

function App() {
  return (
    // Apply CSS module class for the main container
    <div className={styles.appContainer}>
      <Header />

      {/* Apply CSS module class for the main layout flex container */}
      <div className={styles.mainLayout}>
        <Sidebar />

        {/* Main Content Area */}
        {/* Apply CSS module class for the main content area */}
        <main className={styles.mainContent}>
          {/* Visualization Area */}
          <VisualizationArea />

          {/* Control Panel & Code Panel */}
          {/* Apply CSS module class for the panels grid container */}
          <div className={styles.panelsContainer}>
            <ControlPanel />
            <CodePanel />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
