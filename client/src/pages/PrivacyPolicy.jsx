import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, enroll in courses, make a payment, or contact us. This includes your name, email address, password, payment information, and any other information you choose to provide. We automatically collect certain information when you visit our platform, including your IP address, browser type, operating system, referring URLs, pages viewed, and the date/time of your visit.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, communicate with you about products, services, and events, monitor and analyze trends and usage, detect and prevent fraud, and personalize your experience on our platform.`,
  },
  {
    title: 'Cookies and Tracking Technologies',
    content: `We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.`,
  },
  {
    title: 'Data Sharing and Disclosure',
    content: `We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.`,
  },
  {
    title: 'Data Security',
    content: `We implement a variety of security measures to maintain the safety of your personal information. Your personal data is stored in secured networks and is only accessible by a limited number of authorized personnel who have special access rights. All sensitive information supplied is transmitted via Secure Socket Layer (SSL) technology and encrypted into our payment gateway providers' database.`,
  },
  {
    title: 'Data Retention',
    content: `We retain your personal information for as long as your account is active or as needed to provide you services. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. If you wish to cancel your account or request that we no longer use your information, please contact us.`,
  },
  {
    title: 'Your Rights (GDPR Compliance)',
    content: `If you are a resident of the European Economic Area (EEA), you have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal data. You have the right to access, update, or delete your personal information, the right of rectification, the right to object, the right of restriction, the right to data portability, and the right to withdraw consent.`,
  },
  {
    title: 'Children\'s Privacy',
    content: `Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information. If you become aware that a child has provided us with personal information, please contact us.`,
  },
  {
    title: 'Third-Party Services',
    content: `Our platform may contain links to third-party websites or services that are not owned or controlled by Learn With Resma. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We strongly advise you to review the privacy policy of every site you visit.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this page. You are advised to review this Privacy Policy periodically for any changes.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy, please contact us at support@learnwithresma.com or through our contact page. We are committed to working with you to resolve any complaints about our collection or use of your personal information.`,
  },
];

export default function PrivacyPolicy() {
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
              <FiShield className="w-4 h-4 text-accent" />
              Legal
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Privacy <span className="text-accent">Policy</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </motion.p>
            <motion.p variants={fadeUp} className="text-white/60 text-sm">
              Last updated: January 1, 2025
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
              At Learn With Resma, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our platform.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">
              If you have any questions about our Privacy Policy, please don't hesitate to contact us.
            </p>
            <Link to="/contact" className="text-primary-600 font-medium hover:underline flex items-center justify-center gap-1">
              Contact Us <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
