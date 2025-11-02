// Cloudinary uploader with per-server credential support
import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary(
  cloudName?: string,
  apiKey?: string,
  apiSecret?: string
) {
  cloudinary.config({
    cloud_name: cloudName || process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: apiKey || process.env.CLOUDINARY_API_KEY!,
    api_secret: apiSecret || process.env.CLOUDINARY_API_SECRET!,
  });
  return cloudinary;
}
