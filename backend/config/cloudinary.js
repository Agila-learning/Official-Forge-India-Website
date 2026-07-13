const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'forge-india-connect';
    if (file.fieldname === 'profileImage' || req.originalUrl.includes('profile')) folder = 'forge-india-connect/profiles';
    else if (file.fieldname === 'document' || req.originalUrl.includes('documents')) folder = 'forge-india-connect/documents';
    else if (req.originalUrl.includes('products')) folder = 'forge-india-connect/products';
    
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      public_id: file.fieldname + '-' + Date.now()
    };
  },
});

const uploadCloud = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { cloudinary, uploadCloud };
