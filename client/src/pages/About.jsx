import { motion } from 'framer-motion';
import { FiCheckCircle, FiAward, FiUsers, FiBookOpen, FiGlobe } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-4xl lg:text-5xl font-bold mb-4">About Learn With Resma</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className="text-white/80 max-w-2xl mx-auto text-lg">Master English with Confidence - Your trusted partner in English language education</motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="https://i.ibb.co.com/3mWkM45m/Gemini-Generated-Image-6ahs9h6ahs9h6ahs.png" alt="Resma - Instructor" className="w-full rounded-3xl shadow-xl" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-primary-600 font-semibold text-sm">Your Instructor</span>
              <h2 className="text-3xl font-bold mt-2 mb-6">Resma</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Resma is a dedicated and experienced English language instructor with a passion for teaching and empowering students to achieve fluency. With years of teaching experience spanning multiple English language skills, Resma has helped thousands of students reach their academic and professional goals.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Specializing in English Speaking, Writing, Listening, Pronunciation, and IELTS preparation, Resma brings a unique blend of expertise, warmth, and structured teaching methods that make learning English both effective and enjoyable.
              </p>
              <div className="space-y-3">
                {['English Speaking & Conversation', 'English Writing & Composition', 'Listening Comprehension', 'Pronunciation & Phonetics', 'IELTS Test Preparation'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-subtitle">Making quality English education accessible to everyone</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiGlobe, title: 'Accessible Learning', desc: 'Quality education available to students worldwide, anytime and anywhere.' },
              { icon: FiUsers, title: 'Student-Centered', desc: 'Every course is designed with student success as the top priority.' },
              { icon: FiAward, title: 'Proven Results', desc: '95% of our students achieve their English learning goals.' },
              { icon: FiBookOpen, title: 'Comprehensive', desc: 'Covering all aspects of English from basic to advanced levels.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
