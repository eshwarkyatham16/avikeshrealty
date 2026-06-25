const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  social: {
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
