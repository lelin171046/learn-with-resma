import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeadphones, FiBookOpen, FiEdit3, FiMic, FiCheckCircle, FiClock, FiTarget, FiAward, FiUsers } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const modules = [
  { icon: FiHeadphones, title: 'Listening', desc: 'Master all 4 sections of the IELTS Listening test with real exam practice materials and strategies.' },
  { icon: FiBookOpen, title: 'Reading', desc: 'Develop skimming, scanning, and detailed reading skills for Academic and General Training modules.' },
  { icon: FiEdit3, title: 'Writing', desc: 'Learn Task 1 graph description and Task 2 essay writing with band-scoring criteria focus.' },
  { icon: FiMic, title: 'Speaking', desc: 'Build confidence for all 3 parts of the Speaking test with pronunciation and fluency drills.' },
];

const mockTests = [
  { id: 1, title: 'Mock Test 1 - Academic', duration: '2h 45m', difficulty: 'Medium', sections: 4 },
  { id: 2, title: 'Mock Test 2 - General', duration: '2h 45m', difficulty: 'Medium', sections: 4 },
  { id: 3, title: 'Mock Test 3 - Academic', duration: '2h 45m', difficulty: 'Hard', sections: 4 },
];

export default function IELTSProgram() {
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
              <FiTarget className="w-4 h-4 text-accent" />
              Target Band 7+ Guaranteed
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              IELTS Preparation <span className="text-accent">Program</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg">
              Comprehensive IELTS preparation covering all four modules. Get expert strategies, unlimited practice tests, and personalized feedback to achieve your target band score.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/courses?category=ielts" className="btn-accent flex items-center gap-2">
                Start Preparation <FiArrowRight />
              </Link>
              <Link to="/practice-mcq" className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4" /> Free Practice Test
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-secondary border-b border-gray-100 dark:border-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, value: '2,000+', label: 'Students Prepared' },
              { icon: FiCheckCircle, value: '7.5', label: 'Avg Band Score' },
              { icon: FiClock, value: '100+', label: 'Practice Hours' },
              { icon: FiAward, value: '95%', label: 'Target Achievement' },
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
            Four Modules, One Goal
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Master every section of the IELTS exam with targeted training
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center hover:-translate-y-1 transition-all">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <mod.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">{mod.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            Mock Test Series
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Simulate the real IELTS exam experience with our timed mock tests
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {mockTests.map((test, i) => (
              <motion.div key={test.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">Mock {test.id}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${test.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>{test.difficulty}</span>
                </div>
                <h3 className="font-bold text-lg mb-3">{test.title}</h3>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><FiClock className="w-4 h-4" /> {test.duration}</div>
                  <div className="flex items-center gap-2"><FiBookOpen className="w-4 h-4" /> {test.sections} Sections</div>
                </div>
                <Link to="/practice-mcq" className="mt-4 w-full btn-primary flex items-center justify-center gap-2 text-sm py-2">
                  Start Test <FiArrowRight />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-6">Why Our IELTS Program?</h2>
              <div className="space-y-4">
                {[
                  'Proven strategies for each module to maximize your band score',
                  '100+ hours of video lessons from expert IELTS instructors',
                  'Unlimited mock tests with instant scoring and feedback',
                  'Personalized study plan based on your current level',
                  'Writing and Speaking evaluation by certified examiners',
                  'Lifetime access to all course materials and updates',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-3xl p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary-600 mb-2">7+</div>
                <div className="text-gray-500 mb-6">Average Target Band Score</div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Listening', score: '7.5' },
                    { label: 'Reading', score: '7.5' },
                    { label: 'Writing', score: '7.0' },
                    { label: 'Speaking', score: '7.5' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-secondary rounded-xl p-4 text-center shadow-sm">
                      <div className="text-2xl font-bold text-primary-600">{item.score}</div>
                      <div className="text-xs text-gray-500">{item.label}</div>
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
            Ready to Ace Your IELTS?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of students who achieved their target band score with our proven IELTS preparation program.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/courses?category=ielts" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
              Enroll Now <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


