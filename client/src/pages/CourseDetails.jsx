import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiUsers, FiBookOpen, FiPlay, FiLock, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { courseService, lessonService } from '../services/services';
import { useAuth } from '../context/AuthProvider';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function CourseDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => courseService.getBySlug(slug).then((d) => d.data),
  });

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!data?.course) return <div className="text-center py-20">Course not found</div>;

  const { course, lessons } = data;
  const isEnrolled = user?.enrolledCourses?.includes(course._id);

  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-gray-800 text-white py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-primary-400 text-sm font-medium">{course.category?.name}</span>
                <span className="text-gray-500">|</span>
                <span className="text-sm text-gray-400 capitalize">{course.level}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-300 mb-6 leading-relaxed">{course.shortDescription || course.description}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1"><FiUsers className="w-4 h-4" /> {course.totalStudents} students</span>
                <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> {course.duration || 'Self-paced'}</span>
                <span className="flex items-center gap-1"><FiBookOpen className="w-4 h-4" /> {course.totalLessons} lessons</span>
                <span className="flex items-center gap-1"><FiStar className="w-4 h-4 text-accent" /> {course.rating?.toFixed(1) || 'New'}</span>
              </div>
              <div className="flex items-center gap-3 mb-8">
                <img src={course.instructor?.avatar || ''} alt="" className="w-10 h-10 rounded-full bg-primary-100" />
                <span>by <strong>{course.instructor?.name}</strong></span>
              </div>
              <div className="flex flex-wrap gap-4">
                {isEnrolled ? (
                  <Link to={`/course/${course.slug}/learn`} className="btn-accent flex items-center gap-2"><FiPlay className="w-5 h-5" /> Continue Learning</Link>
                ) : (
                  <Link to={course.isFree ? `/course/${course.slug}/learn` : '#'} className="btn-accent flex items-center gap-2">
                    {course.isFree ? 'Enroll Free' : `Buy Now - $${course.price}`} <FiArrowRight />
                  </Link>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="hidden lg:block">
              <img src={course.thumbnail || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-full rounded-2xl shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: course.description }} />
              </div>

              {course.learningOutcomes?.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.learningOutcomes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2"><FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" /><span>{item}</span></div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                <div className="space-y-2">
                  {lessons?.map((lesson, i) => (
                    <div key={lesson._id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          {lesson.duration && <span>{lesson.duration}</span>}
                          {lesson.isFree ? <span className="text-green-500">Free</span> : <FiLock className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="card p-6 sticky top-24">
                <div className="text-3xl font-bold mb-4">{course.isFree ? 'Free' : `$${course.price}`}</div>
                {isEnrolled ? (
                  <Link to={`/course/${course.slug}/learn`} className="btn-accent w-full text-center block">Start Learning</Link>
                ) : (
                  <button className="btn-accent w-full">{course.isFree ? 'Enroll Free' : 'Buy Now'}</button>
                )}
                <ul className="space-y-3 mt-6 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2"><FiClock className="w-4 h-4" /> {course.duration || 'Self-paced'}</li>
                  <li className="flex items-center gap-2"><FiBookOpen className="w-4 h-4" /> {course.totalLessons} lessons</li>
                  <li className="flex items-center gap-2"><FiUsers className="w-4 h-4" /> {course.totalStudents} students enrolled</li>
                  <li className="flex items-center gap-2"><FiStar className="w-4 h-4" /> {course.rating?.toFixed(1) || 'No ratings'} ({course.totalRatings} ratings)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
