const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: null
  },
  projectType: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'renovation', 'interior', 'other'],
    default: 'other'
  },
  budget: {
    type: String,
    enum: ['under-5lakh', '5-10-lakh', '10-25-lakh', '25-50-lakh', '50-lakh-plus', 'not-sure'],
    default: 'not-sure'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'completed', 'closed'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema);
