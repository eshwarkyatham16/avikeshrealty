const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const { readJSON, writeJSON } = require('../utils/fileStore');
const { protect } = require('../middleware/auth');

const FILE = 'testimonials.json';

function loadTestimonials() {
  return readJSON(FILE, []);
}

function saveTestimonials(testimonials) {
  writeJSON(FILE, testimonials);
}

// GET /api/testimonials — List all testimonials (public)
router.get('/', (req, res) => {
  try {
    const testimonials = loadTestimonials();
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/testimonials — Create testimonial (protected)
router.post('/', protect, (req, res) => {
  try {
    const testimonials = loadTestimonials();

    const testimonial = {
      name: '',
      role: '',
      content: '',
      rating: 5,
      image: '',
      featured: false,
      ...req.body,
      _id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    testimonials.push(testimonial);
    saveTestimonials(testimonials);

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/testimonials/:id — Update testimonial (protected)
router.put('/:id', protect, (req, res) => {
  try {
    const testimonials = loadTestimonials();
    const index = testimonials.findIndex((t) => t._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const updated = { ...testimonials[index], ...req.body, _id: testimonials[index]._id };
    testimonials[index] = updated;
    saveTestimonials(testimonials);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/testimonials/:id — Delete testimonial (protected)
router.delete('/:id', protect, (req, res) => {
  try {
    const testimonials = loadTestimonials();
    const index = testimonials.findIndex((t) => t._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonials.splice(index, 1);
    saveTestimonials(testimonials);

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
