import React from 'react';
import { useAppContext } from '../context/AppContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import styles from './Header.module.css'; // Import the CSS module

const Header: React.FC = () => {
  const { state, toggleTheme } = useAppContext();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoArea}>
          <div className={styles.logoIconContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.logoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className={styles.title}>Algorithm Visualizer</h1>
        </div>

        {/* Theme toggle button */}
        <button
            onClick={toggleTheme}
            className={styles.themeToggleButton}
            aria-label="Toggle theme"
          >
          <div className={styles.themeIconContainer}>
            {state.theme === 'light' ? (
              <MoonIcon className={`${styles.themeIcon} ${styles.moonIcon}`} />
            ) : (
              <SunIcon className={`${styles.themeIcon} ${styles.sunIcon}`} />
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
