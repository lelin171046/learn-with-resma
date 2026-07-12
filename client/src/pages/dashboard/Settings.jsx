import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function Settings() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => api.put('/auth/profile', { password: data.newPassword, oldPassword: data.oldPassword }).then((d) => d.data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword) {
      return toast.error('Please fill in all fields');
    }
    if (form.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    if (form.newPassword !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    mutation.mutate(form);
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
            <FiLock className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showOld ? 'text' : 'password'} value={form.oldPassword} onChange={(e) => updateField('oldPassword', e.target.value)} className="input-field pr-10" placeholder="Enter current password" />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showOld ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={form.newPassword} onChange={(e) => updateField('newPassword', e.target.value)} className="input-field pr-10" placeholder="Enter new password" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className="input-field" placeholder="Confirm new password" />
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-accent flex items-center gap-2">
            <FiSave className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
