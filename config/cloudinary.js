const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'team-members') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Upload base64 image
const uploadBase64Image = async (base64String, folder = 'team-members') => {
  try {
    console.log('🔥 Cloudinary upload starting...');
    console.log('Cloud config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
    });
    
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'auto'
      // Removed transformations to avoid 403 error
    });
    
    console.log('✅ Cloudinary upload successful:', result.public_id);
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error details:', {
      message: error.message,
      code: error.code,
      http_code: error.http_code,
      name: error.name
    });
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  uploadBase64Image
};
