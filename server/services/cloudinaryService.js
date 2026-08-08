import { v2 as cloudinary } from 'cloudinary';

let configured = false;

const configure = () => {
  if (configured) return Boolean(process.env.CLOUDINARY_CLOUD_NAME);
  if (!process.env.CLOUDINARY_CLOUD_NAME) return false;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  configured = true;
  return true;
};

// Uploads a local file (from multer) to Cloudinary. When Cloudinary is not
// configured the local /uploads URL is returned so behaviour stays identical.
export const uploadToCloudinary = async (filePath, folder = 'medcare') => {
  if (!configure()) return { url: null, skipped: true };
  const result = await cloudinary.uploader.upload(filePath, { folder, resource_type: 'auto' });
  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteFromCloudinary = async (publicId) => {
  if (!configure() || !publicId) return { skipped: true };
  return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
