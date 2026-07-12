import { useRouteError, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

const floatAnimation = {
  y: [0, -12, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
};

const bookAnimation = {
  rotate: [0, -6, 6, -6, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const status = error?.status || 404;
  const message = error?.statusText || error?.message || 'Page not found';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative inline-block mb-8">
          {/* floating books */}
          <motion.div animate={floatAnimation} className="absolute -top-6 -left-8 text-4xl select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
            📖
          </motion.div>
          <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 0.8 } }} className="absolute -top-4 -right-6 text-3xl select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
            ✏️
          </motion.div>
          <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 } }} className="absolute -bottom-4 right-0 text-2xl select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
            🎓
          </motion.div>

          {/* main error icon */}
          <motion.div animate={bookAnimation} className="relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center shadow-xl">
              <FiAlertTriangle className="w-16 h-16 text-primary-600 dark:text-primary-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* error code */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <span className="text-8xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            {status}
          </span>
        </motion.div>

        {/* message */}
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-4">
          Oops! Something went off the curriculum
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          {message}. Don't worry — even the best students stumble sometimes. Let's get you back on track.
        </motion.p>

        {/* buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 cursor-pointer">
            <FiHome className="w-4 h-4" />
            Back Home
          </button>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow cursor-pointer">
            <FiRefreshCw className="w-4 h-4" />
            Reload
          </button>
        </motion.div>
      </div>
    </div>
  );
}
