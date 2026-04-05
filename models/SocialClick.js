const mongoose = require('mongoose');

const SocialClickSchema = new mongoose.Schema({
  channel: {
    type: String,
    enum: ['facebook', 'instagram', 'twitter', 'linkedin'],
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  },
  lastClickAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SocialClick', SocialClickSchema);
