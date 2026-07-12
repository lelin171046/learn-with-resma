import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMic, FiMessageCircle, FiVolume2, FiUsers, FiCheckCircle, FiCalendar, FiStar } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: FiMic, title: 'Fluency Training', desc: 'Develop natural speech flow with daily speaking exercises and tongue twisters designed to build muscle memory.' },
  { icon: FiStar, title: 'Build Confidence', desc: 'Overcome speaking anxiety with guided practice sessions and supportive peer feedback in a safe environment.' },
  { icon: FiVolume2, title: 'Pronunciation', desc: 'Master the sounds of English with phonetic drills, stress patterns, and intonation practice.' },
  { icon: FiMessageCircle, title: 'Conversation Practice', desc: 'Engage in real-world conversations covering daily topics, interviews, presentations, and debates.' },
];

const dailyChallenges = [
  { day: 'Monday', challenge: 'Describe your favorite place in 2 minutes without pausing', duration: '15 min' },
  { day: 'Tuesday', challenge: 'Record yourself reading a news article and compare with the original', duration: '20 min' },
  { day: 'Wednesday', challenge: 'Role-play a job interview with a partner or AI assistant', duration: '25 min' },
  { day: 'Thursday', challenge: 'Explain a complex topic to a 5-year-old in simple English', duration: '10 min' },
  { day: 'Friday', challenge: 'Debate a controversial topic and present both sides', duration: '30 min' },
  { day: 'Saturday', challenge: 'Tell a story using 10 random vocabulary words', duration: '15 min' },
  { day: 'Sunday', challenge: 'Record a podcast episode about your week', duration: '20 min' },
];

export default function SpeakingProgram() {
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
              <FiMic className="w-4 h-4 text-accent" />
              Speak English Confidently
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              English <span className="text-accent">Speaking</span> Program
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg">
              Transform from a hesitant speaker to a confident communicator. Our speaking program focuses on fluency, pronunciation, and real-world conversation skills.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/courses?category=speaking" className="btn-accent flex items-center gap-2 w-fit">
                Start Speaking Today <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-secondary border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, value: '1,500+', label: 'Active Speakers' },
              { icon: FiMic, value: '50+', label: 'Speaking Topics' },
              { icon: FiCalendar, value: '30', label: 'Day Challenges' },
              { icon: FiStar, value: '4.9', label: 'Student Rating' },
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
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            What You'll Master
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Four pillars of confident English speaking
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Daily Speaking Challenges
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Build a daily speaking habit with fun and engaging challenges
          </motion.p>
          <div className="max-w-3xl mx-auto space-y-4">
            {dailyChallenges.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold text-sm">{item.day.slice(0, 3)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{item.challenge}</h4>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FiCalendar className="w-3 h-3" /> {item.duration}
                  </span>
                </div>
                <FiCheckCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-6">Your Speaking Journey</h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Foundation', desc: 'Build basic vocabulary and sentence structures for everyday conversations.' },
                  { step: '02', title: 'Practice', desc: 'Engage in guided speaking sessions with feedback and correction.' },
                  { step: '03', title: 'Fluency', desc: 'Develop speed and natural rhythm through daily speaking challenges.' },
                  { step: '04', title: 'Mastery', desc: 'Express complex ideas confidently in any situation.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-primary-600 mb-2">90%</div>
                  <div className="text-gray-500">of students report improved fluency</div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Daily Practice Rate', value: 85 },
                    { label: 'Student Satisfaction', value: 95 },
                    { label: 'Would Recommend', value: 92 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold text-primary-600">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="bg-primary-600 h-2 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Find Your Voice?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">
            Start your speaking journey today and unlock the confident English speaker within you.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/courses?category=speaking" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
              Begin Speaking Program <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
