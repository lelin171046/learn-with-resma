import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiUser, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';
import api from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ImageUploader from '../../components/shared/ImageUploader';

export default function Profile() {
  const { user, updateUser, loading } = useAuth();
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', avatar: user?.avatar || '' },
  });

  const mutation = useMutation({
    mutationFn: (data) => api.put('/auth/profile', data).then((d) => d.data),
    onSuccess: (data) => {
      updateUser(data.user || data);
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account information</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-2xl font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <FiUser className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="font-bold text-lg">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full capitalize">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input {...register('name', { required: 'Name is required' })} className="input-field" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input {...register('email')} readOnly className="input-field bg-gray-50 dark:bg-gray-800 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone</label>
            <input {...register('phone')} className="input-field" placeholder="Enter phone number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Avatar</label>
            <ImageUploader value={watch('avatar') || ''} onChange={(url) => setValue('avatar', url, { shouldDirty: true })} />
          </div>
          <button type="submit" disabled={!isDirty || mutation.isPending} className="btn-accent flex items-center gap-2">
            <FiSave className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
