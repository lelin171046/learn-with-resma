import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { blogService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ImageUploader from '../../components/shared/ImageUploader';

const emptyForm = { title: '', content: '', excerpt: '', thumbnail: '', tags: '', isPublished: false };

export default function ManageBlog() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => blogService.getAllAdmin().then((d) => d.data),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => blogService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog post created');
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog post updated');
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog post deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const togglePublishedMutation = useMutation({
    mutationFn: (id) => blogService.togglePublished(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Publish status updated');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const blogs = data?.blogs || data || [];

  const startEdit = (blog) => {
    setEditingId(blog._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Blog</h1>
          <p className="text-gray-500 mt-1">{blogs.length} blog posts</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn-accent flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> New Post
        </button>
      </motion.div>

      {showForm && (
        <BlogForm
          editingId={editingId}
          blogs={blogs}
          onSubmit={(formData) => editingId ? updateMutation.mutate({ id: editingId, data: formData }) : createMutation.mutate(formData)}
          onCancel={() => { setEditingId(null); setShowForm(false); }}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="space-y-3">
        {blogs.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">No blog posts yet</div>
        ) : blogs.map((blog, i) => (
          <motion.div key={blog._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card p-5">
            <div className="flex items-center gap-4">
              <img src={blog.thumbnail || 'https://placehold.co/80x60/e2e8f0/94a3b8?text=Blog'} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">{blog.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{blog.excerpt || blog.content?.slice(0, 100)}</p>
                {blog.tags && <p className="text-xs text-gray-400 mt-1">Tags: {Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublishedMutation.mutate(blog._id)} className={`p-1.5 rounded-lg ${blog.isPublished ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`} title={blog.isPublished ? 'Published' : 'Draft'}>
                  {blog.isPublished ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(blog)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (window.confirm('Delete this post?')) deleteMutation.mutate(blog._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BlogForm({ editingId, blogs, onSubmit, onCancel, isPending }) {
  const blog = editingId ? blogs.find((b) => b._id === editingId) : null;
  const [form, setForm] = useState(
    blog ? { title: blog.title || '', content: blog.content || '', excerpt: blog.excerpt || '', thumbnail: blog.thumbnail || '', tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''), isPublished: blog.isPublished || false } : emptyForm
  );

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    onSubmit({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Post' : 'New Post'}</h2>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <input value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} className="input-field" placeholder="Short description" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea value={form.content} onChange={(e) => update('content', e.target.value)} rows={8} className="input-field" placeholder="Blog content..." />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <ImageUploader value={form.thumbnail} onChange={(url) => update('thumbnail', url)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => update('tags', e.target.value)} className="input-field" placeholder="english, tips, grammar" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => update('isPublished', e.target.checked)} className="rounded" /> Published
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={isPending} className="btn-accent">{isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
        </div>
      </form>
    </motion.div>
  );
}
