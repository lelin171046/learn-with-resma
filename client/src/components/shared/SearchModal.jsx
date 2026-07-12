import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchService } from '../../services/services';
import debounce from '../../utils/debounce';

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) { setResults({}); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchService.search(query);
        setResults(data.results);
      } catch { setResults({}); }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
    setQuery('');
    setResults({});
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
          <FiSearch className="w-5 h-5 text-gray-400" />
          <input type="text" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, lessons, blogs..." className="flex-1 bg-transparent outline-none text-lg" />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiX className="w-5 h-5" /></button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          {loading && <p className="text-center text-gray-500 py-4">Searching...</p>}

          {!loading && query && Object.keys(results).length === 0 && (
            <p className="text-center text-gray-500 py-4">No results found</p>
          )}

          {results.courses?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Courses</h3>
              {results.courses.map((c) => (
                <button key={c._id} onClick={() => handleSelect(`/course/${c.slug}`)} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                  <img src={c.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                  <div>
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.isFree ? 'Free' : `$${c.price}`}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.blogs?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Blogs</h3>
              {results.blogs.map((b) => (
                <button key={b._id} onClick={() => handleSelect(`/blog/${b.slug}`)} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-sm">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.excerpt}</p>
                </button>
              ))}
            </div>
          )}

          {results.categories?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Categories</h3>
              {results.categories.map((c) => (
                <button key={c._id} onClick={() => handleSelect(`/courses?category=${c._id}`)} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="font-medium text-sm">{c.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
