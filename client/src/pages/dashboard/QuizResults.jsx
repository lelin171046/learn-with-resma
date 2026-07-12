import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiBarChart2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { progressService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function QuizResults() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['completed-courses'],
    queryFn: () => progressService.getCompleted().then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load quiz results.</div>;

  const allResults = (data?.courses || []).flatMap((c) =>
    (c.quizResults || []).map((q) => ({ ...q, courseTitle: c.title, courseThumbnail: c.thumbnail }))
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Quiz Results</h1>
        <p className="text-gray-500 mt-1">{allResults.length} quiz result{allResults.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {allResults.length === 0 ? (
        <div className="card p-12 text-center">
          <FiBarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No quiz results yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allResults.map((result, i) => {
            const passed = result.passed ?? result.score >= 60;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {result.courseThumbnail && <img src={result.courseThumbnail} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0 hidden sm:block" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1">{result.quizTitle || result.quizName || 'Quiz'}</h3>
                    <p className="text-sm text-gray-500">{result.courseTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Attempted {result.dateAttempted ? new Date(result.dateAttempted).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{result.score ?? 0}%</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${passed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {passed ? <FiCheckCircle className="w-3 h-3" /> : <FiXCircle className="w-3 h-3" />}
                      {passed ? 'Pass' : 'Fail'}
                    </div>
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
