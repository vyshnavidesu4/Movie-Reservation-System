import multer from "multer";
//import { CloudinaryStorage } from "multer-storage-cloudinary";
import pkg from "multer-storage-cloudinary";
const { CloudinaryStorage } = pkg;
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "movie_posters",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

export default upload;
