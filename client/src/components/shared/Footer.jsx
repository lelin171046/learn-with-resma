import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const footerLinks = {
  Programs: [
    { name: 'IELTS Preparation', path: '/ielts-program' },
    { name: 'English Speaking', path: '/english-speaking' },
    { name: 'Writing Program', path: '/writing-program' },
    { name: 'Listening Program', path: '/listening-program' },
    { name: 'Pronunciation', path: '/pronunciation' },
  ],
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Success Stories', path: '/success-stories' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'FAQ', path: '/faq' },
  ],
  Support: [
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-lg">L</div>
              <span className="text-xl font-bold">Learn With <span className="text-primary-400">Resma</span></span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">Master English with Confidence. Professional English language courses for speaking, writing, listening, pronunciation, and IELTS preparation.</p>
            <div className="flex items-center gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-400 hover:text-primary-400 transition-colors text-sm">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Learn With Resma. All rights reserved.</p>
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <span className="flex items-center gap-2"><FiMail className="w-4 h-4" /> info@learnwithresma.com</span>
            <span className="flex items-center gap-2"><FiPhone className="w-4 h-4" /> +880 1XXXXXXXXX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
