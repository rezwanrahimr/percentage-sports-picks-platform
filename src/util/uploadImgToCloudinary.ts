import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";

// Upload to Cloudinary directly from buffer
export const uploadToCloudinary = async (buffer: Buffer, folder: string, originalname: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  console.log(`cloud_name: ${config.cloudinary_name}`);
  console.log(`api_key: ${config.cloudinary_api_key}`);
  console.log(`api_secret: ${config.cloudinary_api_secret}`);

  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(originalname)}`,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error("File upload failed"));
          } else {
            resolve(result?.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("File upload failed");
  }
};

// Delete from Cloudinary using public_id extracted from URL
export const deleteFromCloudinary = async (imageUrl: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  try {
    console.log('Attempting to delete image:', imageUrl);
    
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const urlParts = imageUrl.split('/');
    
    // Find the index of 'upload' in the URL
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }
    
    // Get everything after 'upload' and version (v1234567890)
    const pathAfterUpload = urlParts.slice(uploadIndex + 2); // Skip 'upload' and version
    
    // Join the path and remove file extension
    const fullPath = pathAfterUpload.join('/');
    const publicId = fullPath.replace(/\.[^/.]+$/, ""); // Remove file extension
    
    console.log('Extracted public_id:', publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary deletion result:', result);
    
    if (result.result === 'ok') {
      console.log('✅ Image successfully deleted from Cloudinary');
    } else {
      console.log('⚠️ Image deletion status:', result.result);
    }
    
    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new Error("Image deletion failed");
  }
};

// Multer config
const storage = multer.memoryStorage();
/* const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
}); */

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

export const upload = multer({ storage, fileFilter });