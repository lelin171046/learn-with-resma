import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCheckCircle, FiAward, FiBarChart2, FiClock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthProvider';
import { dashboardService, courseService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function DashboardHome() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['student-stats'],
    queryFn: () => dashboardService.getStudentStats().then((d) => d.data),
  });
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseService.getMyCourses().then((d) => d.data),
  });

  if (statsLoading || coursesLoading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Enrolled Courses', value: stats?.enrolledCourses ?? 0, icon: FiBookOpen, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
    { label: 'Completed', value: stats?.completedCourses ?? 0, icon: FiCheckCircle, color: 'bg-green-50 text-green-600 dark:bg-green-900/20' },
    { label: 'Certificates', value: stats?.certificates ?? 0, icon: FiAward, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20' },
    { label: 'Quiz Results', value: stats?.quizResults ?? 0, icon: FiBarChart2, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your learning progress</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Enrolled Courses</h2>
              <Link to="/dashboard/my-courses" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View All <FiArrowRight className="w-3 h-3" /></Link>
            </div>
            {coursesData?.courses?.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">You haven't enrolled in any courses yet.</p>
            ) : (
              <div className="space-y-3">
                {coursesData?.courses?.slice(0, 5).map((course) => (
                  <Link key={course._id} to={`/course/${course.slug}/learn`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <img src={course.thumbnail || 'https://placehold.co/80x60/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{course.title}</h4>
                      <p className="text-xs text-gray-500">{course.totalLessons} lessons</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { to: '/courses', label: 'Browse Courses', icon: FiBookOpen },
                { to: '/dashboard/continue-learning', label: 'Continue Learning', icon: FiClock },
                { to: '/dashboard/certificates', label: 'View Certificates', icon: FiAward },
                { to: '/dashboard/quiz-results', label: 'Quiz Results', icon: FiBarChart2 },
              ].map((action) => (
                <Link key={action.to} to={action.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{action.label}</span>
                  <FiArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-primary-600 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
