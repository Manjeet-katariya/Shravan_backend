// Test Image Upload
require('dotenv').config();
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('Testing image upload to http://localhost:5000/api/upload');
    
    // Create a simple test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    
    const form = new FormData();
    form.append('image', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png'
    });

    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    
    console.log('Upload Response Status:', response.status);
    console.log('Upload Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Upload successful! Image URL:', result.data.url);
    } else {
      console.log('❌ Upload failed:', result.message);
    }
    
  } catch (error) {
    console.error('Test upload error:', error.message);
  }
}

testUpload();
