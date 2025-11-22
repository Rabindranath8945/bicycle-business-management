import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ********** STORAGE **********
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "products",
    format: "jpg", // convert to jpg always
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `prod_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
  }),
});

// ********** MULTER **********
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

export default upload;
