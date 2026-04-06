const express = require('express');
const router = express.Router();
const db = require('../config/db');

const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

// Get all riders
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = "RIDER"');
    res.json(successResponse({
      content: rows,
      totalElements: rows.length,
      totalPages: 1,
      size: rows.length,
      number: 0,
      first: true,
      last: true
    }));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get available riders
router.get('/available', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE role = "RIDER" AND enabled = true');
    res.json(successResponse({
      content: rows,
      totalElements: rows.length,
      totalPages: 1,
      size: rows.length,
      number: 0,
      first: true,
      last: true
    }));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single rider
router.get('/:id', async (req, res) => {
  try {
    const [riders] = await db.query('SELECT * FROM users WHERE id = ? AND role = "RIDER"', [req.params.id]);
    if (riders.length === 0) {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }
    res.json(successResponse(riders[0]));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get rider location (mocked)
router.get('/:id/location', async (req, res) => {
  res.json(successResponse({
    latitude: 13.7390,
    longitude: 100.5600,
    timestamp: new Date()
  }, 'Location retrieved'));
});

module.exports = router;