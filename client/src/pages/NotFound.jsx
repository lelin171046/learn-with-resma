import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <div className="container-custom text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mb-8"
          >
            <span className="text-[10rem] lg:text-[15rem] font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent leading-none select-none">
              404
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl lg:text-4xl font-bold mb-4"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 text-lg mb-8 max-w-md mx-auto"
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/" className="btn-primary flex items-center gap-2">
              <FiHome className="w-4 h-4" /> Go Home
            </Link>
            <Link to="/courses" className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center gap-2">
              <FiSearch className="w-4 h-4" /> Browse Courses
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-gray-400 text-sm"
          >
            <p>Need help? <Link to="/contact" className="text-primary-600 hover:underline">Contact Support</Link></p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
