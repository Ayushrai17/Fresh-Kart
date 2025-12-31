import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <AlertCircle className="w-16 h-16 text-emerald-600" />
        </motion.div>
        <h1 className="text-9xl font-bold text-emerald-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Home className="w-5 h-5" />
          <span>Go Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
