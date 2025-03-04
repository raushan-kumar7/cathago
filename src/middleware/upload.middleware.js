import multer from "multer";
import fs from "fs-extra";
import path from "path";
import { nanoid } from "nanoid";

const uploadDir = path.join(process.cwd(), "src", "uploads");
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = nanoid(5);
    const extension = path.extname(file.originalname);
    const uniqueFilename = `${uniqueId.toLowerCase()}${extension}`;
    cb(null, uniqueFilename);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF files are allowed."));
    }
  },
});
