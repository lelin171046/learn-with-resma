import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiFilter, FiCheckCircle, FiXCircle, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { assignmentService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const statusConfig = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  reviewed: { label: 'Reviewed', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function ManageAssignments() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: 'reviewed', marks: '', feedback: '' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-assignments'],
    queryFn: () => assignmentService.getAll().then((d) => d.data),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, ...formData }) => assignmentService.updateStatus(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-assignments'] });
      toast.success('Assignment reviewed');
      setReviewingId(null);
      setReviewForm({ status: 'reviewed', marks: '', feedback: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to review'),
  });

  if (isLoading) return <LoadingSpinner />;

  const assignments = data?.assignments || data || [];
  const filtered = statusFilter === 'all' ? assignments : assignments.filter((a) => a.status === statusFilter);

  const handleReview = (e) => {
    e.preventDefault();
    reviewMutation.mutate({ id: reviewingId, status: reviewForm.status, marks: reviewForm.marks ? Number(reviewForm.marks) : undefined, feedback: reviewForm.feedback });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Manage Assignments</h1>
        <p className="text-gray-500 mt-1">{assignments.length} total assignments</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2">
        {['all', 'submitted', 'reviewed', 'approved', 'rejected'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </motion.div>

      {reviewingId && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h2 className="text-lg font-bold mb-4">Review Assignment</h2>
          <form onSubmit={handleReview} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={reviewForm.status} onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })} className="input-field">
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input type="number" value={reviewForm.marks} onChange={(e) => setReviewForm({ ...reviewForm, marks: e.target.value })} className="input-field" placeholder="0-100" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Feedback</label>
              <textarea value={reviewForm.feedback} onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })} rows={3} className="input-field" placeholder="Add feedback..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={reviewMutation.isPending} className="btn-accent">{reviewMutation.isPending ? 'Saving...' : 'Submit Review'}</button>
              <button type="button" onClick={() => setReviewingId(null)} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Marks</th>
                <th className="p-4 font-medium">Submitted</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No assignments found</td></tr>
              ) : filtered.map((a) => {
                const cfg = statusConfig[a.status] || { label: a.status, color: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={a._id} className="border-b dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4 font-medium">{a.user?.name || a.student?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-500">{a.course?.title || 'N/A'}</td>
                    <td className="p-4"><span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span></td>
                    <td className="p-4 text-gray-500">{a.marks ?? '-'}</td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button onClick={() => { setReviewingId(a._id); setReviewForm({ status: 'reviewed', marks: a.marks || '', feedback: a.feedback || '' }); }} className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30">
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
