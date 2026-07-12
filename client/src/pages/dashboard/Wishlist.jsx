import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';
import { courseService, userService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function Wishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const wishlistIds = user?.wishlist || [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['wishlist-courses', wishlistIds.join(',')],
    queryFn: async () => {
      if (wishlistIds.length === 0) return { courses: [] };
      const results = await Promise.all(wishlistIds.map((id) => courseService.getById(id).then((d) => d.data.course)));
      return { courses: results.filter(Boolean) };
    },
    enabled: wishlistIds.length > 0,
  });

  const removeMutation = useMutation({
    mutationFn: (courseId) => userService.toggleWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Removed from wishlist');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load wishlist.</div>;

  const courses = data?.courses || [];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} saved</p>
      </motion.div>

      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <FiHeart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/courses" className="btn-accent">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card group">
              <div className="relative h-48 overflow-hidden">
                <img src={course.thumbnail || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button onClick={() => removeMutation.mutate(course._id)} disabled={removeMutation.isPending} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="Remove from wishlist">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>{course.totalLessons} lessons</span>
                  <span>{course.totalStudents} students</span>
                  <span className="flex items-center gap-1"><FiStar className="w-3 h-3 text-accent" />{course.rating?.toFixed(1) || 'New'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={course.isFree ? 'badge-free' : 'badge-paid'}>{course.isFree ? 'Free' : `$${course.price}`}</span>
                  <Link to={`/course/${course.slug}`} className="text-sm text-primary-600 hover:underline">View Course</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
