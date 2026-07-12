import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlay, FiCheckCircle } from 'react-icons/fi';
import { courseService, progressService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ContinueLearning() {
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => courseService.getMyCourses().then((d) => d.data),
  });

  const courses = coursesData?.courses || [];

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['progress-batch', courses.map((c) => c._id).join(',')],
    queryFn: async () => {
      const results = await Promise.all(courses.map((c) => progressService.get(c._id).then((d) => d.data)));
      return results;
    },
    enabled: courses.length > 0,
  });

  if (coursesLoading || progressLoading) return <LoadingSpinner />;

  const incompleteCourses = courses
    .map((course, i) => {
      const progress = progressData?.[i]?.progress;
      const percentage = progress?.percentage || 0;
      const currentLesson = progress?.currentLesson;
      return { ...course, percentage, currentLesson, completedLessons: progress?.completedLessons?.length || 0 };
    })
    .filter((c) => c.percentage < 100);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Continue Learning</h1>
        <p className="text-gray-500 mt-1">Pick up where you left off</p>
      </motion.div>

      {incompleteCourses.length === 0 ? (
        <div className="card p-12 text-center">
          <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">All caught up!</p>
          <p className="text-sm text-gray-400">You've completed all your courses or have no courses in progress.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {incompleteCourses.map((course, i) => (
            <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <img src={course.thumbnail || 'https://placehold.co/160x100/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-full sm:w-40 h-24 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                  {course.currentLesson && (
                    <p className="text-sm text-gray-500 mb-2">Current: {course.currentLesson.title || 'Lesson'}</p>
                  )}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs text-gray-500">{course.completedLessons} of {course.totalLessons} lessons</span>
                    <span className="text-xs font-medium text-primary-600">{course.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4 max-w-md">
                    <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${course.percentage}%` }} />
                  </div>
                  <Link to={`/course/${course.slug}/learn`} className="btn-accent inline-flex items-center gap-2 text-sm">
                    <FiPlay className="w-4 h-4" /> Continue Learning
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
