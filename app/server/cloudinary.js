import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64Data, mimeType, fileName) {
  const dataUri = `data:${mimeType};base64,${base64Data}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'layer-tracker',
    public_id: fileName,
    overwrite: true,
  });
  return result.secure_url;
}
