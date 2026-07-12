import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiAward, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { progressService, certificateService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function CompletedCourses() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['completed-courses'],
    queryFn: () => progressService.getCompleted().then((d) => d.data),
  });

  const certMutation = useMutation({
    mutationFn: (courseId) => certificateService.generate(courseId).then((d) => d.data),
    onSuccess: () => {
      toast.success('Certificate generated!');
      queryClient.invalidateQueries({ queryKey: ['completed-courses'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to generate certificate'),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load completed courses.</div>;

  const courses = data?.courses || [];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Completed Courses</h1>
        <p className="text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} completed</p>
      </motion.div>

      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <FiCheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No completed courses yet. Keep learning!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div key={course._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
              <div className="relative h-48 overflow-hidden">
                <img src={course.thumbnail || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">Completed on {new Date(course.completedAt || Date.now()).toLocaleDateString()}</p>
                {course.hasCertificate ? (
                  <button disabled className="w-full py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm font-medium flex items-center justify-center gap-2">
                    <FiAward className="w-4 h-4" /> Certificate Issued
                  </button>
                ) : (
                  <button onClick={() => certMutation.mutate(course._id)} disabled={certMutation.isPending} className="btn-accent w-full flex items-center justify-center gap-2 text-sm">
                    <FiAward className="w-4 h-4" /> {certMutation.isPending ? 'Generating...' : 'Generate Certificate'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
