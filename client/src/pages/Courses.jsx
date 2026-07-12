import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiStar, FiFilter } from 'react-icons/fi';
import { courseService, categoryService } from '../services/services';
import CourseCardSkeleton from '../components/shared/CourseCardSkeleton';

export default function Courses() {
  const [filters, setFilters] = useState({ category: '', level: '', price: '', sort: '' });
  const { data, isLoading } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => courseService.getAll({ ...filters, limit: 12 }).then((d) => d.data),
  });
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.getAll().then((d) => d.data) });

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-4">Our Courses</motion.h1>
          <p className="text-white/80 max-w-xl mx-auto">Explore our comprehensive range of English language courses</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} className="input-field !w-auto">
              <option value="">All Categories</option>
              {categoriesData?.categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={filters.level} onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value }))} className="input-field !w-auto">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select value={filters.price} onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))} className="input-field !w-auto">
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            <select value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))} className="input-field !w-auto">
              <option value="">Newest</option>
              <option value="popular">Popular</option>
              <option value="rating">Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}</div>
          ) : data?.courses?.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No courses found</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.courses?.map((course, i) => (
                <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/course/${course.slug}`} className="card group block">
                    <div className="relative h-48 overflow-hidden">
                      <img src={course.thumbnail || 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Course'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className={course.isFree ? 'badge-free absolute top-3 left-3' : 'badge-paid absolute top-3 left-3'}>{course.isFree ? 'Free' : `$${course.price}`}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span>{course.totalLessons} lessons</span>
                        <span>{course.totalStudents} students</span>
                        <span className="flex items-center gap-1"><FiStar className="w-3 h-3 text-accent" />{course.rating?.toFixed(1) || 'New'}</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded capitalize">{course.level}</span>
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
