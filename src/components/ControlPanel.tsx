import React, { useState, useEffect } from 'react'; // Added useEffect
import { useAppContext } from '../context/AppContext';
import styles from './ControlPanel.module.css';

// Define props if needed, otherwise use React.FC
const Controls: React.FC = () => {
  const { state, start, pause, setCurrentStep, setAnimationSpeed, setUserGraph, setUserArray, setUserTarget, runAlgorithm } = useAppContext(); // Added setUserArray, setUserTarget, runAlgorithm

  // Input states
  const [graphInput, setGraphInput] = useState('');
  const [arrayInput, setArrayInput] = useState(''); // State for array input
  const [targetInput, setTargetInput] = useState(''); // State for target input

  const [inputError, setInputError] = useState<string | null>(null);

  // Determine algorithm type based on selectedAlgorithm key
  const getAlgorithmType = (algoKey: string | null): 'sorting' | 'searching' | 'graph' | null => {
    if (!algoKey) return null;
    if (algoKey.includes('Sort')) return 'sorting';
    if (algoKey.includes('Search')) return 'searching';
    if (algoKey === 'bfs' || algoKey === 'dfs') return 'graph';
    return null;
  };

  const algorithmType = getAlgorithmType(state.selectedAlgorithm);

  // Clear inputs when algorithm changes
  useEffect(() => {
    setGraphInput('');
    setArrayInput('');
    setTargetInput('');
    setInputError(null);
  }, [state.selectedAlgorithm]);


  // --- Input Handlers ---
  const handleGraphChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGraphInput(e.target.value);
    setInputError(null);
  };
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Changed to input
    setArrayInput(e.target.value);
    setInputError(null);
  };
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetInput(e.target.value);
    setInputError(null);
  };

  // --- Apply Input Logic ---
  const handleApplyInput = () => {
    setInputError(null);
    let newArray: number[] | null = null;
    let newTarget: number | null = null;
    let newGraph: Record<number, number[]> | null = null;
    let errorFound = false;

    // --- Parse Array Input (for sorting/searching) ---
    if (algorithmType === 'sorting' || algorithmType === 'searching') {
      if (arrayInput.trim()) {
        try {
          const parsed = arrayInput.split(',').map(numStr => {
            const num = parseInt(numStr.trim(), 10);
            if (isNaN(num)) {
              throw new Error('Invalid number found in array input.');
            }
            return num;
          });
          if (parsed.length === 0) {
             throw new Error('Array input cannot be empty if provided.');
          }
          newArray = parsed;
        } catch (error) {
          setInputError(error instanceof Error ? error.message : 'Invalid array format. Use comma-separated numbers.');
          errorFound = true;
        }
      } else {
        newArray = null; // Signal to use default
      }
    }

    // --- Parse Target Input (for searching) ---
    if (algorithmType === 'searching' && !errorFound) {
       if (targetInput.trim()) {
         try {
           const parsed = parseInt(targetInput.trim(), 10);
           if (isNaN(parsed)) {
             throw new Error('Invalid target number.');
           }
           newTarget = parsed;
         } catch (error) {
           setInputError(error instanceof Error ? error.message : 'Invalid target format. Use a single number.');
           errorFound = true;
         }
       } else {
         newTarget = null; // Signal to use default
       }
    }

    // --- Parse Graph Input (for graph) ---
     if (algorithmType === 'graph' && !errorFound) {
       if (graphInput.trim()) {
         try {
           const parsedGraph: Record<number, number[]> = {};
           const lines = graphInput.trim().split(';');
           for (const line of lines) {
             if (!line.trim()) continue;
             const parts = line.split(':');
             if (parts.length !== 2) throw new Error('Invalid graph line format (use node:neighbor1,neighbor2;).');
             const node = parseInt(parts[0].trim(), 10);
             if (isNaN(node)) throw new Error('Invalid node number in graph input.');
             const neighbors = parts[1].trim() === '' ? [] : parts[1].trim().split(',').map(n => { // Handle empty neighbors
               const num = parseInt(n.trim(), 10);
               if (isNaN(num)) throw new Error('Invalid neighbor number in graph input.');
               return num;
             });
             parsedGraph[node] = neighbors;
           }
           if (Object.keys(parsedGraph).length === 0) {
              throw new Error('Graph input cannot be empty if provided.');
           }
           newGraph = parsedGraph;
         } catch (error) {
           setInputError(error instanceof Error ? error.message : 'Invalid graph format.');
           errorFound = true;
         }
       } else {
         newGraph = null; // Signal to use default
       }
     }

    // --- Update Context and Re-run Algorithm ---
    if (!errorFound && state.selectedAlgorithm) {
      // Update context state only if parsing was successful or input was empty
      if (algorithmType === 'sorting' || algorithmType === 'searching') {
        setUserArray(newArray); // Pass null if empty/default
      }
      if (algorithmType === 'searching') {
        setUserTarget(newTarget); // Pass null if empty/default
      }
      if (algorithmType === 'graph') {
        setUserGraph(newGraph); // Pass null if empty/default
      }

      // Re-run the algorithm with potentially new data (or defaults if null was passed)
      runAlgorithm(state.selectedAlgorithm);
    }
  };

  // --- Playback Handlers (remain the same) ---
  const handleStepBack = () => { if (state.currentStep > 0) setCurrentStep(state.currentStep - 1); };
  const handlePlayPause = () => { if (state.isPlaying) pause(); else start(); };
  const handleStep = () => { if (state.currentStep < state.steps.length - 1) setCurrentStep(state.currentStep + 1); };
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => { setAnimationSpeed(Number(e.target.value)); };

  // --- Disable Logic (remains the same) ---
  const isDisabled = state.isPlaying;
  const isStepBackDisabled = isDisabled || state.currentStep === 0;
  const isStepForwardDisabled = isDisabled || state.currentStep >= state.steps.length - 1;
  const showApplyButton = algorithmType !== null; // Show apply button if an algorithm is selected

  return (
    <section className={styles.controlPanel}>
      {/* Playback Controls */}
      <div className={styles.playbackControls}>
        {/* ... buttons remain the same ... */}
         <button onClick={handleStepBack} disabled={isStepBackDisabled} className={styles.stepButton}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>
        <button onClick={handlePlayPause} className={styles.playPauseButton}>
          {state.isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
          )}
        </button>
        <button onClick={handleStep} disabled={isStepForwardDisabled} className={styles.stepButton}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Speed Control */}
      <div className={styles.controlGroup}>
        {/* ... speed control remains the same ... */}
         <label htmlFor="speed-control" className={styles.label}>
          Animation Speed
        </label>
        <input
          id="speed-control"
          type="range"
          min="1"
          max="10"
          value={state.animationSpeed}
          onChange={handleSpeedChange}
          className={styles.speedSlider}
          disabled={isDisabled}
        />
        <div className={styles.speedDisplay}>Speed: {state.animationSpeed}</div>
      </div>

      {/* --- Conditional Input Sections --- */}

      {/* Array Input (Sorting/Searching) */}
      {(algorithmType === 'sorting' || algorithmType === 'searching') && (
        <div className={styles.controlGroup}>
          <label htmlFor="array-input" className={styles.label}>
            Input Array <span className={styles.labelHint}>(comma-separated numbers)</span>
          </label>
          <input
            id="array-input"
            type="text" // Use text for easier comma input
            className={`${styles.textArea} ${inputError && arrayInput.trim() ? styles.textAreaError : ''}`} // Apply error style only if there's an error *and* input
            placeholder="e.g., 5, 2, 9, 1, 6 (uses default if empty)"
            value={arrayInput}
            onChange={handleArrayChange}
            disabled={isDisabled}
          />
        </div>
      )}

      {/* Target Input (Searching Only) */}
      {algorithmType === 'searching' && (
        <div className={styles.controlGroup}>
          <label htmlFor="target-input" className={styles.label}>
            Target Number
          </label>
          <input
            id="target-input"
            type="number" // Use number type for target
            className={`${styles.textArea} ${inputError && targetInput.trim() ? styles.textAreaError : ''}`} // Apply error style only if there's an error *and* input
            placeholder="e.g., 6 (uses default if empty)"
            value={targetInput}
            onChange={handleTargetChange}
            disabled={isDisabled}
            style={{ height: 'auto', resize: 'none' }} // Adjust style for single line input
          />
        </div>
      )}

      {/* Graph Input (Graph Only) */}
      {algorithmType === 'graph' && (
        <div className={styles.controlGroup}>
          <label htmlFor="graph-input" className={styles.label}>
            Graph Input <span className={styles.labelHint}>(adjacency list)</span>
          </label>
          <textarea
            id="graph-input"
            rows={3}
            className={`${styles.textArea} ${inputError && graphInput.trim() ? styles.textAreaError : ''}`} // Apply error style only if there's an error *and* input
            placeholder="e.g., 0:1,2; 1:0,3; 2:0,4; 3:1; 4:2 (uses default if empty)"
            value={graphInput}
            onChange={handleGraphChange}
            disabled={isDisabled}
          ></textarea>
        </div>
      )}

      {/* Apply Input Button (Show only if an algorithm is selected) */}
      {showApplyButton && (
        <button
          className={`${styles.applyButton} ${isDisabled ? styles.applyButtonDisabled : styles.applyButtonEnabled}`}
          onClick={handleApplyInput}
          disabled={isDisabled}
        >
          Apply Input & Run
        </button>
      )}

      {/* Error Display */}
      {inputError && (
        <div className={styles.errorDisplay}>
          {inputError}
        </div>
      )}
    </section>
  );
};

export default Controls;
