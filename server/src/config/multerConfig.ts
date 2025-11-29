// src/config/multerConfig.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// Use absolute path and ensure it's created
const uploadDir = path.join(process.cwd(), 'uploads');

// Log the path for debugging
console.log('📁 Creating upload directory at:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Upload directory created successfully');
  } catch (error) {
    console.error('❌ Failed to create upload directory:', error);
  }
} else {
  console.log('✅ Upload directory already exists');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Double-check directory exists before saving
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename - remove spaces and special characters
    const sanitizedName = file.originalname.replace(/\s+/g, '-');
    const uniqueName = `${Date.now()}-${sanitizedName}`;
    console.log('💾 Saving file as:', uniqueName);
    cb(null, uniqueName);
  }
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'));
  }
};

export const uploadPDF = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});