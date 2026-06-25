const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/properties — List all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      propertyType,
      featured,
      status,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (propertyType) query.propertyType = propertyType;
    if (featured !== undefined) query.featured = featured === 'true';
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query).sort(sort).skip(skip).limit(limitNum),
      Property.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/properties/featured — Get featured properties
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ featured: true })
      .sort('-createdAt')
      .limit(6);

    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/properties/:slug — Get single property by slug
router.get('/:slug', async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found' });
    }

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/properties — Create property (protected)
router.post('/', protect, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A property with this title already exists',
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/properties/:id — Update property (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found' });
    }

    // If title changed, regenerate slug
    if (req.body.title && req.body.title !== property.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/properties/:id — Delete property (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found' });
    }

    await property.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/properties/:id/images — Upload images (protected)
router.post('/:id/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found' });
    }

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    property.images.push(...imagePaths);
    await property.save();

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
