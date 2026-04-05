const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug ENV (keep temporarily)
console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Key:", process.env.CLOUDINARY_API_KEY);
console.log("Secret:", process.env.CLOUDINARY_API_SECRET);

// Multer (temporary storage)
const upload = multer({ dest: "uploads/" });

// POST: upload image

router.post("/", upload.single("image"), async (req, res) => {
  console.log("🔥 UPLOAD HIT");

  try {
    const inputPath = req.file.path;
    const outputPath = `uploads/compressed-${Date.now()}.jpg`;

    let quality = 80;
    let buffer;

    // 🔥 Loop until image < 1MB
    do {
      buffer = await sharp(inputPath)
        .resize({ width: 1600 }) // optional resize
        .jpeg({ quality })
        .toBuffer();

      quality -= 10; // reduce quality step-by-step
    } while (buffer.length > 1000000 && quality >= 30);

    // Save final compressed file
    fs.writeFileSync(outputPath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      folder: "architecture-app",
      resource_type: "image"
    });

    // Delete temp files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    res.status(200).json({
      success: true,
      message: "Converted to JPG (<1MB) & uploaded",
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {
    console.error("Cloudinary Error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

module.exports = router;