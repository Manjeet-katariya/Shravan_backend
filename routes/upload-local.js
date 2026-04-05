const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/upload - Upload single image locally and return URL
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('🔥 Local upload request received');
    console.log('File:', req.file ? 'Yes' : 'No');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename
    });

    // Create the URL for the uploaded file
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    console.log('✅ Local upload successful, URL:', imageUrl);

    // Save image info to database
    const imageDoc = new Image({
      url: imageUrl,
      public_id: req.file.filename, // Use filename as public_id
      original_name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      folder: 'local-uploads'
    });

    const savedImage = await imageDoc.save();
    console.log('✅ Image saved to database');

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        _id: savedImage._id,
        url: savedImage.url,
        public_id: savedImage.public_id,
        original_name: savedImage.original_name,
        size: savedImage.size,
        mimetype: savedImage.mimetype,
        created_at: savedImage.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Upload route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// GET /api/upload - Get all uploaded images
router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: images,
      count: images.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching images',
      error: error.message
    });
  }
});

// DELETE /api/upload/:id - Delete an image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete file from local storage
    const filePath = path.join(uploadsDir, image.public_id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});

module.exports = router;
