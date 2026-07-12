import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiStar, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { courseService, categoryService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ImageUploader from '../../components/shared/ImageUploader';

const emptyForm = { title: '', description: '', category: '', price: '', level: 'beginner', isFree: false, thumbnail: '' };

export default function ManageCourses() {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => courseService.getAll({ all: true }).then((d) => d.data),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().then((d) => d.data),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => courseService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course created');
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create course'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => courseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course updated');
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update course'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete course'),
  });

  const togglePublishedMutation = useMutation({
    mutationFn: (id) => courseService.togglePublished(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id) => courseService.toggleFeatured(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  if (isLoading) return <LoadingSpinner />;

  const courses = data?.courses || data || [];
  const categories = catData?.categories || catData || [];

  const handleDelete = (course) => {
    if (window.confirm(`Delete "${course.title}"?`)) {
      deleteMutation.mutate(course._id);
    }
  };

  const startEdit = (course) => {
    setEditingId(course._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-gray-500 mt-1">{courses.length} total courses</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn-accent flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> New Course
        </button>
      </motion.div>

      {showForm && (
        <CourseForm
          editingId={editingId}
          courses={courses}
          categories={categories}
          onSubmit={(formData) => editingId ? updateMutation.mutate({ id: editingId, data: formData }) : createMutation.mutate(formData)}
          onCancel={() => { setEditingId(null); setShowForm(false); }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No courses found</td></tr>
              ) : courses.map((course) => (
                <tr key={course._id} className="border-b dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={course.thumbnail || 'https://placehold.co/60x40/e2e8f0/94a3b8?text=C'} alt="" className="w-12 h-8 rounded object-cover flex-shrink-0" />
                      <span className="font-medium">{course.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{course.category?.name || course.category || 'N/A'}</td>
                  <td className="p-4">{course.isFree ? 'Free' : `$${course.price || 0}`}</td>
                  <td className="p-4">
                    <button onClick={() => togglePublishedMutation.mutate(course._id)} className={`text-xs px-2 py-0.5 rounded-full ${course.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleFeaturedMutation.mutate(course._id)} className={`p-1 rounded ${course.isFeatured ? 'text-yellow-500' : 'text-gray-300'}`}>
                      <FiStar className="w-4 h-4" fill={course.isFeatured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(course)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(course)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                    </div>
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

function CourseForm({ editingId, courses, categories, onSubmit, onCancel, isPending }) {
  const course = editingId ? courses.find((c) => c._id === editingId) : null;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: course ? { ...course, price: course.price || '' } : emptyForm,
  });
  const isFree = watch('isFree');

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Course' : 'Create Course'}</h2>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input {...register('title', { required: 'Required' })} className="input-field" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select {...register('category')} className="input-field">
            <option value="">Select Category</option>
            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} rows={3} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select {...register('level')} className="input-field">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input type="number" {...register('price')} disabled={isFree} className="input-field" placeholder="0" />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" {...register('isFree')} id="isFree" className="rounded" />
          <label htmlFor="isFree" className="text-sm font-medium">Free Course</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <ImageUploader value={watch('thumbnail') || ''} onChange={(url) => setValue('thumbnail', url)} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={isPending} className="btn-accent">{isPending ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}
