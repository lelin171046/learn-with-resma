import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiEdit3, FiFileText, FiBriefcase, FiBook, FiCheckCircle, FiPenTool } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: FiFileText, title: 'Essay Writing', desc: 'Master structured essay writing with clear thesis statements, coherent arguments, and compelling conclusions.' },
  { icon: FiEdit3, title: 'Grammar Mastery', desc: 'Build a strong grammar foundation covering tenses, conditionals, passive voice, and complex sentence structures.' },
  { icon: FiBriefcase, title: 'Business Writing', desc: 'Professional emails, reports, proposals, and cover letters that make an impact in the workplace.' },
  { icon: FiBook, title: 'Creative Writing', desc: 'Express yourself through storytelling, poetry, and narrative writing with vivid language and imagery.' },
];

const writingSamples = [
  { type: 'Academic Essay', topic: 'The Impact of Technology on Education', words: 450, level: 'Intermediate' },
  { type: 'Business Email', topic: 'Project Proposal to Stakeholders', words: 280, level: 'Advanced' },
  { type: 'Blog Post', topic: '10 Tips for Effective Time Management', words: 650, level: 'Intermediate' },
  { type: 'Report', topic: 'Quarterly Sales Analysis', words: 520, level: 'Advanced' },
  { type: 'Creative Story', topic: 'The Last Train Home', words: 800, level: 'Intermediate' },
  { type: 'Letter of Complaint', topic: 'Defective Product Experience', words: 320, level: 'Beginner' },
];

export default function WritingProgram() {
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
              <FiPenTool className="w-4 h-4 text-accent" />
              Write with Precision
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              English <span className="text-accent">Writing</span> Program
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg">
              From essays to business emails, develop the writing skills you need for academic success and professional growth. Get personalized feedback on every piece you write.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/courses?category=writing" className="btn-accent flex items-center gap-2 w-fit">
                Start Writing Journey <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            Master Every Writing Style
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Comprehensive writing training for every purpose and audience
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
            Writing Samples
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Explore sample writings from our program to see what you'll learn to create
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writingSamples.map((sample, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">{sample.type}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${sample.level === 'Advanced' ? 'bg-red-50 text-red-600' : sample.level === 'Intermediate' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>{sample.level}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{sample.topic}</h4>
                <p className="text-sm text-gray-500">{sample.words} words</p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-primary-600 font-medium cursor-pointer hover:underline">
                    <FiBook className="w-4 h-4" /> Read Sample
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-6">Writing Skills You'll Gain</h2>
              <div className="space-y-4">
                {[
                  'Structure essays with clear introductions, body paragraphs, and conclusions',
                  'Use advanced vocabulary and varied sentence structures',
                  'Write professional business communications with proper tone',
                  'Develop compelling arguments supported by evidence',
                  'Edit and proofread your own work with confidence',
                  'Adapt writing style for different audiences and purposes',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-3xl p-8">
              <div className="bg-white dark:bg-secondary rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="font-mono text-sm space-y-2 text-gray-600 dark:text-gray-400">
                  <p className="text-primary-600 font-semibold">Essay Structure:</p>
                  <p>{'>'} Introduction + Thesis Statement</p>
                  <p>{'>'} Body Paragraph 1 + Evidence</p>
                  <p>{'>'} Body Paragraph 2 + Analysis</p>
                  <p>{'>'} Body Paragraph 3 + Counter-argument</p>
                  <p>{'>'} Conclusion + Summary</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-3xl lg:text-4xl font-bold mb-4">
            Express Yourself Through Writing
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-white/80 mb-8 max-w-xl mx-auto">
            Develop writing skills that open doors in academics, career, and personal expression.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/courses?category=writing" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4">
              Enroll in Writing Program <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
