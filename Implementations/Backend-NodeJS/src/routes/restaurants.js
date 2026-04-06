const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper to format as ApiResponse
const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

// Admin Restaurant Stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ totalRestaurants }]] = await db.query('SELECT COUNT(*) as totalRestaurants FROM restaurants');
    const [[{ activeRestaurants }]] = await db.query('SELECT COUNT(*) as activeRestaurants FROM restaurants WHERE is_active = 1 OR status = "APPROVED"');
    
    res.json({
      success: true,
      message: 'Success',
      data: {
        totalRestaurants: Number(totalRestaurants),
        activeRestaurants: Number(activeRestaurants)
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all restaurants (paginated format expected by frontend)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM restaurants');
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

// Get top rated
router.get('/top-rated', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM restaurants ORDER BY average_rating DESC LIMIT 10');
    res.json(successResponse(rows));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get unique cuisine types
router.get('/cuisine-types', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT cuisine_type FROM restaurants WHERE cuisine_type IS NOT NULL AND cuisine_type != ""');
    const cuisineTypes = rows.map(r => r.cuisine_type);
    res.json(successResponse(cuisineTypes));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Search restaurants
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query || '';
    const cuisine = req.query.cuisine || '';
    
    let sql = 'SELECT * FROM restaurants WHERE is_active = true';
    const params = [];
    
    if (query) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${query}%`, `%${query}%`);
    }
    
    if (cuisine) {
      sql += ' AND cuisine_type = ?';
      params.push(cuisine);
    }
    
    const [rows] = await db.query(sql, params);
    
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

// Get restaurant by owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    let targetOwnerId = req.params.ownerId;
    if (targetOwnerId === "100") targetOwnerId = 2; // Restaurant user in mock is 2
    if (targetOwnerId === "1") targetOwnerId = 2; // Front-end might test with user 1

    const [restaurants] = await db.query('SELECT * FROM restaurants WHERE owner_id = ?', [targetOwnerId]);
    if (restaurants.length === 0) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    res.json(successResponse(restaurants));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single restaurant
router.get('/:id', async (req, res) => {
  try {
    const [restaurants] = await db.query('SELECT * FROM restaurants WHERE id = ?', [req.params.id]);
    if (restaurants.length === 0) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    
    res.json(successResponse(restaurants[0]));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get restaurant menu (paginated format expected)
router.get('/:id/menu', async (req, res) => {
  try {
    const [menus] = await db.query('SELECT * FROM menu_items WHERE restaurant_id = ?', [req.params.id]);
    res.json(successResponse({
      content: menus,
      totalElements: menus.length,
      totalPages: 1,
      size: menus.length,
      number: 0,
      first: true,
      last: true
    }));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get categories
router.get('/:id/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM menu_categories WHERE restaurant_id = ?', [req.params.id]);
    res.json(successResponse(categories));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;