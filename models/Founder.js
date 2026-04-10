const mongoose = require('mongoose');

const FounderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Elena Rostova'
  },
  title: {      
    type: String,
    required: true,
    trim: true,
    default: 'Principal Architect & CEO'
  },
  quote: {
    type: String,
    required: true,
    trim: true,
    default: 'Architecture is the silent poetry of our daily lives. We don\'t just build walls; we frame memories, structure workflows, and design the sanctuaries where life unfolds.'
  },
  image: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Founder', FounderSchema);
