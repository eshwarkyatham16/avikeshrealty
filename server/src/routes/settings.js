const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/fileStore');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const FILE = 'settings.json';

function loadSettings() {
  return readJSON(FILE, {});
}

function saveSettings(settings) {
  writeJSON(FILE, settings);
}

// Deep-merge plain objects, one level of nesting at a time. Arrays and
// primitives are replaced wholesale; nested objects are merged key-by-key.
function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source || {})) {
    const sourceVal = source[key];
    const targetVal = target ? target[key] : undefined;

    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }

  return result;
}

// GET /api/settings — Get settings (public)
router.get('/', (req, res) => {
  try {
    res.json(loadSettings());
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings — Update settings (protected, deep-merge)
router.put('/', protect, (req, res) => {
  try {
    const current = loadSettings();
    const updated = deepMerge(current, req.body || {});
    saveSettings(updated);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/settings/upload — Upload an image (protected)
router.post('/upload', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
