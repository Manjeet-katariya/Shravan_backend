const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
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
  // Project Details
  projectType: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'renovation', 'interior'],
    required: true
  },
  projectSubtype: {
    type: String,
    enum: ['new-construction', 'extension', 'renovation', 'interior-design', 'landscape']
  },
  // Area & Size
  builtUpArea: {
    type: Number,
    required: true,
    min: 0
  },
  areaUnit: {
    type: String,
    enum: ['sqft', 'sqm', 'sqyd'],
    default: 'sqft'
  },
  numberOfFloors: {
    type: Number,
    default: 1,
    min: 1
  },
  numberOfRooms: {
    type: Number,
    default: 0
  },
  // Quality & Specifications
  qualityLevel: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'luxury'],
    default: 'standard'
  },
  // Features
  features: [{
    type: String,
    enum: ['modular-kitchen', 'false-ceiling', 'lighting', 'flooring', 'painting', 'plumbing', 'electrical', 'ac', 'elevator', 'security', 'landscaping', 'swimming-pool', 'gym']
  }],
  // Location
  city: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  // Timeline
  expectedStart: {
    type: Date
  },
  urgency: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  // Calculated Estimate
  calculatedEstimate: {
    baseCost: Number,
    featureCost: Number,
    qualityMultiplier: Number,
    totalEstimate: Number,
    breakdown: {
      construction: Number,
      materials: Number,
      labor: Number,
      features: Number,
      other: Number
    }
  },
  // Budget Comparison
  customerBudget: {
    type: String,
    enum: ['under-10lakh', '10-20-lakh', '20-50-lakh', '50lakh-1crore', '1crore-plus', 'not-decided'],
    default: 'not-decided'
  },
  // Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'negotiating', 'approved', 'rejected', 'converted'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },
  ipAddress: {
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
estimateSchema.index({ createdAt: -1 });
estimateSchema.index({ status: 1 });
estimateSchema.index({ email: 1 });

module.exports = mongoose.model('Estimate', estimateSchema);
