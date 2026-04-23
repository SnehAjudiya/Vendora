import multer from "multer";
import { AppConstants } from "../constant/appConstants.js";

// File upload multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = Object.values(AppConstants.MulterFileFilters)

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, XLSX files are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
