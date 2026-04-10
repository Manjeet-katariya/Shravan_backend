const express = require('express');
const router = express.Router();
const SocialIcons = require('../models/SocialIcons');

// GET /api/social-icons - Get social icons
router.get('/', async (req, res) => {
  try {
    let socialIcons = await SocialIcons.findOne();

    // If no social icons exist, create default ones
    if (!socialIcons) {
      socialIcons = new SocialIcons();
      await socialIcons.save();
    }

    res.json({
      success: true,
      data: socialIcons
    });
  } catch (error) {
    console.error('Error fetching social icons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching social icons',
      error: error.message
    });
  }
});

// PUT /api/social-icons - Update social icons
router.put('/', async (req, res) => {
  try {
    const updateData = req.body;

    let socialIcons = await SocialIcons.findOne();

    if (!socialIcons) {
      // Create new social icons if none exist
      socialIcons = new SocialIcons(updateData);
    } else {
      // Update existing social icons
      Object.assign(socialIcons, updateData);
    }

    const savedSocialIcons = await socialIcons.save();

    res.json({
      success: true,
      message: 'Social icons updated successfully',
      data: savedSocialIcons
    });
  } catch (error) {
    console.error('Error updating social icons:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating social icons',
      error: error.message
    });
  }
});

module.exports = router;