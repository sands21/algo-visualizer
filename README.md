# Algorithm Visualizer

A web application built with React and TypeScript to visualize common sorting, searching, and graph algorithms interactively. See algorithms come to life step-by-step!

## Features

*   **Algorithm Visualization:** Understand how different algorithms work by watching them execute on sample data.
*   **Supported Algorithms:**
    *   **Sorting:** Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort
    *   **Searching:** Linear Search, Binary Search
    *   **Graph:** Breadth-First Search (BFS), Depth-First Search (DFS)
*   **Interactive Controls:**
    *   Generate new random data sets.
    *   Control execution: Play, Pause, Step Forward.
    *   Adjust visualization speed.
*   **Code Display:** See the corresponding code for the currently selected algorithm.
*   **Responsive Design:** Adapts to different screen sizes for usability on desktop and mobile devices.
*   **Dark Mode:** Switch between light and dark themes for comfortable viewing.

## Tech Stack

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** CSS Modules
*   **State Management:** React Context API

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js) or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
    *(Replace `<your-repository-url>` with the actual URL)*
2.  **Navigate to the project directory:**
    ```bash
    cd algo-visualizer
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
    *or*
    ```bash
    yarn install
    ```

### Running the Application

```bash
npm run dev
```
*or*
```bash
yarn dev
```

This will start the development server, typically at `http://localhost:5173`. Open this URL in your web browser.

## How to Use

1.  **Select an Algorithm:** Use the sidebar on the left to choose the algorithm category (Sorting, Searching, Graph) and then the specific algorithm you want to visualize.
2.  **Generate Data:** Click the "Generate New Array" (or similar) button in the Control Panel to create a dataset.
3.  **Control Visualization:**
    *   Use the **Play/Pause** button to start or stop the automatic execution.
    *   Use the **Step Forward** button to advance the algorithm one step at a time.
    *   Adjust the **Speed** slider to control how fast the visualization runs.
4.  **Observe:**
    *   Watch the **Visualization Area** to see the algorithm manipulate the data structure.
    *   Follow along with the highlighted lines in the **Code Panel** to see the corresponding code execution.

---

*(Optional: Add sections for Screenshots, Contributing Guidelines, or License information here if desired.)*
