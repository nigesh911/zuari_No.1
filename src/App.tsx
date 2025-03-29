import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Game from './components/Game';
import Dashboard from './components/Dashboard';

function App() {
  // Handle fake reload functionality
  useEffect(() => {
    // Intercept reload events
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Store current scroll position
      localStorage.setItem('scrollPosition', window.scrollY.toString());
      
      // Cancel the event to show confirmation dialog
      e.preventDefault();
      e.returnValue = '';
      
      // Simulate reload animation with a small timeout
      setTimeout(() => {
        // Restore scroll position
        const scrollPosition = parseInt(localStorage.getItem('scrollPosition') || '0');
        window.scrollTo(0, scrollPosition);
        
        // Remove loading class if we added one
        document.body.classList.remove('reloading');
      }, 500);
      
      return '';
    };

    // Override F5 and Ctrl+R behavior
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        simulateReload();
      }
    };

    // Function to simulate reload
    const simulateReload = () => {
      // Save scroll position
      localStorage.setItem('scrollPosition', window.scrollY.toString());
      
      // Add a class to body to show reload animation if desired
      document.body.classList.add('reloading');
      
      // Small timeout to simulate reload
      setTimeout(() => {
        document.body.classList.remove('reloading');
        
        // Restore scroll position
        const scrollPosition = parseInt(localStorage.getItem('scrollPosition') || '0');
        window.scrollTo(0, scrollPosition);
      }, 500);
    };

    // Handle fake reload event from the script in index.html
    const handleFakeReload = () => {
      simulateReload();
    };

    // Override right-click context menu for reload option
    const handleContextMenu = (e: MouseEvent) => {
      // Let the default menu appear but intercept any reload action
      // We can't easily modify the context menu, but we can intercept reload
    };
    
    // Create a proxy for the window object to intercept reload calls
    const handleClick = (e: MouseEvent) => {
      // Check if the click is on a refresh button (browser-specific, not fully reliable)
      // This is a best-effort approach as we can't directly detect refresh button clicks
      const target = e.target as HTMLElement;
      if (target.closest('button[title*="Reload"], button[aria-label*="Reload"]')) {
        e.preventDefault();
        e.stopPropagation();
        simulateReload();
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fakereload', handleFakeReload);
    document.addEventListener('click', handleClick, true);

    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fakereload', handleFakeReload);
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <Router>
      <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-900">
        <main className="w-full h-full max-h-screen px-4 py-4">
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
