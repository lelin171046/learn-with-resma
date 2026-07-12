import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiAward, FiBookOpen } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const stories = [
  {
    name: 'Fatima Rahman',
    avatar: 'F',
    before: 'Struggled with basic grammar and could not speak English confidently',
    after: 'Scored Band 8.0 in IELTS and now works as an international correspondent',
    testimonial: 'Learn With Resma completely transformed my English. The structured curriculum and personalized feedback helped me go from barely passing to excelling in just 6 months.',
    course: 'IELTS Preparation Masterclass',
    score: '8.0',
  },
  {
    name: 'Ahmed Hassan',
    avatar: 'A',
    before: 'Could not construct proper essays for university applications',
    after: 'Accepted into a top UK university with a scholarship',
    testimonial: 'The writing program was exactly what I needed. My instructor helped me develop a structured approach to essay writing that impressed the admissions committee.',
    course: 'English Writing Mastery',
    score: '7.5',
  },
  {
    name: 'Sarah Kim',
    avatar: 'S',
    before: 'Pronunciation difficulties that affected her professional presentations',
    after: 'Now conducts international business meetings in English',
    testimonial: 'The pronunciation course gave me the tools to sound more natural and confident. My colleagues noticed the improvement within weeks.',
    course: 'Pronunciation Perfection',
    score: 'Native-like',
  },
  {
    name: 'Omar Al-Rashid',
    avatar: 'O',
    before: 'Failed IELTS twice with Band 5.5',
    after: 'Achieved Band 7.5 and moved to Canada',
    testimonial: 'After failing twice, I almost gave up. The IELTS program at Learn With Resma gave me the strategies and confidence I needed. Best investment I ever made.',
    course: 'IELTS Preparation Masterclass',
    score: '7.5',
  },
  {
    name: 'Priya Sharma',
    avatar: 'P',
    before: 'Shy and hesitant to speak English in any social setting',
    after: 'Won a public speaking competition at her university',
    testimonial: 'The speaking program built my confidence step by step. The daily challenges pushed me out of my comfort zone in the best way possible.',
    course: 'English Speaking Program',
    score: 'Advanced',
  },
  {
    name: 'Yusuf Kabir',
    avatar: 'Y',
    before: 'Could not understand native English speakers in movies or lectures',
    after: 'Now watches English content without subtitles and aces listening exams',
    testimonial: 'The listening program trained my ears to catch every word. The variety of accents and exercises made learning enjoyable and effective.',
    course: 'Listening Skills Mastery',
    score: 'Band 8.5',
  },
];

export default function SuccessStories() {
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
              <FiAward className="w-4 h-4 text-accent" />
              Inspiring Results
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Success <span className="text-accent">Stories</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Real transformations from real students. See how our courses have helped learners achieve their English language goals and change their lives.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-secondary border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiAward, value: '5,000+', label: 'Students Worldwide' },
              { icon: FiStar, value: '95%', label: 'Satisfaction Rate' },
              { icon: FiBookOpen, value: '2,000+', label: 'Courses Completed' },
              { icon: FiAward, value: '4.9/5', label: 'Average Rating' },
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

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                    {story.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold">{story.name}</h3>
                    <span className="text-xs text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-full">{story.course}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-3">
                    <span className="text-xs font-medium text-red-600 block mb-1">Before</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{story.before}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3">
                    <span className="text-xs font-medium text-green-600 block mb-1">After</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{story.after}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                  <span className="text-sm font-medium text-gray-600 ml-1">{story.score}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm italic flex-1">"{story.testimonial}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-3xl lg:text-4xl font-bold mb-4">
            Your Success Story Starts Here
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of students who have transformed their English skills. Your story could be next.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/courses" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
              Start Your Journey <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
