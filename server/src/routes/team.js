const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const { protect } = require('../middleware/auth');

// GET /api/team — List team members (public)
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort('order');
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/team/:id — Get single team member
router.get('/:id', async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: 'Team member not found' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/team — Create team member (protected)
router.post('/', protect, async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/team/:id — Update team member (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: 'Team member not found' });
    }

    res.json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/team/:id — Delete team member (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: 'Team member not found' });
    }

    await member.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
