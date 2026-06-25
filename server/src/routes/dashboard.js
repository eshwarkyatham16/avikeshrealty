const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware/auth');

// GET /api/dashboard/stats — Dashboard statistics (protected)
router.get('/stats', protect, async (req, res) => {
  try {
    // Calculate start of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProperties,
      totalLeads,
      newLeadsThisMonth,
      featuredProperties,
      totalTestimonials,
    ] = await Promise.all([
      Property.countDocuments(),
      Lead.countDocuments(),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Property.countDocuments({ featured: true }),
      Testimonial.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        totalProperties,
        totalLeads,
        newLeadsThisMonth,
        featuredProperties,
        totalTestimonials,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
