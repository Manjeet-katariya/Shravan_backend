const mongoose = require('mongoose');

const socialIconsSchema = new mongoose.Schema({
  facebook: {
    type: String,
    trim: true,
    default: ''
  },
  instagram: {
    type: String,
    trim: true,
    default: ''
  },
  twitter: {
    type: String,
    trim: true,
    default: ''
  },
  linkedin: {
    type: String,
    trim: true,
    default: ''
  },
  youtube: {
    type: String,
    trim: true,
    default: ''
  },
  pinterest: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SocialIcons', socialIconsSchema);