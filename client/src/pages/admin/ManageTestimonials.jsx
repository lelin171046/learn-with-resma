import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCheck, FiTrash2, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageTestimonials() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => reviewService.getAll().then((d) => d.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => reviewService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial approved');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  if (isLoading) return <LoadingSpinner />;

  const reviews = data?.reviews || data || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Manage Testimonials</h1>
        <p className="text-gray-500 mt-1">{reviews.length} reviews as testimonials</p>
      </motion.div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">No testimonials yet</div>
        ) : reviews.map((review, i) => (
          <motion.div key={review._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                {review.user?.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{review.user?.name || 'Anonymous'}</span>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}</span>
                  {review.isFeatured && <FiStar className="w-3 h-3 text-yellow-500" fill="currentColor" />}
                  {review.isApproved !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{review.course?.title || ''}</p>
                {review.comment && <p className="text-sm mt-2 italic text-gray-600 dark:text-gray-300">"{review.comment}"</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!review.isApproved && (
                  <button onClick={() => approveMutation.mutate(review._id)} disabled={approveMutation.isPending} className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30" title="Approve">
                    <FiCheck className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => { if (window.confirm('Delete this testimonial?')) deleteMutation.mutate(review._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Delete">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
