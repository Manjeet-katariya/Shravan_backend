const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    default: 'Architecture Studio'
  },

  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      default: '123 Design Boulevard'
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      default: 'New York'
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      default: 'NY'
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true,
      default: '10001'
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'USA'
    }
  },

  // Contact Information
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    default: '+1 (234) 567-890'
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    default: 'hello@architecture.com'
  },

  // Social Media Links
  socialMedia: {
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    instagram: {
      type: String,
      trim: true,
      default: ''
    },
    facebook: {
      type: String,
      trim: true,
      default: ''
    }
  },

  // Business Hours
  businessHours: {
    monday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      closed: { type: Boolean, default: false }
    },
    tuesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      closed: { type: Boolean, default: false }
    },
    wednesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      closed: { type: Boolean, default: false }
    },
    thursday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      closed: { type: Boolean, default: false }
    },
    friday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '18:00' },
      closed: { type: Boolean, default: false }
    },
    saturday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '16:00' },
      closed: { type: Boolean, default: false }
    },
    sunday: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '00:00' },
      closed: { type: Boolean, default: true }
    }
  },

  // Additional Information
  description: {
    type: String,
    trim: true,
    default: 'Leading architecture and design firm specializing in innovative solutions.'
  },

  // Meta Information
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one contact details document exists
contactDetailsSchema.pre('save', async function() {
  if (this.isNew) {
    const existing = await this.constructor.findOne();
    if (existing) {
      throw new Error('Only one contact details document can exist');
    }
  }
});

module.exports = mongoose.model('ContactDetails', contactDetailsSchema);
