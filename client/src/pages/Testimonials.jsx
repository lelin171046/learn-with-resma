import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiMessageSquare } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '../services/services';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const staticTestimonials = [
  { name: 'Fatima Rahman', role: 'IELTS Student', rating: 5, text: 'The IELTS preparation course was phenomenal. I scored Band 8.0 on my first attempt after just 3 months of preparation. The mock tests and personalized feedback were invaluable.', avatar: 'F', course: 'IELTS Preparation' },
  { name: 'Ahmed Hassan', role: 'Writing Student', rating: 5, text: 'My writing skills improved dramatically. I went from struggling with basic paragraphs to writing academic essays that impressed my university professors.', avatar: 'A', course: 'Writing Mastery' },
  { name: 'Sarah Kim', role: 'Speaking Student', rating: 5, text: 'The speaking program helped me overcome my fear of English conversation. The daily challenges kept me motivated and the feedback was always constructive.', avatar: 'S', course: 'Speaking Program' },
  { name: 'Omar Al-Rashid', role: 'IELTS Student', rating: 5, text: 'After failing IELTS twice elsewhere, this program gave me the strategies I needed. The instructor really understands what students need to succeed.', avatar: 'O', course: 'IELTS Preparation' },
  { name: 'Priya Sharma', role: 'Pronunciation Student', rating: 4, text: 'The pronunciation course transformed how I sound in English. My colleagues noticed the improvement immediately in our meetings.', avatar: 'P', course: 'Pronunciation Course' },
  { name: 'Yusuf Kabir', role: 'Listening Student', rating: 5, text: 'I can now understand English movies and lectures without subtitles. The variety of listening exercises really trains your ears effectively.', avatar: 'Y', course: 'Listening Skills' },
  { name: 'Maria Santos', role: 'General English', rating: 5, text: 'The overall English improvement has been remarkable. The structured curriculum and supportive community make learning enjoyable.', avatar: 'M', course: 'General English' },
  { name: 'David Chen', role: 'Business English', rating: 5, text: 'Perfect for professionals. The business writing and speaking modules helped me communicate more effectively in international meetings.', avatar: 'D', course: 'Business English' },
];

export default function Testimonials() {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewService.getAll().then((d) => d.data),
  });

  const reviews = data?.reviews || data || [];
  const testimonials = reviews.length > 0
    ? reviews.map((r) => ({
        name: r.user?.name || r.name || 'Anonymous',
        role: 'Student',
        rating: r.rating || 5,
        text: r.comment || r.review || r.text || '',
        avatar: (r.user?.name || r.name || 'A').charAt(0).toUpperCase(),
        course: r.course?.title || '',
      }))
    : staticTestimonials;

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom py-20 lg:py-32 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl text-center mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <FiMessageSquare className="w-4 h-4 text-accent" />
              What Students Say
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Student <span className="text-accent">Testimonials</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Hear from our students about their learning experience and how our courses have helped them achieve their goals.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 flex flex-col">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className={`w-4 h-4 ${j < t.rating ? 'text-accent fill-accent' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm italic flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}{t.course ? ` - ${t.course}` : ''}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-6">Trusted by Students Worldwide</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} className="w-5 h-5 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">4.9 out of 5 based on 500+ reviews</p>
                </div>
                {[
                  { label: '5 stars', pct: 85 },
                  { label: '4 stars', pct: 10 },
                  { label: '3 stars', pct: 3 },
                  { label: '2 stars', pct: 1 },
                  { label: '1 star', pct: 1 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-12">{item.label}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="bg-accent h-3 rounded-full" />
                    </div>
                    <span className="text-sm text-gray-500 w-10 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-3xl p-8 text-center">
              <div className="text-6xl font-bold text-primary-600 mb-2">5,000+</div>
              <div className="text-gray-500 mb-6">Happy Students</div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '95%', label: 'Recommend Us' },
                  { value: '92%', label: 'Would Re-enroll' },
                  { value: '4.9', label: 'Avg Rating' },
                  { value: '98%', label: 'Completion Rate' },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-secondary rounded-xl p-4 shadow-sm">
                    <div className="text-xl font-bold text-primary-600">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-3xl lg:text-4xl font-bold mb-4">
            Join Our Community
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">
            Start your English learning journey and become our next success story.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/courses" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
              Explore Courses <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
