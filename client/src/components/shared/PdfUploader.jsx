import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFile, FiUploadCloud, FiX, FiLoader, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadService } from '../../services/services';

export default function PdfUploader({ value, onChange, label = 'Upload PDF', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Only PDF files are allowed');
    if (file.size > 20 * 1024 * 1024) return toast.error('Max file size is 20MB');

    setFileName(file.name);
    setUploading(true);
    try {
      const res = await uploadService.pdf(file);
      onChange({ url: res.data.url, publicId: res.data.publicId, title: file.name.replace(/\.pdf$/i, '') });
      toast.success('PDF uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      setFileName('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setFileName('');
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
              <FiFile className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{value.title || fileName || 'Document.pdf'}</p>
              {value.url && (
                <a href={value.url} target="_blank" rel="noreferrer" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                  <FiDownload className="w-3 h-3" /> View / Download
                </a>
              )}
            </div>
            <button type="button" onClick={handleRemove} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer">
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !uploading && inputRef.current?.click()}
            className="w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {uploading ? (
              <FiLoader className="w-5 h-5 text-primary-500 animate-spin" />
            ) : (
              <>
                <FiUploadCloud className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-xs text-gray-400">(PDF, max 20MB)</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}
