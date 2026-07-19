import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { FiPlay, FiCheck, FiChevronLeft, FiChevronRight, FiDownload, FiMessageSquare, FiFileText } from 'react-icons/fi';
import { courseService, progressService, quizService, commentService } from '../services/services';
import { useAuth } from '../context/AuthProvider';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CoursePlayer() {
  const { slug } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [commentText, setCommentText] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['course-player', slug],
    queryFn: () => courseService.getBySlug(slug).then((d) => d.data),
  });

  const lessons = data?.lessons || [];
  const currentLesson = lessons[currentLessonIndex];

  const { data: progressData } = useQuery({
    queryKey: ['progress', data?.course?._id],
    queryFn: () => progressService.get(data.course._id).then((d) => d.data),
    enabled: !!data?.course?._id,
  });

  const { data: quizData } = useQuery({
    queryKey: ['quiz', currentLesson?._id],
    queryFn: () => quizService.getByLesson(currentLesson._id).then((d) => d.data),
    enabled: showQuiz && !!currentLesson?._id,
  });

  const { data: commentsData } = useQuery({
    queryKey: ['comments', currentLesson?._id],
    queryFn: () => commentService.getByLesson(currentLesson._id).then((d) => d.data),
    enabled: !!currentLesson?._id,
  });

  const completeMutation = useMutation({
    mutationFn: () => progressService.markLessonComplete(data?.course?._id, currentLesson?._id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['progress'] }); toast.success('Lesson completed!'); },
  });

  const submitQuizMutation = useMutation({
    mutationFn: () => quizService.submit(quizData.quiz._id, quizAnswers),
    onSuccess: (res) => {
      setQuizResult(res.data);
      if (res.data.passed) { completeMutation.mutate(); setShowQuiz(false); }
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const submitCommentMutation = useMutation({
    mutationFn: () => commentService.create({ lesson: currentLesson?._id, course: data?.course?._id, text: commentText }),
    onSuccess: () => { setCommentText(''); queryClient.invalidateQueries({ queryKey: ['comments', currentLesson?._id] }); toast.success('Comment posted'); },
  });

  if (isLoading) return <LoadingSpinner fullPage />;

  const isCompleted = (id) => progressData?.progress?.completedLessons?.includes(id);

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex((i) => i + 1);
      setShowQuiz(false);
      setQuizResult(null);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((i) => i - 1);
      setShowQuiz(false);
      setQuizResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto hidden lg:block">
        <div className="p-4 border-b border-gray-700">
          <Link to={`/course/${slug}`} className="text-primary-400 hover:underline text-sm flex items-center gap-1"><FiChevronLeft /> Back to Course</Link>
          <h3 className="font-bold text-white mt-2 text-sm line-clamp-2">{data?.course?.title}</h3>
          <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="bg-primary-600 h-full transition-all" style={{ width: `${progressData?.progress?.progressPercentage || 0}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progressData?.progress?.progressPercentage || 0}% Complete</p>
        </div>
        <div className="py-2">
          {lessons.map((lesson, i) => (
            <button key={lesson._id} onClick={() => { setCurrentLessonIndex(i); setShowQuiz(false); setQuizResult(null); }} className={`w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors ${i === currentLessonIndex ? 'bg-primary-600/20 border-r-2 border-primary-500' : 'hover:bg-gray-700/50'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted(lesson._id) ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-300'}`}>
                {isCompleted(lesson._id) ? <FiCheck className="w-3 h-3" /> : <FiPlay className="w-3 h-3" />}
              </div>
              <span className="line-clamp-1 text-gray-200">{lesson.title}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-black aspect-video max-h-[70vh]">
          {currentLesson?.videoUrl ? (
            <ReactPlayer url={currentLesson.videoUrl} width="100%" height="100%" controls playing />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No video available</div>
          )}
        </div>

        <div className="p-6 max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">{currentLesson?.title}</h1>
            <div className="flex gap-2">
              {!showQuiz && currentLesson?.hasQuiz && (
                <button onClick={() => setShowQuiz(true)} className="btn-accent !py-2 !px-4 text-sm">Take Quiz</button>
              )}
              {!isCompleted(currentLesson?._id) && !showQuiz && (
                <button onClick={() => completeMutation.mutate()} className="btn-primary !py-2 !px-4 text-sm">Mark Complete</button>
              )}
            </div>
          </div>

          <p className="text-gray-400 mb-6">{currentLesson?.description}</p>
           {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
            <button onClick={handlePrev} disabled={currentLessonIndex === 0} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium">
              <FiChevronLeft className="w-4 h-4" /> Previous Video
            </button>
            <button onClick={handleNext} disabled={currentLessonIndex === lessons.length - 1} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium">
              Next Video <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* PDF Notes */}
          {currentLesson?.pdfNotes?.length > 0 && (
            <div className="mb-6 bg-gray-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><FiFileText /> Class Notes</h3>
              <div className="space-y-2">
                {currentLesson.pdfNotes.map((note, i) => (
                  <a key={i} href={note.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-primary-400 hover:text-primary-300 bg-gray-700/50 rounded-lg p-3 transition-colors">
                    <FiFileText className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-sm">{note.title}</span>
                    <FiDownload className="w-4 h-4 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quiz */}
          {showQuiz && quizData?.quiz && !quizResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-bold text-lg mb-4">{quizData.quiz.title}</h3>
              {quizData.quiz.questions.map((q, qi) => (
                <div key={qi} className="mb-6">
                  <p className="text-white mb-3">{qi + 1}. {q.questionText}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${quizAnswers[qi] === oi ? 'bg-primary-600/20 border border-primary-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        <input type="radio" name={`q${qi}`} checked={quizAnswers[qi] === oi} onChange={() => { const a = [...quizAnswers]; a[qi] = oi; setQuizAnswers(a); }} className="accent-primary-600" />
                        <span className="text-gray-200">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {quizResult && (
                    <p className={`text-sm mt-2 ${quizResult.results[qi]?.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {quizResult.results[qi]?.isCorrect ? 'Correct' : 'Wrong'} - {q.explanation}
                    </p>
                  )}
                </div>
              ))}
              <button onClick={() => submitQuizMutation.mutate()} className="btn-accent">Submit Quiz</button>
            </motion.div>
          )}

          {quizResult && (
            <div className={`p-4 rounded-xl mb-6 ${quizResult.passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <p className={`font-bold ${quizResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                {quizResult.passed ? 'Quiz Passed!' : 'Quiz Failed'} - Score: {quizResult.score}% ({quizResult.correct}/{quizResult.total})
              </p>
              {!quizResult.passed && <p className="text-gray-400 text-sm mt-1">You need 80% to pass. Try again!</p>}
            </div>
          )}

          {/* Comments */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><FiMessageSquare /> Discussion</h3>
            <div className="flex gap-3 mb-6">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="input-field !bg-gray-700 !border-gray-600 !text-white flex-1" />
              <button onClick={() => submitCommentMutation.mutate()} disabled={!commentText.trim()} className="btn-primary !py-2">Post</button>
            </div>
            <div className="space-y-4">
              {commentsData?.comments?.map((comment) => (
                <div key={comment._id} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 text-xs font-bold">{comment.user?.name?.charAt(0)}</div>
                    <span className="text-white text-sm font-medium">{comment.user?.name}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
