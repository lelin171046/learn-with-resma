import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const emptyForm = { name: '', description: '', icon: '' };

export default function ManageCategories() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryService.getAll().then((d) => d.data),
  });

  const createMutation = useMutation({
    mutationFn: (formData) => categoryService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category created');
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category updated');
      setEditingId(null);
      setShowForm(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  if (isLoading) return <LoadingSpinner />;

  const categories = data?.categories || data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formData = { name: form.get('name'), description: form.get('description'), icon: form.get('icon') };
    if (!formData.name.trim()) return toast.error('Name is required');
    editingId ? updateMutation.mutate({ id: editingId, data: formData }) : createMutation.mutate(formData);
    e.target.reset();
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Categories</h1>
          <p className="text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} className="btn-accent flex items-center gap-2">
          <FiPlus className="w-4 h-4" /> New Category
        </button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">{editingId ? 'Edit Category' : 'New Category'}</h2>
            <button onClick={() => { setEditingId(null); setShowForm(false); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input name="name" defaultValue={editingId ? categories.find((c) => c._id === editingId)?.name : ''} required className="input-field" placeholder="Category name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input name="description" defaultValue={editingId ? categories.find((c) => c._id === editingId)?.description : ''} className="input-field" placeholder="Short description" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon (emoji or text)</label>
              <input name="icon" defaultValue={editingId ? categories.find((c) => c._id === editingId)?.icon : ''} className="input-field" placeholder="📚" />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-accent">
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setEditingId(null); setShowForm(false); }} className="px-4 py-2 rounded-lg border dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="card p-12 text-center text-gray-400 col-span-full">No categories yet</div>
        ) : categories.map((cat, i) => (
          <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                <div>
                  <h3 className="font-bold">{cat.name}</h3>
                  {cat.description && <p className="text-sm text-gray-500 mt-1">{cat.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><FiEdit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (window.confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate(cat._id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
