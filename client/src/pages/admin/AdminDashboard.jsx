import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { dashboardService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => dashboardService.getAdminStats().then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: FiUsers, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: FiTrendingUp, color: 'bg-green-50 text-green-600 dark:bg-green-900/20' },
    { label: 'Total Courses', value: stats?.totalCourses ?? 0, icon: FiBookOpen, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' },
    { label: 'Revenue', value: `$${(stats?.revenue ?? 0).toLocaleString()}`, icon: FiDollarSign, color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20' },
  ];

  const monthlyRevenue = stats?.monthlyRevenue || [];
  const courseCompletion = stats?.courseCompletion || [];
  const popularCourses = stats?.popularCourses || [];
  const recentUsers = stats?.recentUsers || [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform</p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <h2 className="text-lg font-bold mb-4">Monthly Revenue</h2>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No revenue data yet</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
          <h2 className="text-lg font-bold mb-4">Course Completion</h2>
          {courseCompletion.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={courseCompletion} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {courseCompletion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">No completion data yet</p>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
          <h2 className="text-lg font-bold mb-4">Popular Courses</h2>
          {popularCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                    <th className="pb-3 font-medium">Course</th>
                    <th className="pb-3 font-medium">Enrollments</th>
                    <th className="pb-3 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {popularCourses.map((course) => (
                    <tr key={course._id} className="border-b dark:border-gray-700/50 last:border-0">
                      <td className="py-3 font-medium">{course.title}</td>
                      <td className="py-3 text-gray-500">{course.enrollments ?? 0}</td>
                      <td className="py-3 text-gray-500">⭐ {course.rating ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No courses yet</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-6">
          <h2 className="text-lg font-bold mb-4">Recent Users</h2>
          {recentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b dark:border-gray-700">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user._id} className="border-b dark:border-gray-700/50 last:border-0">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-gray-500">{user.email}</td>
                      <td className="py-3">
                        <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full capitalize">{user.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No users yet</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
