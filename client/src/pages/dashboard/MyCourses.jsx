import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlay, FiClock } from 'react-icons/fi';
import { courseService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function MyCourses() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseService.getMyCourses().then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load courses.</div>;

  const courses = data?.courses || [];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} enrolled</p>
      </motion.div>

      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-accent">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="card group">
                <div className="relative h-48 overflow-hidden">
                  <img src={course.thumbnail || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {course.duration || 'Self-paced'}</span>
                    <span>{course.totalLessons} lessons</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${course.progress || 0}%` }} />
                    </div>
                  </div>
                  <Link to={`/course/${course.slug}/learn`} className="btn-accent w-full flex items-center justify-center gap-2">
                    <FiPlay className="w-4 h-4" /> Continue
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
