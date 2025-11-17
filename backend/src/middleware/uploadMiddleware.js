import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bicycle-pos/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const upload = multer({
  storage,
});
