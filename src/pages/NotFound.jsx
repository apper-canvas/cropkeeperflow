import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6"
      >
        <AlertTriangleIcon className="w-10 h-10 text-orange-500" />
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-surface-800 dark:text-surface-200">
        Page Not Found
      </h1>
      
      <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md">
        We couldn't find the page you're looking for. The page might have been moved or doesn't exist.
      </p>
      
      <Link 
        to="/"
        className="btn btn-primary flex items-center gap-2"
      >
        <HomeIcon className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div className="mt-8 border-t border-surface-200 dark:border-surface-700 pt-8 w-full max-w-md">
        <p className="text-sm text-surface-500 dark:text-surface-500">
          Looking for help? Contact support at support@cropkeeper.com
        </p>
      </div>
    </motion.div>
  );
}

export default NotFound;