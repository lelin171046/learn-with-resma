import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiX, FiArrowRight, FiArrowLeft, FiPlay, FiCheck, FiClock, FiChevronDown, FiChevronUp, FiFileText, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { courseService, categoryService, lessonService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ImageUploader from '../../components/shared/ImageUploader';
import PdfUploader from '../../components/shared/PdfUploader';

export default function ManageCourses() {
  const [view, setView] = useState('list');
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => courseService.getAll({ all: true }).then((d) => d.data),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().then((d) => d.data),
  });

  const createCourse = async (formData) => {
    setCreating(true);
    try {
      const res = await courseService.create(formData);
      const course = res.data.course;
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course created');
      setCreatedCourse(course);
      setView('create-step2');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => courseService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-courses'] }); toast.success('Course deleted'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-gray-500 mt-1">{courses.length} total courses</p>
        </div>
        {view === 'list' && (
          <button onClick={() => setView('create-step1')} className="btn-accent flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> New Course
          </button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <CourseTable
              courses={courses}
              onEdit={(id) => { setEditingCourseId(id); setView('edit'); }}
              onDelete={(c) => { if (window.confirm(`Delete "${c.title}"?`)) deleteMutation.mutate(c._id); }}
              onTogglePublished={(id) => togglePublishedMutation.mutate(id)}
              onToggleFeatured={(id) => toggleFeaturedMutation.mutate(id)}
            />
          </motion.div>
        )}

        {view === 'create-step1' && (
          <motion.div key="create1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <StepIndicator current={1} />
            <CourseInfoForm
              categories={categories}
              onSubmit={createCourse}
              onCancel={() => setView('list')}
              isPending={creating}
            />
          </motion.div>
        )}

        {view === 'create-step2' && (
          <motion.div key="create2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <StepIndicator current={2} />
            <LessonForm
              course={createdCourse}
              onDone={() => { setCreatedCourse(null); setView('list'); queryClient.invalidateQueries({ queryKey: ['admin-courses'] }); }}
              onBack={() => setView('create-step1')}
            />
          </motion.div>
        )}

        {view === 'edit' && (
          <motion.div key="edit" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <EditCourseView
              courseId={editingCourseId}
              courses={courses}
              categories={categories}
              onDone={() => { setEditingCourseId(null); setView('list'); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${current >= step ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
            {current > step ? <FiCheck className="w-4 h-4" /> : step}
          </div>
          <span className={`text-sm font-medium ${current >= step ? 'text-primary-600' : 'text-gray-400'}`}>{step === 1 ? 'Course Info' : 'Add Lessons'}</span>
          {step < 2 && <div className={`w-12 h-0.5 ${current > 1 ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
        </div>
      ))}
    </div>
  );
}

function CourseInfoForm({ categories, onSubmit, onCancel, initial, isPending }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initial || { title: '', description: '', category: '', price: '', level: 'beginner', isFree: false, thumbnail: '', totalLessons: 0 },
  });
  const isFree = watch('isFree');

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">{initial ? 'Edit Course Info' : 'Step 1: Course Info'}</h2>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Course Title *</label>
            <input {...register('title', { required: 'Title is required' })} className="input-field" placeholder="e.g. IELTS Preparation Masterclass" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category *</label>
            <select {...register('category', { required: 'Category is required' })} className="input-field">
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Description *</label>
          <textarea {...register('description', { required: 'Description is required' })} rows={3} className="input-field" placeholder="Describe the course..." />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Thumbnail</label>
          <ImageUploader value={watch('thumbnail') || ''} onChange={(url) => setValue('thumbnail', url)} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Level</label>
            <select {...register('level')} className="input-field">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Total Lessons</label>
            <input type="number" {...register('totalLessons')} className="input-field" placeholder="0" min="0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Price ($)</label>
            <input type="number" step="0.01" {...register('price')} disabled={isFree} className="input-field" placeholder="0.00" min="0" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('isFree')} id="isFree" className="rounded" />
          <label htmlFor="isFree" className="text-sm font-medium">Free Course</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="btn-accent flex items-center gap-2">
            {isPending ? 'Creating Course...' : <>{initial ? 'Save Changes' : <>Next <FiArrowRight className="w-4 h-4" /></>}</>}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function LessonForm({ course, onDone, onBack }) {
  const queryClient = useQueryClient();
  const [lessons, setLessons] = useState([]);
  const [pdfNotes, setPdfNotes] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const { data: lessonData, isLoading: lessonsLoading } = useQuery({
    queryKey: ['admin-lessons', course._id],
    queryFn: () => lessonService.getByCourse(course._id).then((d) => d.data),
  });

  const existingLessons = lessonData?.lessons || [];

  const addLesson = async (form) => {
    setSubmitting(true);
    try {
      const payload = { ...form, course: course._id, videoType: 'youtube', sortOrder: existingLessons.length + lessons.length + 1 };
      if (pdfNotes.length > 0) payload.pdfNotes = pdfNotes;
      const res = await lessonService.create(payload);
      setLessons((prev) => [...prev, res.data.lesson]);
      setPdfNotes([]);
      reset();
      toast.success('Lesson added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setSubmitting(false);
    }
  };

  const removeLesson = async (lessonId, isExisting) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      if (isExisting) await lessonService.delete(lessonId);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success('Lesson removed');
    } catch (err) {
      toast.error('Failed to remove lesson');
    }
  };

  const allLessons = [...existingLessons, ...lessons];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Step 2: Add Lessons</h2>
            <p className="text-sm text-gray-500 mt-1">Course: <span className="font-medium text-primary-600">{course.title}</span></p>
          </div>
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"><FiArrowLeft className="w-4 h-4" /> Back</button>
        </div>

        {showLessonForm ? (
          <form onSubmit={handleSubmit(addLesson)} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Video Title *</label>
                <input {...register('title', { required: 'Required' })} className="input-field" placeholder="e.g. Introduction to IELTS" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube URL *</label>
                <input {...register('videoUrl', { required: 'Required' })} className="input-field" placeholder="https://youtube.com/watch?v=..." />
                {errors.videoUrl && <p className="text-red-500 text-xs mt-1">{errors.videoUrl.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration *</label>
                <input {...register('duration', { required: 'Required' })} className="input-field" placeholder="e.g. 15:30" />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (optional)</label>
              <textarea {...register('description')} rows={2} className="input-field" placeholder="Brief lesson description..." />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">PDF Notes (optional)</label>
                {pdfNotes.length > 0 && <span className="text-xs text-gray-400">{pdfNotes.length} note(s) attached</span>}
              </div>
              {pdfNotes.map((note, i) => (
                <div key={i} className="flex items-center gap-2 p-2 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiFileText className="w-4 h-4 text-red-500" />
                  <span className="text-sm flex-1 truncate">{note.title}</span>
                  <a href={note.url} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-700"><FiDownload className="w-3.5 h-3.5" /></a>
                  <button type="button" onClick={() => setPdfNotes((prev) => prev.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-600"><FiX className="w-3.5 h-3.5" /></button>
                </div>
              ))}
              <PdfUploader onChange={(note) => { if (note) setPdfNotes((prev) => [...prev, note]); }} label="Add class notes PDF" />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-accent flex items-center justify-center gap-2">
                {submitting ? 'Adding...' : <><FiPlus className="w-4 h-4" /> Add Lesson</>}
              </button>
              <button type="button" onClick={() => setShowLessonForm(false)} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Add Another</button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-3">Add another lesson?</p>
            <button onClick={() => setShowLessonForm(true)} className="btn-accent flex items-center gap-2 mx-auto"><FiPlus className="w-4 h-4" /> Add New Lesson</button>
          </div>
        )}
      </div>

      {lessonsLoading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-bold">Lessons ({allLessons.length})</h3>
          </div>
          {allLessons.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No lessons yet. Add your first lesson above.</div>
          ) : (
            <div className="divide-y dark:divide-gray-700/50">
              {allLessons.map((lesson, i) => (
                <div key={lesson._id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lesson.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FiPlay className="w-3 h-3" /> YouTube</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3" /> {lesson.duration || 'N/A'}</span>
                      {lesson.pdfNotes?.length > 0 && (
                        <span className="text-xs text-gray-400 flex items-center gap-1"><FiFileText className="w-3 h-3" /> {lesson.pdfNotes.length} PDF(s)</span>
                      )}
                    </div>
                  </div>
                  {lesson._id && (
                    <button onClick={() => removeLesson(lesson._id, existingLessons.some((e) => e._id === lesson._id))} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 flex-shrink-0">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onDone} className="btn-accent flex items-center gap-2">
          <FiCheck className="w-4 h-4" /> {lessons.length > 0 ? `Done (${lessons.length} added)` : 'Done'}
        </button>
        <button onClick={onBack} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Back to Course Info</button>
      </div>
    </div>
  );
}

function EditCourseView({ courseId, courses, categories, onDone }) {
  const queryClient = useQueryClient();
  const course = courses.find((c) => c._id === courseId);
  const [editingLessonChange, setEditingLessonChange] = useState(null);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => courseService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-courses'] }); toast.success('Course updated'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id) => lessonService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', courseId] }); toast.success('Lesson deleted'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ id, data }) => lessonService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', courseId] }); setEditingLessonChange(null); toast.success('Lesson updated'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const { data: lessonData, isLoading: lessonsLoading } = useQuery({
    queryKey: ['admin-lessons', courseId],
    queryFn: () => lessonService.getByCourse(courseId).then((d) => d.data),
  });

  if (!course) return <div className="card p-6 text-center text-gray-400">Course not found</div>;

  const lessons = lessonData?.lessons || [];

  return (
    <div className="space-y-6">
      <button onClick={onDone} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600"><FiArrowLeft className="w-4 h-4" /> Back to courses</button>
      <CourseInfoForm
        categories={categories}
        initial={course}
        onSubmit={(data) => updateMutation.mutate({ id: courseId, data })}
        onCancel={onDone}
      />

      <div className="card overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <h3 className="font-bold">Lessons ({lessons.length})</h3>
        </div>
        {lessonsLoading ? <LoadingSpinner /> : lessons.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No lessons yet.</div>
        ) : (
          <div className="divide-y dark:divide-gray-700/50">
            {lessons.map((lesson, i) => (
              <div key={lesson._id}>
                <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <span className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lesson.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FiPlay className="w-3 h-3" /> YouTube</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3" /> {lesson.duration || 'N/A'}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditingLessonChange(editingLessonChange === lesson._id ? null : lesson._id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                    {editingLessonChange === lesson._id ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { if (window.confirm('Delete this lesson?')) deleteLessonMutation.mutate(lesson._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                {editingLessonChange === lesson._id && (
                  <EditLessonInline lesson={lesson} onSave={(data) => updateLessonMutation.mutate({ id: lesson._id, data })} isPending={updateLessonMutation.isPending} onCancel={() => setEditingLessonChange(null)} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EditLessonInline({ lesson, onSave, isPending, onCancel }) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: { title: lesson.title, videoUrl: lesson.videoUrl || '', duration: lesson.duration || '' },
  });
  const [pdfNotes, setPdfNotes] = useState(lesson.pdfNotes || []);

  return (
    <form onSubmit={handleSubmit((data) => onSave({ ...data, pdfNotes }))} className="px-4 py-4 bg-gray-50 dark:bg-gray-800/80 border-t dark:border-gray-700 space-y-3">
      <div className="grid md:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-xs font-medium mb-1">Video Title</label>
          <input {...register('title', { required: true })} className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">YouTube URL</label>
          <input {...register('videoUrl', { required: true })} className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Duration</label>
          <input {...register('duration', { required: true })} className="input-field text-sm" placeholder="15:30" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">PDF Notes</label>
        {pdfNotes.map((note, i) => (
          <div key={i} className="flex items-center gap-2 p-2 mb-1 bg-white dark:bg-gray-700 rounded-lg">
            <FiFileText className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs flex-1 truncate">{note.title}</span>
            <a href={note.url} target="_blank" rel="noreferrer" className="text-primary-600"><FiDownload className="w-3 h-3" /></a>
            <button type="button" onClick={() => setPdfNotes((prev) => prev.filter((_, j) => j !== i))} className="text-red-500"><FiX className="w-3 h-3" /></button>
          </div>
        ))}
        <PdfUploader onChange={(note) => { if (note) setPdfNotes((prev) => [...prev, note]); }} label="Add class notes PDF" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="btn-accent text-sm px-3 py-2">{isPending ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="text-sm px-3 py-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
}

function CourseTable({ courses, onEdit, onDelete, onTogglePublished, onToggleFeatured }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="p-4 font-medium">Course</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Lessons</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Featured</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No courses found</td></tr>
            ) : courses.map((course) => (
              <tr key={course._id} className="border-b dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={course.thumbnail || 'https://placehold.co/60x40/e2e8f0/94a3b8?text=C'} alt="" className="w-12 h-8 rounded object-cover flex-shrink-0" />
                    <span className="font-medium">{course.title}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{course.category?.name || 'N/A'}</td>
                <td className="p-4 text-gray-500">{course.totalLessons || 0}</td>
                <td className="p-4">{course.isFree ? 'Free' : `$${course.price || 0}`}</td>
                <td className="p-4">
                  <button onClick={() => onTogglePublished(course._id)} className={`text-xs px-2 py-0.5 rounded-full ${course.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => onToggleFeatured(course._id)} className={`p-1 rounded ${course.isFeatured ? 'text-yellow-500' : 'text-gray-300'}`}>
                    <FiStar className="w-4 h-4" fill={course.isFeatured ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(course._id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(course)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
