const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/login - Admin/Superadmin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Simple password comparison (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// POST /api/users/create-admin - Create new admin (Superadmin only)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, superadminEmail } = req.body;

    if (!name || !email || !password || !superadminEmail) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and superadminEmail are required'
      });
    }

    // Verify that the request is from a superadmin
    const superadmin = await User.findOne({ email: superadminEmail, role: 'superadmin', isActive: true });
    
    if (!superadmin) {
      return res.status(403).json({
        success: false,
        message: 'Only superadmin can create new admins'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create new admin
    const newUser = new User({
      name,
      email,
      password, // In production, hash with bcrypt
      role: 'admin',
      isActive: true
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin',
      error: error.message
    });
  }
});

// GET /api/users - Get all users (Superadmin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// POST /api/users - Create a user (deprecated, use create-admin)
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'admin'
  });

  try {
    const newUser = await user.save();
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
      },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
});

// DELETE /api/users/:id - Delete user (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

module.exports = router;