const { uploadToCloudinary, deleteFromCloudinary } = require('../services/upload.service');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const { url, publicId } = await uploadToCloudinary(req.file, req.body.folder || 'learn-with-resma/images');
    res.status(201).json({ success: true, url, publicId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }
    const folder = req.body.folder || 'learn-with-resma/images';
    const results = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file, folder))
    );
    const images = results.map(({ url, publicId }) => ({ url, publicId }));
    res.status(201).json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file provided' });
    }
    const { url, publicId } = await uploadToCloudinary(req.file, 'learn-with-resma/pdfs');
    res.status(201).json({ success: true, url, publicId, originalName: req.file.originalname });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'PDF upload failed' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' });
    }
    await deleteFromCloudinary(publicId);
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Delete failed' });
  }
};
