const express = require('express');
const router = express.Router();
const Founder = require('../models/Founder');

// Get founder details
router.get('/', async (req, res) => {
  try {
    let founder = await Founder.findOne();
    
    // If no founder exists, create default one
    if (!founder) {
      founder = await Founder.create({
        name: 'Elena Rostova',
        title: 'Principal Architect & CEO',
        quote: 'Architecture is the silent poetry of our daily lives. We don\'t just build walls; we frame memories, structure workflows, and design the sanctuaries where life unfolds.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      });
    }
    
    res.json({ 
      success: true, 
      data: founder 
    });
  } catch (error) {
    console.error('Error fetching founder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching founder details',
      error: error.message 
    });
  }
});

// Update founder details
router.put('/', async (req, res) => {
  try {
    const { name, title, quote, image, bio, email, linkedin, twitter, instagram } = req.body;
    
    let founder = await Founder.findOne();
    
    if (!founder) {
      founder = await Founder.create(req.body);
    } else {
      founder.name = name || founder.name;
      founder.title = title || founder.title;
      founder.quote = quote || founder.quote;
      founder.image = image || founder.image;
      founder.bio = bio || founder.bio;
      founder.email = email || founder.email;
      founder.linkedin = linkedin || founder.linkedin;
      founder.twitter = twitter || founder.twitter;
      founder.instagram = instagram || founder.instagram;
      founder.updatedAt = Date.now();
      await founder.save();
    }
    
    res.json({ 
      success: true, 
      message: 'Founder details updated successfully',
      data: founder 
    });
  } catch (error) {
    console.error('Error updating founder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating founder details',
      error: error.message 
    });
  }
});

// Delete founder (reset to default)
router.delete('/', async (req, res) => {
  try {
    await Founder.deleteMany({});
    
    const newFounder = await Founder.create({
      name: 'Elena Rostova',
      title: 'Principal Architect & CEO',
      quote: 'Architecture is the silent poetry of our daily lives. We don\'t just build walls; we frame memories, structure workflows, and design the sanctuaries where life unfolds.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });
    
    res.json({ 
      success: true, 
      message: 'Founder reset to default',
      data: newFounder 
    });
  } catch (error) {
    console.error('Error resetting founder:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error resetting founder details',
      error: error.message 
    });
  }
});

module.exports = router;
