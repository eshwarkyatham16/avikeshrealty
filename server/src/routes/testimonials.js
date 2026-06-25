const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/auth');

// GET /api/testimonials — List testimonials (public)
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const query = {};
    if (featured !== undefined) query.featured = featured === 'true';

    const testimonials = await Testimonial.find(query).sort('-createdAt');
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/testimonials/:id — Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/testimonials — Create testimonial (protected)
router.post('/', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/testimonials/:id — Update testimonial (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/testimonials/:id — Delete testimonial (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
