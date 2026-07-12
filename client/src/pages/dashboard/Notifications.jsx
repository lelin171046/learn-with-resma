import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiBell, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { notificationService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: () => notificationService.getMy().then((d) => d.data),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationService.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load notifications.</div>;

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            <FiCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </motion.div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div key={notif._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className={`card p-4 flex items-start gap-4 ${!notif.read ? 'border-l-4 border-primary-500' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!notif.read ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                <FiBell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm ${!notif.read ? 'font-bold' : ''}`}>{notif.title || 'Notification'}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
              </div>
              {!notif.read && (
                <button onClick={() => markReadMutation.mutate(notif._id)} disabled={markReadMutation.isPending} className="text-xs text-primary-600 hover:underline flex items-center gap-1 flex-shrink-0 mt-1">
                  <FiCheck className="w-3 h-3" /> Read
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
