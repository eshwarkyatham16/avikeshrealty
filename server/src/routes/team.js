const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const { readJSON, writeJSON } = require('../utils/fileStore');
const { protect } = require('../middleware/auth');

const FILE = 'team.json';

function loadTeam() {
  return readJSON(FILE, []);
}

function saveTeam(team) {
  writeJSON(FILE, team);
}

// GET /api/team — List team members sorted by order (public)
router.get('/', (req, res) => {
  try {
    const team = [...loadTeam()].sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/team — Create team member (protected)
router.post('/', protect, (req, res) => {
  try {
    const team = loadTeam();

    const member = {
      name: '',
      role: '',
      bio: '',
      image: '',
      order: 0,
      social: { instagram: '', linkedin: '', twitter: '' },
      ...req.body,
      _id: randomUUID(),
      createdAt: new Date().toISOString(),
    };

    team.push(member);
    saveTeam(team);

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/team/:id — Update team member (protected)
router.put('/:id', protect, (req, res) => {
  try {
    const team = loadTeam();
    const index = team.findIndex((m) => m._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    const existing = team[index];
    const updates = { ...req.body };
    if (updates.social) {
      updates.social = { ...existing.social, ...updates.social };
    }

    const updated = { ...existing, ...updates, _id: existing._id };
    team[index] = updated;
    saveTeam(team);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/team/:id — Delete team member (protected)
router.delete('/:id', protect, (req, res) => {
  try {
    const team = loadTeam();
    const index = team.findIndex((m) => m._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    team.splice(index, 1);
    saveTeam(team);

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
