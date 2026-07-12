import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../services/api';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom py-20 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Forgot Password?
            </h1>
            <p className="text-white/80 text-lg">No worries, we'll send you reset instructions</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding -mt-8">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md mx-auto">
            <div className="card p-8">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSend className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                  </p>
                  <p className="text-xs text-gray-400 mb-6">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button onClick={() => setSubmitted(false)} className="text-primary-600 hover:underline">try again</button>.
                  </p>
                  <Link to="/login" className="text-primary-600 font-medium hover:underline flex items-center justify-center gap-1">
                    <FiArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <p className="text-gray-500 text-sm text-center mb-4">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                          })}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" /> Send Reset Link
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link to="/login" className="text-primary-600 font-medium hover:underline flex items-center justify-center gap-1">
                      <FiArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
