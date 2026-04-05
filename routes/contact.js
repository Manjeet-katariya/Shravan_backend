const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const emailService = require('../utils/emailService');

// Store OTPs temporarily
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/contact/send-otp - Send OTP for verification
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const otp = generateOTP();
    
    // Store OTP with 10 minute expiry
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });
    
    // Log OTP for development (remove in production)
    console.log(`🔐 OTP for ${email}: ${otp}`);
    
    res.json({
      success: true,
      message: 'OTP generated successfully (Check console for OTP)',
      email: email
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message
    });
  }
});

// POST /api/contact/verify-otp - Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }
    
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }
    
    if (storedData.otp !== otp) {
      storedData.attempts++;
      if (storedData.attempts >= 3) {
        otpStore.delete(email);
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }
    
    // OTP verified, remove from store
    otpStore.delete(email);
    
    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
});

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { 
      name, email, phone, subject, message, 
      projectType, budget, imageUrl 
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, subject, message'
      });
    }
    
    // Create contact entry
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      imageUrl: imageUrl || null,
      projectType: projectType || 'other',
      budget: budget || 'not-sure',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. Check your email for confirmation!',
      data: contact
    });

    // Send notification emails asynchronously so form submission responds quickly
    Promise.allSettled([
      emailService.sendThankYouEmail(email, name, 'contact'),
      emailService.sendContactNotification({
        name,
        email,
        phone,
        subject,
        message,
        projectType,
        budget,
        imageUrl
      })
    ]).then((results) => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Email task ${index} failed:`, result.reason);
        }
      });
    });
    
    console.log('📧 New contact form submitted:', contact._id);
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

// GET /api/contact - Get all contacts (Admin only)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true };
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
});

// GET /api/contact/:id - Get single contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
});

// PATCH /api/contact/:id/status - Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact status updated',
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
});

// DELETE /api/contact/:id - Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
});

// POST /api/contact/:id/send-email - Admin send email to customer
router.post('/:id/send-email', async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    // Send email to customer
    const emailResult = await emailService.sendAdminEmail(
      contact.email,
      subject,
      message,
      contact.name
    );
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Email sent successfully to customer',
        messageId: emailResult.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: emailResult.error
      });
    }
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
});

module.exports = router;
