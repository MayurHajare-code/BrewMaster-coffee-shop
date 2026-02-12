// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = path.join(process.cwd(), "public");

// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination : (req, file, cb) => {
//         cb(null, uploadDir)
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// export const imgUpload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } })



import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "menus", // folder name in cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

export default upload;
