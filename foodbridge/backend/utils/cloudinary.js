const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const useCloudinary =
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_NAME !== 'your_cloudinary_name' &&
    process.env.CLOUDINARY_KEY &&
    process.env.CLOUDINARY_KEY !== 'your_cloudinary_key' &&
    process.env.CLOUDINARY_SECRET &&
    process.env.CLOUDINARY_SECRET !== 'your_cloudinary_secret';

let storage;

if (useCloudinary) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'foodbridge/listings',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            transformation: [{ width: 800, height: 600, crop: 'limit' }]
        },
    });
    console.log('Using Cloudinary for image storage');
} else {
    // Local storage fallback
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
    console.log('Using Local Storage for image storage (Cloudinary credentials missing or placeholders)');
}

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload, useCloudinary };
