import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

function Home() {
  const [stats, setStats] = useState({
    farms: 0,
    crops: 0,
    tasks: 0,
    expenses: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Icons
  const FarmIcon = getIcon('Warehouse');
  const CropIcon = getIcon('Sprout');
  const TaskIcon = getIcon('ListTodo');
  const ExpenseIcon = getIcon('Receipt');
  const WeatherIcon = getIcon('Cloud');
  
  useEffect(() => {
    // Simulate loading data from storage
    const timer = setTimeout(() => {
      // Get data from localStorage if it exists
      const storedStats = localStorage.getItem('cropkeeper_stats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update local storage when stats change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cropkeeper_stats', JSON.stringify(stats));
    }
  }, [stats, isLoading]);
  
  const updateStats = (newStats) => {
    setStats(prev => {
      const updated = {...prev, ...newStats};
      return updated;
    });
  };
  
  // Data for the weather forecast display
  const weatherForecast = [
    { day: 'Today', temp: '22°C', condition: 'Sunny', icon: 'SunMedium' },
    { day: 'Tomorrow', temp: '20°C', condition: 'Partly Cloudy', icon: 'CloudSun' },
    { day: 'Wed', temp: '18°C', condition: 'Rain', icon: 'CloudRain' },
    { day: 'Thu', temp: '19°C', condition: 'Cloudy', icon: 'Cloud' },
    { day: 'Fri', temp: '21°C', condition: 'Sunny', icon: 'SunMedium' },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-light">
          Farm Dashboard
        </h1>
        <p className="mt-2 text-surface-600 dark:text-surface-400">
          Manage your farms, crops, tasks, and expenses all in one place.
        </p>
      </section>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full"
          />
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              className="card p-4 flex items-center gap-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <FarmIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Farms</p>
                <h3 className="text-2xl font-bold">{stats.farms}</h3>
              </div>
            </motion.div>
            
            <motion.div 
              className="card p-4 flex items-center gap-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <CropIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Crops</p>
                <h3 className="text-2xl font-bold">{stats.crops}</h3>
              </div>
            </motion.div>
            
            <motion.div 
              className="card p-4 flex items-center gap-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <TaskIcon className="h-6 w-6 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Tasks</p>
                <h3 className="text-2xl font-bold">{stats.tasks}</h3>
              </div>
            </motion.div>
            
            <motion.div 
              className="card p-4 flex items-center gap-4"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <ExpenseIcon className="h-6 w-6 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Expenses</p>
                <h3 className="text-2xl font-bold">${stats.expenses || 0}</h3>
              </div>
            </motion.div>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MainFeature onUpdate={updateStats} />
            </div>
            
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <WeatherIcon className="h-5 w-5 text-blue-500" />
                  Weather Forecast
                </h3>
              </div>
              
              <div className="space-y-3">
                {weatherForecast.map((day, index) => {
                  const WeatherDayIcon = getIcon(day.icon);
                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                      <div className="font-medium">{day.day}</div>
                      <div className="flex items-center gap-2">
                        <WeatherDayIcon className="h-4 w-4 text-blue-500" />
                        <span>{day.temp}</span>
                      </div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">{day.condition}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 text-center text-sm text-surface-500 dark:text-surface-400">
                <p>Data refreshed 32 minutes ago</p>
                <button className="mt-2 text-primary dark:text-primary-light font-medium hover:underline">
                  Refresh Weather
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Home;