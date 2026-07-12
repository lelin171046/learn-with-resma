import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FiSearch, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import SearchModal from './SearchModal';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'IELTS', path: '/ielts-program' },
  { name: 'Speaking', path: '/english-speaking' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-secondary/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">L</div>
            <span className="text-xl font-bold hidden sm:block">
              Learn With <span className="text-primary-600">Resma</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'}`}>
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" /> : <FiUser className="w-5 h-5" />}
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Get Started</Link>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {open ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="container-custom py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink key={link.path} to={link.path} onClick={() => setOpen(false)} className={({ isActive }) => `px-4 py-3 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {link.name}
                  </NavLink>
                ))}
                {user ? (
                  <>
                    <Link to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Dashboard</Link>
                    <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Login</Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center">Get Started</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
