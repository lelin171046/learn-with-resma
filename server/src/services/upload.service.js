const { cloudinary } = require('../config/cloudinary');

const uploadToCloudinary = async (file, folder = 'learn-with-resma/images') => {
  const result = await cloudinary.uploader.upload(file.path || file, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return { url: result.secure_url, publicId: result.public_id };
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return false;
  const result = await cloudinary.uploader.destroy(publicId);
  return result.result === 'ok';
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
