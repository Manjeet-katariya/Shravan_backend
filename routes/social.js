const express = require('express');
const router = express.Router();
const SocialClick = require('../models/SocialClick');

// GET /api/social - list all social click counts
router.get('/', async (req, res) => {
  try {
    const clicks = await SocialClick.find({}).sort({ channel: 1 });
    res.json({
      success: true,
      data: clicks,
      count: clicks.length
    });
  } catch (error) {
    console.error('Get social clicks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching social click counts',
      error: error.message
    });
  }
});

// POST /api/social/click - increment a social click count
router.post('/click', async (req, res) => {
  try {
    const { channel } = req.body;
    const validChannels = ['facebook', 'instagram', 'twitter', 'linkedin'];

    if (!channel || typeof channel !== 'string' || !validChannels.includes(channel.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid social channel: ${validChannels.join(', ')}`
      });
    }

    const normalizedChannel = channel.toLowerCase();
    const result = await SocialClick.findOneAndUpdate(
      { channel: normalizedChannel },
      { $inc: { count: 1 }, $set: { lastClickAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: `Recorded click for ${normalizedChannel}`,
      data: result
    });
  } catch (error) {
    console.error('Social click error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording social click',
      error: error.message
    });
  }
});

module.exports = router;
