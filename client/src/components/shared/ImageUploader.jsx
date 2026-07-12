import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiImage, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadService } from '../../services/services';

export default function ImageUploader({ value, onChange, folder = 'learn-with-resma/images', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Only images are allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('Max file size is 5MB');

    setUploading(true);
    try {
      const res = await uploadService.single(file, folder);
      onChange(res.data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative group">
            <img src={value} alt="Uploaded" className="w-full h-40 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-white/90 text-gray-800 text-xs font-medium rounded-lg hover:bg-white cursor-pointer">Replace</button>
              <button type="button" onClick={() => { onChange(''); }} className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 cursor-pointer">Remove</button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
          >
            {uploading ? (
              <FiLoader className="w-8 h-8 text-primary-500 animate-spin" />
            ) : (
              <>
                <FiUploadCloud className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Click or drag an image here</span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}
