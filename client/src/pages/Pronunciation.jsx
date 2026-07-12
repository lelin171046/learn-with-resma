import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiVolume2, FiMic, FiHeadphones, FiCheckCircle, FiPlay } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: FiVolume2, title: 'Phonetics', desc: 'Learn the International Phonetic Alphabet (IPA) and master individual English sounds with mouth positioning guides.' },
  { icon: FiMic, title: 'Intonation', desc: 'Master the rise and fall patterns of English to convey meaning, emotion, and grammatical function naturally.' },
  { icon: FiHeadphones, title: 'Stress Patterns', desc: 'Understand word stress, sentence stress, and rhythm to sound more natural and be better understood.' },
];

const phonemeGroups = [
  { group: 'Vowels', sounds: ['/iː/', '/ɪ/', '/e/', '/æ/', '/ɑː/', '/ɒ/', '/ɔː/', '/ʊ/', '/uː/', '/ʌ/', '/ɜː/', '/ə/'], count: 12 },
  { group: 'Consonants', sounds: ['/p/', '/b/', '/t/', '/d/', '/k/', '/g/', '/f/', '/v/', '/θ/', '/ð/', '/s/', '/z/'], count: 24 },
  { group: 'Diphthongs', sounds: ['/eɪ/', '/aɪ/', '/ɔɪ/', '/əʊ/', '/aʊ/', '/ɪə/', '/eə/', '/ʊə/'], count: 8 },
];

const practiceLessons = [
  { title: 'Minimal Pairs: Ship vs Sheep', desc: 'Distinguish between similar sounds with paired word practice', level: 'Beginner' },
  { title: 'TH Sounds: Think vs Think', desc: 'Master the difficult th sounds with guided exercises', level: 'Intermediate' },
  { title: 'Word Stress Patterns', desc: 'Learn where to place stress in multi-syllable words', level: 'All Levels' },
  { title: 'Connected Speech', desc: 'Understand how words link together in natural conversation', level: 'Advanced' },
  { title: 'Rhythm and Intonation', desc: 'Master the musical patterns of English sentences', level: 'Intermediate' },
  { title: 'American vs British', desc: 'Compare pronunciation differences between major accents', level: 'All Levels' },
];

export default function Pronunciation() {
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
              <FiVolume2 className="w-4 h-4 text-accent" />
              Perfect Your Pronunciation
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              English <span className="text-accent">Pronunciation</span> Program
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg">
              Sound like a native speaker with our comprehensive pronunciation training. Master phonetics, intonation, stress patterns, and connected speech through interactive audio exercises.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/courses?category=pronunciation" className="btn-accent flex items-center gap-2 w-fit">
                Start Pronunciation Training <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            Core Pronunciation Skills
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Three pillars of clear and natural English pronunciation
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
            Sound Chart
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Learn the sounds of English with our interactive phonetic guide
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6">
            {phonemeGroups.map((group, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                  <span>{group.group}</span>
                  <span className="text-sm text-gray-500 font-normal">{group.count} sounds</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.sounds.map((sound, j) => (
                    <button key={j} className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-primary-600 font-mono text-sm hover:bg-primary-100 dark:hover:bg-primary-800/30 transition-colors">
                      {sound}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            Audio Practice Lessons
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Interactive lessons with audio playback for hands-on practice
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceLessons.map((lesson, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${lesson.level === 'Advanced' ? 'bg-red-50 text-red-600' : lesson.level === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>{lesson.level}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{lesson.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{lesson.desc}</p>
                <button className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:underline">
                  <FiPlay className="w-4 h-4" /> Listen & Practice
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
              <h2 className="text-3xl font-bold mb-6">Why Pronunciation Matters</h2>
              <div className="space-y-4">
                {[
                  'Clear pronunciation makes you instantly more understandable',
                  'Reduces misunderstandings in professional and social situations',
                  'Builds confidence in speaking situations',
                  'Essential for IELTS Speaking band score improvement',
                  'Helps with listening comprehension through sound awareness',
                  'Makes English feel more natural and enjoyable to speak',
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
                  <FiVolume2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Practice Progress</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Sound Recognition', pct: 90 },
                  { label: 'Word Stress Accuracy', pct: 78 },
                  { label: 'Sentence Rhythm', pct: 72 },
                  { label: 'Overall Clarity', pct: 85 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.label}</span>
                      <span className="font-semibold text-primary-600">{item.pct}%</span>
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
            Sound Like a Native Speaker
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">
            Master every sound of English and speak with clarity, confidence, and natural rhythm.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/courses?category=pronunciation" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
              Start Pronunciation Program <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
