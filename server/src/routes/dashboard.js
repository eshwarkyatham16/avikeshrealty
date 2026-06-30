const express = require('express');
const router = express.Router();
const { readJSON } = require('../utils/fileStore');
const { protect } = require('../middleware/auth');

// GET /api/dashboard/stats — Dashboard statistics (protected)
router.get('/stats', protect, (req, res) => {
  try {
    const properties = readJSON('properties.json', []);
    const testimonials = readJSON('testimonials.json', []);
    const team = readJSON('team.json', []);

    res.json({
      success: true,
      data: {
        totalProperties: properties.length,
        featuredProperties: properties.filter((p) => p.featured === true).length,
        totalTestimonials: testimonials.length,
        totalTeamMembers: team.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
