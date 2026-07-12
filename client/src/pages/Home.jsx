import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay, FiUsers, FiBookOpen, FiStar, FiCheckCircle } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { courseService, categoryService } from '../services/services';
import CourseCardSkeleton from '../components/shared/CourseCardSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  const { data: coursesData, isLoading } = useQuery({ queryKey: ['courses', 'home'], queryFn: () => courseService.getAll({ limit: 6, sort: 'popular' }).then((d) => d.data) });
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.getAll().then((d) => d.data) });

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
                <FiStar className="w-4 h-4 text-accent" />
                Trusted by 5,000+ Students
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Master English with <span className="text-accent">Confidence</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg">
                Professional English courses in Speaking, Writing, Listening, Pronunciation, and IELTS. Learn from an experienced instructor with proven results.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link to="/courses" className="btn-accent flex items-center gap-2">
                  Explore Courses <FiArrowRight />
                </Link>
                <Link to="/practice-mcq" className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                  <FiPlay className="w-4 h-4" /> Free Practice
                </Link>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block">
              <img src="https://i.ibb.co.com/3mWkM45m/Gemini-Generated-Image-6ahs9h6ahs9h6ahs.png" alt="Learn With Resma" className="w-full max-w-md mx-auto rounded-3xl shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-secondary border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, value: '5,000+', label: 'Students' },
              { icon: FiBookOpen, value: '50+', label: 'Courses' },
              { icon: FiStar, value: '4.9', label: 'Rating' },
              { icon: FiCheckCircle, value: '95%', label: 'Success Rate' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categoriesData?.categories?.length > 0 && (
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">Course Categories</motion.h2>
            <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">Choose from our wide range of English language programs</motion.p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoriesData.categories.map((cat, i) => (
                <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/courses?category=${cat._id}`} className="card p-6 text-center hover:-translate-y-1 block">
                    <div className="text-3xl mb-3">{cat.icon || '📚'}</div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cat.courseCount} courses</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Courses */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title !text-left !mb-2">Popular Courses</h2>
              <p className="text-gray-500">Learn from our most popular courses</p>
            </div>
            <Link to="/courses" className="hidden sm:flex items-center gap-1 text-primary-600 font-medium hover:underline">View All <FiArrowRight /></Link>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData?.courses?.map((course, i) => (
                <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/course/${course.slug}`} className="card group block">
                    <div className="relative h-48 overflow-hidden">
                      <img src={course.thumbnail || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={course.isFree ? 'badge-free absolute top-3 left-3' : 'badge-paid absolute top-3 left-3'}>{course.isFree ? 'Free' : `$${course.price}`}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{course.totalLessons} lessons</span>
                        <span>{course.totalStudents} students</span>
                        <span className="flex items-center gap-1"><FiStar className="w-3 h-3 text-accent" />{course.rating?.toFixed(1) || 'New'}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-xs font-bold">{course.instructor?.name?.charAt(0)}</div>
                        <span className="text-sm">{course.instructor?.name}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Learn With Resma */}
      <section className="section-padding bg-secondary text-white">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title !text-white">Why Learn With Resma?</motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle !text-gray-400">The right choice for your English learning journey</motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Expert Instructor', desc: 'Learn from Resma, an experienced English language instructor with years of teaching expertise.' },
              { title: 'Structured Curriculum', desc: 'Well-organized courses from beginner to advanced levels with clear learning paths.' },
              { title: 'Interactive Lessons', desc: 'Video lessons, quizzes, assignments, and practice exercises for complete learning.' },
              { title: 'IELTS Focus', desc: 'Specialized IELTS preparation with proven strategies to achieve your target score.' },
              { title: 'Practice MCQs', desc: 'Regular quizzes and mock tests to track your progress and build confidence.' },
              { title: 'Certificate', desc: 'Earn a verified certificate upon course completion to showcase your achievement.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400 text-xl font-bold mb-4">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="https://i.ibb.co.com/3mWkM45m/Gemini-Generated-Image-6ahs9h6ahs9h6ahs.png" alt="Resma" className="w-full max-w-md rounded-3xl shadow-xl" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary-600 font-semibold text-sm">Meet Your Instructor</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">Resma</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                An experienced English language instructor passionate about helping students master English. Specializing in Speaking, Writing, Listening, Pronunciation, and IELTS preparation with a track record of student success.
              </p>
              <div className="space-y-3 mb-8">
                {['English Speaking & Fluency', 'English Writing Skills', 'IELTS Preparation', 'Pronunciation & Phonetics', 'Listening Comprehension'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary inline-flex items-center gap-2">Learn More <FiArrowRight /></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">Frequently Asked Questions</motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">Got questions? We have answers</motion.p>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Are the courses suitable for beginners?', a: 'Yes, our courses are designed for all levels from beginner to advanced.' },
              { q: 'How long do I have access to the course?', a: 'Once enrolled, you have lifetime access to all course materials.' },
              { q: 'Do I get a certificate?', a: 'Yes, you receive a verified certificate upon completing a course.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-6">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-500">{item.a}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="text-primary-600 font-medium hover:underline flex items-center justify-center gap-1">View All FAQs <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your English Journey?</motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">Join thousands of students who have transformed their English skills with our courses.</motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/register" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">Get Started Free <FiArrowRight /></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
