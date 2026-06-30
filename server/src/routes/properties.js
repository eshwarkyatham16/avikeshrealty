const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const { readJSON, writeJSON } = require('../utils/fileStore');
const { generateUniqueSlug } = require('../utils/slugify');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const FILE = 'properties.json';

function loadProperties() {
  return readJSON(FILE, []);
}

function saveProperties(properties) {
  writeJSON(FILE, properties);
}

// GET /api/properties — List with filters (public)
router.get('/', (req, res) => {
  try {
    const {
      propertyType,
      featured,
      search,
      minPrice,
      maxPrice,
      bedrooms,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    let properties = loadProperties();

    if (propertyType) {
      properties = properties.filter((p) => p.propertyType === propertyType);
    }

    if (featured !== undefined) {
      const wantFeatured = featured === 'true';
      properties = properties.filter((p) => Boolean(p.featured) === wantFeatured);
    }

    if (search) {
      const term = search.toLowerCase();
      properties = properties.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.location && p.location.toLowerCase().includes(term))
      );
    }

    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice);
      properties = properties.filter((p) => (p.priceNumeric || 0) >= min);
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice);
      properties = properties.filter((p) => (p.priceNumeric || 0) <= max);
    }

    if (bedrooms !== undefined && bedrooms !== '') {
      const beds = Number(bedrooms);
      properties = properties.filter((p) => (p.bedrooms || 0) === beds);
    }

    if (sort === 'price-high') {
      properties = [...properties].sort(
        (a, b) => (b.priceNumeric || 0) - (a.priceNumeric || 0)
      );
    } else if (sort === 'price-low') {
      properties = [...properties].sort(
        (a, b) => (a.priceNumeric || 0) - (b.priceNumeric || 0)
      );
    } else {
      // newest (default)
      properties = [...properties].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    const total = properties.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const start = (pageNum - 1) * limitNum;
    const paged = properties.slice(start, start + limitNum);

    res.json({
      properties: paged,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/properties/featured — Featured properties (public)
router.get('/featured', (req, res) => {
  try {
    const properties = loadProperties().filter((p) => p.featured === true);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/properties/:slug — Single property by slug (public)
router.get('/:slug', (req, res) => {
  try {
    const properties = loadProperties();
    const property = properties.find((p) => p.slug === req.params.slug);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/properties — Create property (protected)
router.post('/', protect, (req, res) => {
  try {
    const properties = loadProperties();

    const slug = generateUniqueSlug(req.body.title || '', properties);

    const property = {
      title: '',
      description: '',
      price: '',
      priceNumeric: 0,
      location: '',
      propertyType: 'Villa',
      bedrooms: undefined,
      bathrooms: undefined,
      area: '',
      amenities: [],
      images: [],
      videos: [],
      brochureUrl: '',
      featured: false,
      status: 'Available',
      ...req.body,
      _id: randomUUID(),
      slug,
      createdAt: new Date().toISOString(),
    };

    properties.push(property);
    saveProperties(properties);

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/properties/:id — Update property (protected)
router.put('/:id', protect, (req, res) => {
  try {
    const properties = loadProperties();
    const index = properties.findIndex((p) => p._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const existing = properties[index];
    const updates = { ...req.body };

    if (updates.title && updates.title !== existing.title) {
      updates.slug = generateUniqueSlug(updates.title, properties, existing._id);
    }

    const updated = { ...existing, ...updates, _id: existing._id };
    properties[index] = updated;
    saveProperties(properties);

    res.json(updated);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/properties/:id — Delete property (protected)
router.delete('/:id', protect, (req, res) => {
  try {
    const properties = loadProperties();
    const index = properties.findIndex((p) => p._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    properties.splice(index, 1);
    saveProperties(properties);

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/properties/:id/images — Upload images (protected)
router.post('/:id/images', protect, upload.array('images', 10), (req, res) => {
  try {
    const properties = loadProperties();
    const index = properties.findIndex((p) => p._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const imagePaths = (req.files || []).map((file) => `/uploads/${file.filename}`);
    const property = properties[index];
    property.images = [...(property.images || []), ...imagePaths];
    properties[index] = property;
    saveProperties(properties);

    res.json(property);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
