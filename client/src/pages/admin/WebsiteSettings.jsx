import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiGlobe, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { settingsService } from '../../services/services';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function WebsiteSettings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.get().then((res) => setForm(res.data.settings)).catch(() => {
      setForm({
        siteName: 'Learn With Resma', tagline: 'Master English with Confidence',
        contactEmail: '', phone: '', address: '',
        facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '',
        logo: '', favicon: '', footerText: '', metaDescription: '',
      });
    });
  }, []);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.update(form);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Website Settings</h1>
        <p className="text-gray-500 mt-1">Configure your website details</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
            <FiGlobe className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg">General</h2>
        </div>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Site Name</label>
              <input value={form.siteName || ''} onChange={(e) => update('siteName', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tagline</label>
              <input value={form.tagline || ''} onChange={(e) => update('tagline', e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Contact Email</label>
              <input type="email" value={form.contactEmail || ''} onChange={(e) => update('contactEmail', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone</label>
              <input value={form.phone || ''} onChange={(e) => update('phone', e.target.value)} className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Address</label>
            <input value={form.address || ''} onChange={(e) => update('address', e.target.value)} className="input-field" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Logo URL</label>
              <input value={form.logo || ''} onChange={(e) => update('logo', e.target.value)} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Footer Text</label>
              <input value={form.footerText || ''} onChange={(e) => update('footerText', e.target.value)} className="input-field" placeholder="Custom footer text" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Meta Description (SEO)</label>
            <textarea value={form.metaDescription || ''} onChange={(e) => update('metaDescription', e.target.value)} className="input-field" rows={2} placeholder="Description for search engines" />
          </div>

          <hr className="dark:border-gray-700" />

          <h3 className="font-bold">Social Media</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium mb-1.5 capitalize">{platform}</label>
                <input value={form[platform] || ''} onChange={(e) => update(platform, e.target.value)} className="input-field" placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>

          <button type="submit" disabled={saving} className="btn-accent flex items-center gap-2">
            {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
