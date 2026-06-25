const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  budget: {
    type: String,
    trim: true,
  },
  propertyType: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  source: {
    type: String,
    default: 'website',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Converted'],
    default: 'New',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lead', leadSchema);
