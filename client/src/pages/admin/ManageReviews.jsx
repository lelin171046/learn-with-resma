import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageReviews() {
  const [tab, setTab] = useState('pending');
  const queryClient = useQueryClient();

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['admin-reviews-pending'],
    queryFn: () => reviewService.getPending().then((d) => d.data),
  });

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['admin-reviews-all'],
    queryFn: () => reviewService.getAll().then((d) => d.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => reviewService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-all'] });
      toast.success('Review approved');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to approve'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-all'] });
      toast.success('Review deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  if (pendingLoading || allLoading) return <LoadingSpinner />;

  const pendingReviews = pendingData?.reviews || pendingData || [];
  const allReviews = allData?.reviews || allData || [];
  const reviews = tab === 'pending' ? pendingReviews : allReviews;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Manage Reviews</h1>
        <p className="text-gray-500 mt-1">{pendingReviews.length} pending, {allReviews.length} total</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2">
        <button onClick={() => setTab('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          Pending ({pendingReviews.length})
        </button>
        <button onClick={() => setTab('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          All Reviews ({allReviews.length})
        </button>
      </motion.div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">No reviews to show</div>
        ) : reviews.map((review, i) => (
          <motion.div key={review._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{review.user?.name || 'Anonymous'}</span>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}</span>
                </div>
                <p className="text-sm text-gray-500">{review.course?.title || 'N/A'}</p>
                {review.comment && <p className="text-sm mt-2">{review.comment}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  {review.isApproved !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full ${review.isApproved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {tab === 'pending' && (
                  <button onClick={() => approveMutation.mutate(review._id)} disabled={approveMutation.isPending} className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30" title="Approve">
                    <FiCheck className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => { if (window.confirm('Delete this review?')) deleteMutation.mutate(review._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Delete">
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
