import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiAward, FiCalendar, FiUser, FiBookOpen, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { certificateService } from '../services/services';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!certificateId) {
        setError('No certificate ID provided.');
        setLoading(false);
        return;
      }
      try {
        const { data } = await certificateService.verify(certificateId);
        setCertificate(data.certificate || data);
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate not found or invalid.');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [certificateId]);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom py-20 lg:py-32 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl text-center mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <FiAward className="w-4 h-4 text-accent" />
              Certificate Verification
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Verify <span className="text-accent">Certificate</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Enter a certificate ID to verify its authenticity and view the details.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Verifying Certificate</h2>
              <p className="text-gray-500">Please wait while we verify the certificate...</p>
            </div>
          ) : error ? (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiAward className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Certificate Not Found</h2>
              <p className="text-gray-500 mb-8">{error}</p>
              <Link to="/" className="btn-primary inline-flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" /> Go Home
              </Link>
            </motion.div>
          ) : certificate ? (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiCheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Certificate Verified!</h2>
                <p className="text-gray-500">This certificate is authentic and valid.</p>
              </div>

              <div className="card overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
                  <FiAward className="w-12 h-12 mx-auto mb-3 text-accent" />
                  <h3 className="text-xl font-bold">Certificate of Completion</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 text-sm mb-1">Awarded to</p>
                    <h4 className="text-2xl font-bold">{certificate.studentName || certificate.user?.name || certificate.student?.name || 'Student'}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <FiBookOpen className="w-4 h-4" /> Course
                      </div>
                      <p className="font-semibold">{certificate.courseName || certificate.course?.title || 'Course'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <FiCalendar className="w-4 h-4" /> Completed
                      </div>
                      <p className="font-semibold">
                        {new Date(certificate.completionDate || certificate.completedAt || certificate.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <FiAward className="w-4 h-4" /> Certificate ID
                    </div>
                    <p className="font-mono text-sm break-all">{certificate.certificateId || certificate._id || certificateId}</p>
                  </div>

                  {certificate.grade && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <FiCheckCircle className="w-4 h-4" /> Grade
                      </div>
                      <p className="font-semibold">{certificate.grade}</p>
                    </div>
                  )}
                </div>
              </div>

              {certificate.qrCode && (
                <div className="card p-6 mt-6 text-center">
                  <h4 className="font-bold mb-4">QR Code</h4>
                  <img src={certificate.qrCode} alt="Certificate QR Code" className="w-40 h-40 mx-auto" />
                </div>
              )}

              <div className="text-center mt-8">
                <Link to="/" className="text-primary-600 font-medium hover:underline flex items-center justify-center gap-1">
                  <FiArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
