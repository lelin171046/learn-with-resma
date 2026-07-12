import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronDown, FiHelpCircle } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const faqs = [
  {
    category: 'Courses',
    question: 'What courses are available on Learn With Resma?',
    answer: 'We offer comprehensive courses in English Speaking, Writing, Listening, Pronunciation, and IELTS Preparation. Each course includes video lessons, quizzes, assignments, and certificates upon completion.',
  },
  {
    category: 'Courses',
    question: 'How long do I have access to a course after enrollment?',
    answer: 'Once you enroll in a course, you get lifetime access to all course materials, including any future updates. You can learn at your own pace and revisit lessons anytime.',
  },
  {
    category: 'Courses',
    question: 'Are the courses suitable for beginners?',
    answer: 'Yes! Our courses cater to all levels from beginner to advanced. Each course clearly states the required level, and we have structured learning paths to guide you from where you are to where you want to be.',
  },
  {
    category: 'Courses',
    question: 'Do I receive a certificate after completing a course?',
    answer: 'Yes, upon successfully completing all lessons and assessments in a course, you receive a verified digital certificate. This certificate includes a unique verification ID that can be checked on our website.',
  },
  {
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express) through our secure Stripe payment gateway. We also support local payment methods depending on your region.',
  },
  {
    category: 'Payment',
    question: 'Is there a refund policy?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you are not satisfied with a course within 30 days of enrollment, you can request a full refund through your dashboard or by contacting support.',
  },
  {
    category: 'Payment',
    question: 'Are there any free courses or trials available?',
    answer: 'Yes, we offer several free courses and a free MCQ practice section. You can also preview course content before enrolling. Check our courses page for free options.',
  },
  {
    category: 'Learning',
    question: 'How much time should I dedicate to learning each week?',
    answer: 'We recommend 3-5 hours per week for optimal progress, but you can learn at your own pace. The platform tracks your progress so you can pick up right where you left off.',
  },
  {
    category: 'Learning',
    question: 'Can I interact with the instructor?',
    answer: 'Yes, each course has a comments section where you can ask questions and interact with the instructor and fellow students. Live classes are also available for select courses.',
  },
  {
    category: 'Learning',
    question: 'Is there a community or forum for students?',
    answer: 'Yes, we have an active student community where you can connect with fellow learners, share progress, practice together, and participate in challenges and discussions.',
  },
  {
    category: 'Technical',
    question: 'What devices can I use to access the courses?',
    answer: 'Our platform is fully responsive and works on desktops, laptops, tablets, and smartphones. All you need is a stable internet connection and a modern web browser.',
  },
  {
    category: 'Technical',
    question: 'How do I verify a certificate?',
    answer: 'Each certificate has a unique verification ID. Go to our Verify Certificate page, enter the ID, and you\'ll see the certificate details including student name, course name, and completion date.',
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a secure link to reset your password. The link expires after 1 hour for security.',
  },
  {
    category: 'Account',
    question: 'Can I change my account email or name?',
    answer: 'Yes, you can update your profile information from your dashboard Settings page. Email changes require verification through the new email address.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(faqs.map((f) => f.category))];
  const filteredFaqs = filter === 'All' ? faqs : faqs.filter((f) => f.category === filter);

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
              <FiHelpCircle className="w-4 h-4 text-accent" />
              Help Center
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Frequently Asked <span className="text-accent">Questions</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Find answers to the most common questions about our courses, payments, and learning experience.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-xs text-primary-600 font-medium">{faq.category}</span>
                      <h3 className="font-semibold text-lg mt-1">{faq.question}</h3>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
                      <FiChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom text-center">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-2xl font-bold mb-4">
            Still Have Questions?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="text-gray-500 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Us <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
