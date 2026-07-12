import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCheck, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { commentService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageComments() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: () => commentService.getAll().then((d) => d.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => commentService.toggleApproval(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Comment status updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => commentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Comment deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  if (isLoading) return <LoadingSpinner />;

  const comments = data?.comments || data || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Manage Comments</h1>
        <p className="text-gray-500 mt-1">{comments.length} total comments</p>
      </motion.div>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <FiMessageSquare className="w-12 h-12 mx-auto mb-4" />
            <p>No comments yet</p>
          </div>
        ) : comments.map((comment, i) => (
          <motion.div key={comment._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{comment.user?.name || 'Anonymous'}</span>
                  {comment.lesson && <span className="text-xs text-gray-400">on {comment.lesson.title || 'a lesson'}</span>}
                  {comment.isApproved !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${comment.isApproved ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {comment.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  )}
                </div>
                <p className="text-sm mt-1">{comment.text || comment.content}</p>
                <span className="text-xs text-gray-400 mt-2 block">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => approveMutation.mutate(comment._id)} disabled={approveMutation.isPending} className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30" title="Toggle Approval">
                  <FiCheck className="w-4 h-4" />
                </button>
                <button onClick={() => { if (window.confirm('Delete this comment?')) deleteMutation.mutate(comment._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Delete">
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
