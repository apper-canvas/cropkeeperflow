import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const location = useLocation();
  
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const PlantIcon = getIcon('Sprout');
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-surface-50 dark:bg-surface-900">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm shadow-sm px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlantIcon className="h-6 w-6 text-primary" />
            <h1 className="text-lg md:text-xl font-bold text-primary dark:text-primary-light">
              CropKeeper
            </h1>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={darkMode ? 'dark' : 'light'}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? 
                  <SunIcon className="h-5 w-5 text-secondary" /> : 
                  <MoonIcon className="h-5 w-5 text-primary" />
                }
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <footer className="bg-surface-100 dark:bg-surface-800 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-surface-600 dark:text-surface-400">
          &copy; {new Date().getFullYear()} CropKeeper. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;