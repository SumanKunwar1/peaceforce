import multer from "multer";
import path from "path";
import { uploadPath } from "../utils/filePath";
// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for file uploads
    cb(null, uploadPath); // Change this path as needed
  },
  filename: (req, file, cb) => {
    // Generate the filename as original name + timestamp to avoid duplicates
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter to accept only image files
const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 7 * 1024 * 1024, // 5 MB file size limit
  },
});

export default upload;
