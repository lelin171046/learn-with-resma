import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { FiHome, FiBookOpen, FiClock, FiCheckCircle, FiFileText, FiAward, FiBarChart2, FiClock as FiHistory, FiUser, FiSettings, FiBell, FiHeart, FiUsers, FiGrid, FiFolder, FiVideo, FiClipboard, FiMessageSquare, FiEdit, FiStar, FiTrendingUp } from 'react-icons/fi';

const studentLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: FiHome },
  { name: 'My Courses', path: '/dashboard/my-courses', icon: FiBookOpen },
  { name: 'Continue Learning', path: '/dashboard/continue-learning', icon: FiClock },
  { name: 'Completed', path: '/dashboard/completed-courses', icon: FiCheckCircle },
  { name: 'Assignments', path: '/dashboard/assignments', icon: FiFileText },
  { name: 'Certificates', path: '/dashboard/certificates', icon: FiAward },
  { name: 'Quiz Results', path: '/dashboard/quiz-results', icon: FiBarChart2 },
  { name: 'Watch History', path: '/dashboard/watch-history', icon: FiHistory },
  { name: 'Wishlist', path: '/dashboard/wishlist', icon: FiHeart },
  { name: 'Notifications', path: '/dashboard/notifications', icon: FiBell },
  { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
  { name: 'Settings', path: '/dashboard/settings', icon: FiSettings },
];

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: FiHome },
  { name: 'Users', path: '/admin/users', icon: FiUsers },
  { name: 'Courses', path: '/admin/courses', icon: FiBookOpen },
  { name: 'Categories', path: '/admin/categories', icon: FiGrid },
  { name: 'Lessons', path: '/admin/lessons', icon: FiFolder },
  { name: 'Live Classes', path: '/admin/live-classes', icon: FiVideo },
  { name: 'Assignments', path: '/admin/assignments', icon: FiClipboard },
  { name: 'Quizzes', path: '/admin/quizzes', icon: FiFileText },
  { name: 'Certificates', path: '/admin/certificates', icon: FiAward },
  { name: 'Reviews', path: '/admin/reviews', icon: FiStar },
  { name: 'Comments', path: '/admin/comments', icon: FiMessageSquare },
  { name: 'Blog', path: '/admin/blog', icon: FiEdit },
  { name: 'Testimonials', path: '/admin/testimonials', icon: FiTrendingUp },
  { name: 'Settings', path: '/admin/settings', icon: FiSettings },
];

export default function DashboardLayout({ isAdmin }) {
  const location = useLocation();
  const { user } = useAuth();
  const links = isAdmin ? adminLinks : studentLinks;
  const basePath = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">L</div>
            <span className="font-bold text-sm">{isAdmin ? 'Admin Panel' : 'My Dashboard'}</span>
          </Link>
        </div>
        <nav className="px-3 pb-6">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.path === basePath ? location.pathname === basePath : location.pathname.startsWith(link.path);
            return (
              <Link key={link.path} to={link.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-h-screen">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-semibold">{isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}</h1>
          <div className="flex items-center gap-4">
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="text-sm text-primary-600 hover:underline">View Site</Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-medium text-sm">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
