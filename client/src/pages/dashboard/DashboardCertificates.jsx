import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiAward, FiDownload, FiCalendar } from 'react-icons/fi';
import { certificateService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function DashboardCertificates() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: () => certificateService.getMy().then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500">Failed to load certificates.</div>;

  const certificates = data?.certificates || [];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">My Certificates</h1>
        <p className="text-gray-500 mt-1">{certificates.length} certificate{certificates.length !== 1 ? 's' : ''} earned</p>
      </motion.div>

      {certificates.length === 0 ? (
        <div className="card p-12 text-center">
          <FiAward className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No certificates yet. Complete a course to earn one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, i) => (
            <motion.div key={cert._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card overflow-hidden">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-center text-white">
                <FiAward className="w-10 h-10 mx-auto mb-2 text-white/80" />
                <h3 className="font-bold">{cert.course?.title || 'Course Certificate'}</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Certificate ID</span>
                  <span className="font-mono text-xs">{cert.certificateId || cert._id?.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Course</span>
                  <span className="font-medium truncate ml-4">{cert.course?.title || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><FiCalendar className="w-3 h-3" /> Completed</span>
                  <span>{new Date(cert.completedAt || cert.issuedAt || Date.now()).toLocaleDateString()}</span>
                </div>
                {cert.user?.name && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Issued to</span>
                    <span className="font-medium">{cert.user.name}</span>
                  </div>
                )}
                <button onClick={() => window.open(`/verify/${cert.certificateId || cert._id}`, '_blank')} className="w-full mt-2 py-2 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                  <FiDownload className="w-4 h-4" /> View / Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
