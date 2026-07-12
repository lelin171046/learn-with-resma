import { Component } from 'react';
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

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center max-w-md">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative inline-block mb-8">
              <motion.div animate={floatAnimation} className="absolute -top-6 -left-8 text-4xl select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
                📖
              </motion.div>
              <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 0.8 } }} className="absolute -top-4 -right-6 text-3xl select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
                ✏️
              </motion.div>
              <motion.div animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 } }} className="absolute -bottom-4 right-0 text-2xl select-none" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
                🎓
              </motion.div>
              <motion.div animate={bookAnimation} className="relative">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center shadow-xl">
                  <FiAlertTriangle className="w-16 h-16 text-red-500 dark:text-red-400" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <span className="text-7xl font-black bg-gradient-to-r from-red-500 to-accent-500 bg-clip-text text-transparent">
                Oops!
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-4">
              The lesson hit an unexpected bump
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {this.state.error?.message || 'Something went wrong while rendering this page.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-center gap-4 mt-8">
              <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25 cursor-pointer">
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

    return this.props.children;
  }
}
