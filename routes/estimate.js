const express = require('express');
const router = express.Router();
const Estimate = require('../models/Estimate');
const { sendEstimateNotification, sendThankYouEmail, sendAdminEmail } = require('../utils/emailService');

// Store OTPs for estimate verification
const estimateOtpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// POST /api/estimate/send-otp - Send OTP for estimate verification
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
    estimateOtpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });
    
    // Log OTP for development
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

// POST /api/estimate/verify-otp - Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const storedData = estimateOtpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }
    
    if (Date.now() > storedData.expiresAt) {
      estimateOtpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }
    
    if (storedData.otp !== otp) {
      storedData.attempts++;
      if (storedData.attempts >= 3) {
        estimateOtpStore.delete(email);
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
    estimateOtpStore.delete(email);
    
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

// Calculate estimate based on inputs
const calculateEstimate = (data) => {
  const { 
    builtUpArea, projectType, qualityLevel, 
    numberOfFloors, features 
  } = data;
  
  // Base rates per sq.ft
  const baseRates = {
    residential: 1500,
    commercial: 1800,
    industrial: 1200,
    renovation: 800,
    interior: 1200
  };
  
  // Quality multipliers
  const qualityMultipliers = {
    basic: 0.8,
    standard: 1.0,
    premium: 1.4,
    luxury: 2.0
  };
  
  // Feature costs
  const featureCosts = {
    'modular-kitchen': 150000,
    'false-ceiling': 120000,
    'lighting': 80000,
    'flooring': 200000,
    'painting': 100000,
    'plumbing': 150000,
    'electrical': 200000,
    'ac': 300000,
    'elevator': 500000,
    'security': 150000,
    'landscaping': 100000,
    'swimming-pool': 800000,
    'gym': 400000
  };
  
  // Calculate base cost
  const baseRate = baseRates[projectType] || 1500;
  const multiplier = qualityMultipliers[qualityLevel] || 1.0;
  const baseCost = builtUpArea * baseRate * multiplier * numberOfFloors;
  
  // Calculate feature costs
  let featureCost = 0;
  if (features && features.length > 0) {
    featureCost = features.reduce((total, feature) => {
      return total + (featureCosts[feature] || 0);
    }, 0);
  }
  
  // Breakdown
  const constructionCost = baseCost * 0.6;
  const materialsCost = baseCost * 0.25;
  const laborCost = baseCost * 0.15;
  
  const totalEstimate = baseCost + featureCost;
  
  return {
    baseCost: Math.round(baseCost),
    featureCost: Math.round(featureCost),
    qualityMultiplier: multiplier,
    totalEstimate: Math.round(totalEstimate),
    breakdown: {
      construction: Math.round(constructionCost),
      materials: Math.round(materialsCost),
      labor: Math.round(laborCost),
      features: Math.round(featureCost),
      other: 0
    }
  };
};

// POST /api/estimate - Submit estimate request
router.post('/', async (req, res) => {
  try {
    const {
      customerName, email, phone,
      projectType, projectSubtype,
      builtUpArea, areaUnit, numberOfFloors, numberOfRooms,
      qualityLevel, features,
      city, location,
      expectedStart, urgency,
      customerBudget
    } = req.body;
    
    // Validate required fields
    if (!customerName || !email || !projectType || !builtUpArea) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: customerName, email, projectType, builtUpArea'
      });
    }
    
    // Calculate estimate
    const calculatedEstimate = calculateEstimate({
      builtUpArea,
      projectType,
      qualityLevel,
      numberOfFloors,
      features
    });
    
    // Create estimate entry
    const estimate = new Estimate({
      customerName,
      email,
      phone,
      projectType,
      projectSubtype,
      builtUpArea,
      areaUnit: areaUnit || 'sqft',
      numberOfFloors: numberOfFloors || 1,
      numberOfRooms: numberOfRooms || 0,
      qualityLevel: qualityLevel || 'standard',
      features: features || [],
      city,
      location,
      expectedStart,
      urgency: urgency || 'normal',
      customerBudget: customerBudget || 'not-decided',
      calculatedEstimate,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await estimate.save();
    
    // Send notification emails
    try {
      // Send notification to admin
      await sendEstimateNotification(estimate.toObject());
      
      // Send thank you email to customer
      await sendThankYouEmail(estimate.email, estimate.customerName, 'estimate');
      
      console.log('📧 Estimate emails sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send estimate emails:', emailError.message);
      // Don't fail the request if emails fail
    }
    
    console.log('📊 New estimate request:', estimate.toObject());
    
    res.status(201).json({
      success: true,
      message: 'Estimate request submitted successfully',
      data: estimate
    });
  } catch (error) {
    console.error('Estimate submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting estimate request',
      error: error.message
    });
  }
});

// POST /api/estimate/calculate - Calculate estimate without saving
router.post('/calculate', async (req, res) => {
  try {
    const { builtUpArea, projectType, qualityLevel, numberOfFloors, features } = req.body;
    
    if (!builtUpArea || !projectType) {
      return res.status(400).json({
        success: false,
        message: 'builtUpArea and projectType are required'
      });
    }
    
    const calculatedEstimate = calculateEstimate({
      builtUpArea,
      projectType,
      qualityLevel,
      numberOfFloors,
      features
    });
    
    res.json({
      success: true,
      data: calculatedEstimate
    });
  } catch (error) {
    console.error('Calculate estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating estimate',
      error: error.message
    });
  }
});

// GET /api/estimate - Get all estimates (Admin only)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true };
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const estimates = await Estimate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Estimate.countDocuments(query);
    
    res.json({
      success: true,
      data: estimates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get estimates error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching estimates',
      error: error.message
    });
  }
});

// GET /api/estimate/:id - Get single estimate
router.get('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findById(req.params.id);
    
    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }
    
    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    console.error('Get estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching estimate',
      error: error.message
    });
  }
});

// POST /api/estimate/:id/send-email - Send custom email to estimate customer
router.post('/:id/send-email', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const estimate = await Estimate.findById(req.params.id);

    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email subject and message are required'
      });
    }

    const emailResult = await sendAdminEmail(
      estimate.email,
      subject,
      message,
      estimate.customerName
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: emailResult.error
      });
    }

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: emailResult
    });
  } catch (error) {
    console.error('Send estimate email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
});

// PATCH /api/estimate/:id/status - Update estimate status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    
    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Estimate status updated',
      data: estimate
    });
  } catch (error) {
    console.error('Update estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating estimate',
      error: error.message
    });
  }
});

// DELETE /api/estimate/:id - Delete estimate
router.delete('/:id', async (req, res) => {
  try {
    const estimate = await Estimate.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!estimate) {
      return res.status(404).json({
        success: false,
        message: 'Estimate not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Estimate deleted successfully'
    });
  } catch (error) {
    console.error('Delete estimate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting estimate',
      error: error.message
    });
  }
});

module.exports = router;
