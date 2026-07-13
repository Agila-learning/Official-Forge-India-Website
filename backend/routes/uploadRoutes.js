const express = require('express');
const { uploadLocal, validateDocumentOCR } = require('../middleware/ocrValidator');

const router = express.Router();

// The standard upload route, optionally takes ?documentType=aadhaar for OCR validation
router.post('/', uploadLocal.single('file'), validateDocumentOCR, (req, res) => {
  if (req.file) {
    // Generate a full URL for the frontend based on the local path
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ message: 'File Uploaded', url: fileUrl });
  } else {
    res.status(400).json({ message: 'File upload failed' });
  }
});

router.post('/multiple', uploadLocal.array('files', 10), (req, res) => {
  if (req.files && req.files.length > 0) {
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    res.json({ message: 'Files Uploaded', urls: urls });
  } else {
    res.status(400).json({ message: 'File uploads failed' });
  }
});

module.exports = router;
