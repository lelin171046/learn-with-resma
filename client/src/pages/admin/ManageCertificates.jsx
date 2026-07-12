import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiSearch, FiAward, FiCalendar } from 'react-icons/fi';
import { certificateService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageCertificates() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-certificates'],
    queryFn: () => certificateService.getAll().then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner />;

  const certificates = data?.certificates || data || [];
  const filtered = search
    ? certificates.filter((c) => (c.certificateId || c._id)?.toLowerCase().includes(search.toLowerCase()))
    : certificates;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Manage Certificates</h1>
        <p className="text-gray-500 mt-1">{certificates.length} total certificates</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by certificate ID..." className="input-field pl-10" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Certificate ID</th>
                <th className="p-4 font-medium">Completion Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">
                  <FiAward className="w-10 h-10 mx-auto mb-3" />
                  <p>No certificates found</p>
                </td></tr>
              ) : filtered.map((cert) => (
                <tr key={cert._id} className="border-b dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-medium">{cert.user?.name || 'N/A'}</td>
                  <td className="p-4 text-gray-500">{cert.course?.title || 'N/A'}</td>
                  <td className="p-4 font-mono text-xs">{cert.certificateId || cert._id?.slice(-8)}</td>
                  <td className="p-4 text-gray-500 text-xs flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" />
                    {new Date(cert.completedAt || cert.issuedAt || cert.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
