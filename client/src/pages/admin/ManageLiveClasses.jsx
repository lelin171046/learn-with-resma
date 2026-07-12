import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { liveClassService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const emptyForm = { title: '', description: '', meetingPlatform: 'zoom', meetingLink: '', scheduledAt: '', duration: '' };

export default function ManageLiveClasses() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-live-classes'],
    queryFn: () => liveClassService.getAll().then((d) => d.data),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => liveClassService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-live-classes'] });
      toast.success('Live class created');
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => liveClassService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-live-classes'] });
      toast.success('Live class updated');
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => liveClassService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-live-classes'] });
      toast.success('Live class deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  if (isLoading) return <LoadingSpinner />;

  const classes = data?.classes || data || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Live Classes</h1>
          <p className="text-gray-500 mt-1">{classes.length} live classes</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn-accent flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> New Class
        </button>
      </motion.div>

      {showForm && (
        <ClassForm
          editingId={editingId}
          classes={classes}
          onSubmit={(formData) => editingId ? updateMutation.mutate({ id: editingId, data: formData }) : createMutation.mutate(formData)}
          onCancel={() => { setEditingId(null); setShowForm(false); }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="space-y-3">
        {classes.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <FiVideo className="w-12 h-12 mx-auto mb-4" />
            <p>No live classes yet</p>
          </div>
        ) : classes.map((cls, i) => (
          <motion.div key={cls._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">{cls.title}</h3>
                {cls.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cls.description}</p>}
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                  <span className="capitalize">{cls.meetingPlatform}</span>
                  {cls.scheduledAt && <span>{new Date(cls.scheduledAt).toLocaleString()}</span>}
                  {cls.duration && <span>{cls.duration} min</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => { setEditingId(cls._id); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (window.confirm('Delete this class?')) deleteMutation.mutate(cls._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ClassForm({ editingId, classes, onSubmit, onCancel, isPending }) {
  const cls = editingId ? classes.find((c) => c._id === editingId) : null;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: cls ? { ...cls, scheduledAt: cls.scheduledAt ? new Date(cls.scheduledAt).toISOString().slice(0, 16) : '' } : emptyForm,
  });

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Class' : 'New Class'}</h2>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input {...register('title', { required: 'Required' })} className="input-field" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select {...register('meetingPlatform')} className="input-field">
            <option value="zoom">Zoom</option>
            <option value="meet">Google Meet</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} rows={2} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meeting Link *</label>
          <input {...register('meetingLink', { required: 'Required' })} className="input-field" placeholder="https://..." />
          {errors.meetingLink && <p className="text-red-500 text-xs mt-1">{errors.meetingLink.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Scheduled At *</label>
          <input type="datetime-local" {...register('scheduledAt', { required: 'Required' })} className="input-field" />
          {errors.scheduledAt && <p className="text-red-500 text-xs mt-1">{errors.scheduledAt.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input type="number" {...register('duration')} className="input-field" placeholder="60" />
        </div>
        <div className="flex gap-3 items-end">
          <button type="submit" disabled={isPending} className="btn-accent">{isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}
