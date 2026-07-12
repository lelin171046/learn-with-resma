import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiSend } from 'react-icons/fi';
import { assignmentService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const statusConfig = {
  pending: { label: 'Pending', icon: FiClock, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  submitted: { label: 'Submitted', icon: FiSend, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  reviewed: { label: 'Reviewed', icon: FiFileText, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  approved: { label: 'Approved', icon: FiCheckCircle, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  rejected: { label: 'Rejected', icon: FiXCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function DashboardAssignments() {
  const [filter, setFilter] = useState('all');
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-assignments'],
    queryFn: () => assignmentService.getMy().then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load assignments.</div>;

  const assignments = data?.assignments || [];
  const filtered = filter === 'all' ? assignments : assignments.filter((a) => a.status === filter);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-gray-500 mt-1">View and manage your assignments</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'submitted', 'reviewed', 'approved', 'rejected'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No assignments found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((assignment, i) => {
            const config = statusConfig[assignment.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            return (
              <motion.div key={assignment._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{assignment.description || 'No description'}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {assignment.course?.title && <span>Course: {assignment.course.title}</span>}
                      {assignment.dueDate && <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} flex-shrink-0`}>
                    <StatusIcon className="w-3 h-3" /> {config.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
