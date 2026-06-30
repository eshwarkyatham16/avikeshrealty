const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/fileStore');
const { protect } = require('../middleware/auth');

const FILE = 'admin.json';

function loadAdmin() {
  return readJSON(FILE, null);
}

function saveAdmin(admin) {
  writeJSON(FILE, admin);
}

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// POST /api/auth/login — Login and return JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const admin = loadAdmin();

    if (!admin || admin.email !== email) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin.email);

    res.json({
      success: true,
      token,
      data: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me — Get current admin (protected)
router.get('/me', protect, (req, res) => {
  try {
    const admin = loadAdmin();

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.json({
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/change-password — Change admin password (protected)
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    const admin = loadAdmin();

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    saveAdmin(admin);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
