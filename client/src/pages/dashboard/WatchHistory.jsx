import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiClock, FiPlay } from 'react-icons/fi';
import { progressService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function WatchHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watch-history'],
    queryFn: () => progressService.getWatchHistory().then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load watch history.</div>;

  const history = data?.history || [];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Watch History</h1>
        <p className="text-gray-500 mt-1">{history.length} video{history.length !== 1 ? 's' : ''} watched</p>
      </motion.div>

      {history.length === 0 ? (
        <div className="card p-12 text-center">
          <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No watch history yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <motion.div key={item._id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-48 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.lessonTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPlay className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {item.watchedDuration && (
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {Math.floor(item.watchedDuration / 60)}:{String(item.watchedDuration % 60).padStart(2, '0')}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1 truncate">{item.lessonTitle || 'Untitled Lesson'}</h3>
                  {item.courseTitle && <p className="text-sm text-gray-500 mb-1">{item.courseTitle}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                    {item.watchedDuration && (
                      <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> Watched {Math.floor(item.watchedDuration / 60)}m</span>
                    )}
                    {item.lastWatched && (
                      <span>Last watched: {new Date(item.lastWatched).toLocaleDateString()}</span>
                    )}
                  </div>
                  {item.progress != null && (
                    <div className="mt-3 max-w-xs">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
