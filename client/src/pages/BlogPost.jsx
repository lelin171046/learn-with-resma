import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiBookOpen, FiShare2 } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '../services/services';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function BlogPost() {
  const { slug } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getBySlug(slug).then((d) => d.data),
    enabled: !!slug,
  });

  const blog = data?.blog || data;

  const { data: blogsData } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll().then((d) => d.data),
  });

  const allBlogs = blogsData?.blogs || blogsData || [];
  const relatedPosts = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="section-padding">
          <div className="container-custom max-w-4xl mx-auto space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-500 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
            <FiArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom py-12 relative z-10">
          <Link to="/blog" className="text-white/80 hover:text-white flex items-center gap-2 transition-colors mb-8 inline-flex">
            <FiArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl">
            {blog.category && (
              <span className="inline-block bg-accent/20 text-accent text-sm font-medium px-3 py-1 rounded-full mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              {blog.author && (
                <span className="flex items-center gap-1">
                  <FiUser className="w-4 h-4" /> {blog.author?.name || blog.author}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button className="flex items-center gap-1 hover:text-white transition-colors ml-auto">
                <FiShare2 className="w-4 h-4" /> Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {blog.thumbnail && (
        <div className="container-custom -mt-8 relative z-10">
          <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-xl" />
        </div>
      )}

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, i) => (
                    <span key={i} className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="container-custom">
            <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
              Related Posts
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((post, i) => (
                <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blog/${post.slug}`} className="card group block h-full">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={post.thumbnail || post.image || 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Blog'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
