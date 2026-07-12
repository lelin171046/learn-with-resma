import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFileText } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing and using the Learn With Resma platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our platform. These Terms of Service apply to all users of the site, including browsers, vendors, customers, merchants, and contributors of content.',
  },
  {
    title: 'Account Terms',
    content: 'You must be at least 13 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms.',
  },
  {
    title: 'Course Enrollment and Access',
    content: 'When you enroll in a paid course, you are granted a non-exclusive, non-transferable license to access and view the course content for personal, non-commercial use. Course access is granted upon successful payment confirmation. You may not share, distribute, or resell course materials. Lifetime access means access for the lifetime of the course on our platform.',
  },
  {
    title: 'Payment Terms',
    content: 'All payments are processed through our secure payment gateway (Stripe). Prices are displayed in USD unless otherwise indicated. By making a payment, you authorize us to charge the applicable fees to your chosen payment method. All sales are subject to our refund policy. We reserve the right to change pricing at any time with reasonable notice.',
  },
  {
    title: 'Refund Policy',
    content: 'We offer a 30-day money-back guarantee on course purchases. To request a refund, you must contact us within 30 days of your purchase date. Refund requests submitted after 30 days will not be processed. Free courses and promotional enrollments are not eligible for refunds. Refunds will be processed to the original payment method within 5-10 business days.',
  },
  {
    title: 'Intellectual Property',
    content: 'All content on the Learn With Resma platform, including text, graphics, logos, images, audio clips, video, digital downloads, and software, is the property of Learn With Resma or its content suppliers and protected by international copyright laws. Course content, including videos, documents, quizzes, and certificates, is proprietary and may not be reproduced, distributed, or transmitted without prior written permission.',
  },
  {
    title: 'User-Generated Content',
    content: 'By posting comments, reviews, or other content on our platform, you grant us a non-exclusive, royalty-free, perpetual, irrevocable right to use, reproduce, modify, publish, and distribute such content. You represent that your content does not violate the rights of any third party and that you have all necessary rights to grant this license.',
  },
  {
    title: 'Prohibited Activities',
    content: 'You agree not to: use the platform for any unlawful purpose; attempt to gain unauthorized access to any portion of the platform; interfere with or disrupt the platform; use automated systems to access the platform; share account credentials with others; download or copy course content for distribution; or engage in any activity that could damage, disable, or impair the platform.',
  },
  {
    title: 'Limitation of Liability',
    content: 'Learn With Resma shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform. Our total liability for any claims related to the platform shall not exceed the amount you paid us in the twelve months preceding the claim. We do not guarantee specific results from our courses or programs.',
  },
  {
    title: 'Dispute Resolution',
    content: 'Any disputes arising from these terms shall first be attempted to be resolved through informal negotiation. If informal resolution fails, disputes shall be submitted to binding arbitration in accordance with applicable arbitration rules. The arbitration shall be conducted in English and the decision shall be final and binding. Either party may seek injunctive relief in a court of competent jurisdiction.',
  },
  {
    title: 'Modifications to Terms',
    content: 'We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on the platform. Your continued use of the platform after any modifications indicates your acceptance of the updated terms. We will notify registered users of significant changes via email.',
  },
  {
    title: 'Governing Law',
    content: 'These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions. Any legal proceedings arising out of or relating to these Terms shall be brought exclusively in the courts of competent jurisdiction.',
  },
];

export default function TermsConditions() {
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
              <FiFileText className="w-4 h-4 text-accent" />
              Legal
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Terms & <span className="text-accent">Conditions</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Please read these terms and conditions carefully before using our platform.
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
              Welcome to Learn With Resma. These Terms of Service govern your use of our platform, courses, and services. By using our platform, you agree to these terms in full.
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
              If you have any questions about these Terms & Conditions, please contact us.
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
