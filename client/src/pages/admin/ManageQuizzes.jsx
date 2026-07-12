import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { quizService, courseService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const emptyQuestion = { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' };

export default function ManageQuizzes() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => quizService.getAll().then((d) => d.data),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['admin-courses-list'],
    queryFn: () => courseService.getAll({ all: true }).then((d) => d.data),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => quizService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      toast.success('Quiz created');
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => quizService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      toast.success('Quiz updated');
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => quizService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quizzes'] });
      toast.success('Quiz deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  if (isLoading) return <LoadingSpinner />;

  const quizzes = data?.quizzes || data || [];
  const courses = coursesData?.courses || coursesData || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Quizzes</h1>
          <p className="text-gray-500 mt-1">{quizzes.length} quizzes</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn-accent flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> New Quiz
        </button>
      </motion.div>

      {showForm && (
        <QuizForm
          editingId={editingId}
          quizzes={quizzes}
          courses={courses}
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
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Questions</th>
                <th className="p-4 font-medium">Pass Score</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">No quizzes yet</td></tr>
              ) : quizzes.map((q) => (
                <tr key={q._id} className="border-b dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-medium">{q.title}</td>
                  <td className="p-4 text-gray-500">{q.course?.title || 'N/A'}</td>
                  <td className="p-4 text-gray-500 capitalize">{q.type || 'quiz'}</td>
                  <td className="p-4 text-gray-500">{q.questions?.length || 0}</td>
                  <td className="p-4 text-gray-500">{q.passingScore ?? 70}%</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingId(q._id); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if (window.confirm('Delete this quiz?')) deleteMutation.mutate(q._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
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

function QuizForm({ editingId, quizzes, courses, onSubmit, onCancel, isPending }) {
  const quiz = editingId ? quizzes.find((q) => q._id === editingId) : null;
  const [title, setTitle] = useState(quiz?.title || '');
  const [course, setCourse] = useState(quiz?.course?._id || quiz?.course || '');
  const [type, setType] = useState(quiz?.type || 'quiz');
  const [passingScore, setPassingScore] = useState(quiz?.passingScore ?? 70);
  const [questions, setQuestions] = useState(
    quiz?.questions?.length
      ? quiz.questions.map((q) => ({ questionText: q.questionText || '', options: q.options?.length ? q.options : ['', '', '', ''], correctAnswer: q.correctAnswer ?? 0, explanation: q.explanation || '' }))
      : [{ ...emptyQuestion }]
  );

  const updateQuestion = (i, field, value) => {
    setQuestions((prev) => prev.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  };

  const updateOption = (qi, oi, value) => {
    setQuestions((prev) => prev.map((q, idx) => {
      if (idx !== qi) return q;
      const opts = [...q.options];
      opts[oi] = value;
      return { ...q, options: opts };
    }));
  };

  const addQuestion = () => setQuestions((prev) => [...prev, { ...emptyQuestion }]);
  const removeQuestion = (i) => setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Title is required');
    if (!course) return toast.error('Select a course');
    if (questions.length === 0) return toast.error('Add at least one question');
    onSubmit({ title, course, type, passingScore: Number(passingScore), questions });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Quiz' : 'New Quiz'}</h2>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="Quiz title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course *</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="input-field">
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                <option value="quiz">Quiz</option>
                <option value="mcq">MCQ</option>
                <option value="final">Final</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pass %</label>
              <input type="number" value={passingScore} onChange={(e) => setPassingScore(e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Questions ({questions.length})</h3>
            <button type="button" onClick={addQuestion} className="text-sm text-primary-600 hover:underline flex items-center gap-1"><FiPlus className="w-3 h-3" /> Add</button>
          </div>
          {questions.map((q, qi) => (
            <div key={qi} className="border dark:border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold text-gray-400 mt-2">Q{qi + 1}</span>
                <div className="flex-1 space-y-2">
                  <input value={q.questionText} onChange={(e) => updateQuestion(qi, 'questionText', e.target.value)} className="input-field" placeholder="Question text" />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQuestion(qi, 'correctAnswer', oi)} className="accent-primary-600" />
                        <input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} className="input-field text-sm" placeholder={`Option ${oi + 1}`} />
                      </div>
                    ))}
                  </div>
                  <input value={q.explanation} onChange={(e) => updateQuestion(qi, 'explanation', e.target.value)} className="input-field text-sm" placeholder="Explanation (optional)" />
                </div>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qi)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 mt-2"><FiTrash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={isPending} className="btn-accent">{isPending ? 'Saving...' : editingId ? 'Update Quiz' : 'Create Quiz'}</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}
