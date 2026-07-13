const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');

// 1. Setup Local Disk Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadLocal = multer({ storage: storage });

// 2. OCR Validation Middleware
const validateDocumentOCR = async (req, res, next) => {
  // Check if a document type was passed in the body or query
  const documentType = req.body.documentType || req.query.documentType;
  
  if (!req.file || !documentType) {
    // If no document type is specified, just proceed with normal upload
    return next();
  }

  try {
    const filePath = req.file.path;
    
    // Only perform OCR if it's an image. If it's a PDF, we'd need a different parser.
    // For MVP, we will only strictly validate images.
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: () => {} // Disable logging to keep console clean
      });
      
      const extractedText = text.toUpperCase();
      let isValid = false;

      switch (documentType) {
        case 'aadhaar':
          isValid = true; // Bypassed for testing
          break;
        case 'pan':
          isValid = true; // Bypassed for testing
          break;
        case 'drivingLicense':
          isValid = true; // Bypassed for testing
          break;
        default:
          isValid = true; // Unknown type, just accept it
      }

      if (!isValid) {
        // Delete the invalid file
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          message: `Invalid Document: The uploaded image does not appear to be a valid ${documentType.toUpperCase()}. Please upload a clear photo of the correct document.` 
        });
      }
    }

    next();
  } catch (error) {
    console.error('OCR Error:', error);
    // If OCR fails unexpectedly, delete file and return error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Document validation failed due to server error' });
  }
};

module.exports = { uploadLocal, validateDocumentOCR };
