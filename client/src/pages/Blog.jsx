import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiUser, FiBookOpen } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '../services/services';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Blog() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll().then((d) => d.data),
  });

  const blogs = data?.blogs || data || [];

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
              <FiBookOpen className="w-4 h-4 text-accent" />
              English Learning Blog
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Our <span className="text-accent">Blog</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Tips, strategies, and insights to accelerate your English learning journey. Stay updated with the latest articles from our expert instructors.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load blogs. Please try again later.</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <motion.div key={blog._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blog/${blog.slug}`} className="card group block h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.thumbnail || blog.image || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Blog'}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {blog.category && (
                        <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        {blog.author && (
                          <span className="flex items-center gap-1">
                            <FiUser className="w-3 h-3" /> {blog.author?.name || blog.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                        {blog.excerpt || blog.description || blog.content?.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
                      </p>
                      <span className="text-primary-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <FiArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
