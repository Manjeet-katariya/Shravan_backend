const express = require('express');
const router = express.Router();
const ContactDetails = require('../models/ContactDetails');

// GET /api/contact-details - Get contact details
router.get('/', async (req, res) => {
  try {
    let contactDetails = await ContactDetails.findOne();

    // If no contact details exist, create default ones
    if (!contactDetails) {
      contactDetails = new ContactDetails();
      await contactDetails.save();
    }

    res.json({
      success: true,
      data: contactDetails
    });
  } catch (error) {
    console.error('Error fetching contact details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact details',
      error: error.message
    });
  }
});

// PUT /api/contact-details - Update contact details
router.put('/', async (req, res) => {
  try {
    const updateData = req.body;

    let contactDetails = await ContactDetails.findOne();

    if (!contactDetails) {
      // Create new contact details if none exist
      contactDetails = new ContactDetails(updateData);
    } else {
      // Update existing contact details
      Object.assign(contactDetails, updateData);
    }

    const savedContactDetails = await contactDetails.save();

    res.json({
      success: true,
      message: 'Contact details updated successfully',
      data: savedContactDetails
    });
  } catch (error) {
    console.error('Error updating contact details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact details',
      error: error.message
    });
  }
});

// PATCH /api/contact-details - Partially update contact details
router.patch('/', async (req, res) => {
  try {
    const updateData = req.body;

    const contactDetails = await ContactDetails.findOneAndUpdate(
      {},
      updateData,
      {
        new: true,
        runValidators: true,
        upsert: true // Create if doesn't exist
      }
    );

    res.json({
      success: true,
      message: 'Contact details updated successfully',
      data: contactDetails
    });
  } catch (error) {
    console.error('Error updating contact details:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact details',
      error: error.message
    });
  }
});

module.exports = router;
