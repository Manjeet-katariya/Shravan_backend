// Test Cloudinary Setup
require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');

console.log('Testing Cloudinary Configuration...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

// Test Cloudinary connection
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
  } else {
    console.log('✅ Cloudinary connection successful!');
    console.log('Result:', result);
  }
});
