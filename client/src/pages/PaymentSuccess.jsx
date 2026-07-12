import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiDownload, FiBookOpen } from 'react-icons/fi';
import { paymentService } from '../services/services';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setError('No session ID found. Please check your payment confirmation.');
        setLoading(false);
        return;
      }
      try {
        const { data } = await paymentService.confirm(sessionId);
        setPaymentData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to confirm payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    confirmPayment();
  }, [sessionId]);

  return (
    <div>
      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Confirming Your Payment</h2>
              <p className="text-gray-500">Please wait while we verify your payment...</p>
            </div>
          ) : error ? (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Issue</h2>
              <p className="text-gray-500 mb-8">{error}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/courses" className="btn-primary flex items-center gap-2">
                  Browse Courses <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
                  Contact Support
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                  >
                    <FiCheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>
                </motion.div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-gray-500 text-lg">Thank you for your purchase. Your enrollment is confirmed.</p>
              </div>

              {paymentData && (
                <div className="card p-6 mb-8">
                  <h3 className="font-bold text-lg mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    {paymentData.course && (
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500">Course</span>
                        <span className="font-medium">{paymentData.course.title || paymentData.courseName}</span>
                      </div>
                    )}
                    {paymentData.amount != null && (
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500">Amount Paid</span>
                        <span className="font-medium">${(paymentData.amount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {paymentData.paymentId && (
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500">Payment ID</span>
                        <span className="font-mono text-sm">{paymentData.paymentId}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <FiCheckCircle className="w-4 h-4" /> Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/dashboard/my-courses" className="btn-primary flex items-center gap-2">
                  <FiBookOpen className="w-4 h-4" /> Go to My Courses
                </Link>
                <Link to="/courses" className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center gap-2">
                  Browse More Courses
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
