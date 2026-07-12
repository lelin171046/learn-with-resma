import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeadphones, FiBookOpen, FiEdit3, FiCheckCircle, FiPlay, FiVolume2, FiMic } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: FiBookOpen, title: 'Comprehension', desc: 'Develop deep understanding of spoken English through structured listening exercises across various accents and speeds.' },
  { icon: FiEdit3, title: 'Note-taking', desc: 'Master effective note-taking strategies for lectures, meetings, and academic listening tasks with shorthand techniques.' },
  { icon: FiMic, title: 'Accent Training', desc: 'Recognize and understand British, American, Australian, and other English accents through targeted listening practice.' },
];

const exercises = [
  { title: 'Podcast Comprehension', desc: 'Listen to English podcasts and answer comprehension questions', level: 'All Levels', duration: '20 min' },
  { title: 'Dictation Practice', desc: 'Type exactly what you hear in short audio clips', level: 'Beginner', duration: '15 min' },
  { title: 'Lecture Summaries', desc: 'Summarize academic lectures in your own words', level: 'Advanced', duration: '30 min' },
  { title: 'Song Fill-in-the-Blanks', desc: 'Complete song lyrics by listening carefully to music', level: 'Beginner', duration: '10 min' },
  { title: 'News Report Analysis', desc: 'Analyze BBC/CNN news reports for key information', level: 'Intermediate', duration: '25 min' },
  { title: 'Movie Clip Discussion', desc: 'Watch movie scenes and discuss themes and dialogue', level: 'All Levels', duration: '20 min' },
];

export default function ListeningProgram() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom py-20 lg:py-32 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <FiHeadphones className="w-4 h-4 text-accent" />
              Train Your Ears
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              English <span className="text-accent">Listening</span> Program
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg">
              Sharpen your listening skills with authentic English audio materials. From everyday conversations to academic lectures, train your ears to understand every word.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/courses?category=listening" className="btn-accent flex items-center gap-2 w-fit">
                Start Listening Training <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            Core Listening Skills
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Build a comprehensive listening toolkit
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            Practice Exercises
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Engage with diverse listening exercises designed to improve every aspect of comprehension
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((ex, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${ex.level === 'Advanced' ? 'bg-red-50 text-red-600' : ex.level === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>{ex.level}</span>
                  <span className="text-xs text-gray-500">{ex.duration}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{ex.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{ex.desc}</p>
                <button className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:underline">
                  <FiPlay className="w-4 h-4" /> Start Exercise
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-6">Why Listening Skills Matter</h2>
              <div className="space-y-4">
                {[
                  'Listening accounts for 30% of most English proficiency exams',
                  'Better listeners become better communicators in conversations',
                  'Understanding native speakers requires trained listening skills',
                  'Academic success depends on understanding lectures and discussions',
                  'Workplace effectiveness requires following meetings and instructions',
                  'Cultural understanding comes through listening to authentic materials',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeadphones className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Audio Levels</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Beginner', desc: 'Slow, clear speech', pct: 33 },
                  { label: 'Intermediate', desc: 'Natural pace, common accents', pct: 66 },
                  { label: 'Advanced', desc: 'Fast speech, multiple accents', pct: 100 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-gray-500 text-xs">{item.desc}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="bg-primary-600 h-2 rounded-full" />
                    </div>
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
            Train Your Ears Today
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">
            Start your listening journey and understand English like never before.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/courses?category=listening" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
              Start Listening Program <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
