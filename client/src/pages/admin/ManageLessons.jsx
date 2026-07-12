import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiVideo, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { courseService, lessonService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const emptyForm = { title: '', description: '', videoUrl: '', videoType: 'youtube', sortOrder: 0, isFree: false, hasQuiz: false };

export default function ManageLessons() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: coursesData } = useQuery({
    queryKey: ['admin-courses-list'],
    queryFn: () => courseService.getAll({ all: true }).then((d) => d.data),
  });

  const { data: lessonsData, isLoading: lessonsLoading } = useQuery({
    queryKey: ['admin-lessons', selectedCourse],
    queryFn: () => lessonService.getByCourse(selectedCourse).then((d) => d.data),
    enabled: !!selectedCourse,
  });

  const createMutation = useMutation({
    mutationFn: (formData) => lessonService.create({ ...formData, course: selectedCourse }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons', selectedCourse] });
      toast.success('Lesson created');
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => lessonService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons', selectedCourse] });
      toast.success('Lesson updated');
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => lessonService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons', selectedCourse] });
      toast.success('Lesson deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const reorderMutation = useMutation({
    mutationFn: ({ lessonIds }) => lessonService.reorder(selectedCourse, lessonIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-lessons', selectedCourse] }),
  });

  const courses = coursesData?.courses || coursesData || [];
  const lessons = lessonsData?.lessons || lessonsData || [];

  const moveLesson = (index, direction) => {
    const sorted = [...lessons].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    [sorted[index], sorted[targetIndex]] = [sorted[targetIndex], sorted[index]];
    const lessonIds = sorted.map((l) => l._id);
    reorderMutation.mutate({ lessonIds });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Manage Lessons</h1>
        <p className="text-gray-500 mt-1">Select a course to manage its lessons</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-4">
        <div className="flex items-center gap-4">
          <select value={selectedCourse} onChange={(e) => { setSelectedCourse(e.target.value); setEditingId(null); setShowForm(false); }} className="input-field flex-1">
            <option value="">Select a course...</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
          {selectedCourse && (
            <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn-accent flex items-center gap-2 flex-shrink-0">
              <FiPlus className="w-4 h-4" /> Add Lesson
            </button>
          )}
        </div>
      </motion.div>

      {!selectedCourse && (
        <div className="card p-12 text-center text-gray-400">
          <FiVideo className="w-12 h-12 mx-auto mb-4" />
          <p>Select a course above to manage its lessons</p>
        </div>
      )}

      {selectedCourse && showForm && (
        <LessonForm
          editingId={editingId}
          lessons={lessons}
          onSubmit={(formData) => editingId ? updateMutation.mutate({ id: editingId, data: formData }) : createMutation.mutate(formData)}
          onCancel={() => { setEditingId(null); setShowForm(false); }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {selectedCourse && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {lessonsLoading ? <LoadingSpinner /> : (
            <div className="space-y-2">
              {lessons.length === 0 ? (
                <div className="card p-12 text-center text-gray-400">No lessons yet. Add one above.</div>
              ) : [...lessons].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((lesson, i) => (
                <motion.div key={lesson._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-4 flex items-center gap-4">
                  <span className="text-gray-400 text-sm font-mono w-6 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{lesson.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="capitalize">{lesson.videoType}</span>
                      {lesson.isFree && <span className="text-green-600">Free</span>}
                      {lesson.hasQuiz && <span className="text-purple-600">Quiz</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveLesson(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"><FiArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveLesson(i, 1)} disabled={i === lessons.length - 1} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"><FiArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => { setEditingId(lesson._id); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => { if (window.confirm('Delete this lesson?')) deleteMutation.mutate(lesson._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function LessonForm({ editingId, lessons, onSubmit, onCancel, isPending }) {
  const lesson = editingId ? lessons.find((l) => l._id === editingId) : null;
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: lesson || emptyForm,
  });

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Lesson' : 'New Lesson'}</h2>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input {...register('title', { required: 'Required' })} className="input-field" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input {...register('videoUrl')} className="input-field" placeholder="https://..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea {...register('description')} rows={2} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video Type</label>
          <select {...register('videoType')} className="input-field">
            <option value="youtube">YouTube</option>
            <option value="upload">Upload</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sort Order</label>
          <input type="number" {...register('sortOrder')} className="input-field" />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isFree')} className="rounded" /> Free
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('hasQuiz')} className="rounded" /> Has Quiz
          </label>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={isPending} className="btn-accent">{isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}
