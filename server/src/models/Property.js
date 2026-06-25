const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    required: [true, 'Please add a price'],
  },
  priceNumeric: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
  },
  propertyType: {
    type: String,
    enum: ['Villa', 'Apartment', 'Commercial', 'Plot', 'Luxury'],
    default: 'Villa',
  },
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },
  area: {
    type: String,
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  videos: {
    type: [String],
    default: [],
  },
  brochureUrl: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Upcoming'],
    default: 'Available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug from title before saving
propertySchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
