const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const successResponse = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

// Middleware to extract user ID from mock token token
const extractUserId = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    if(token.includes('mock_token')) {
        // Fallback for the dummy frontend tokens
        req.userId = 100;
        next();
    } else {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }
};

// Get current profile
router.get('/profile', extractUserId, async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json(successResponse(users[0]));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update current profile
router.put('/profile', extractUserId, async (req, res) => {
  try {
    const { name, phone_number } = req.body;
    await db.query('UPDATE users SET name = ?, phone_number = ? WHERE id = ?', [name, phone_number, req.userId]);
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);
    res.json(successResponse(users[0], 'Profile updated'));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get user addresses (mocked)
router.get('/addresses', extractUserId, async (req, res) => {
  res.json(successResponse([
    { id: 1, type: 'HOME', address: '123 Test Street, Bangkok 10110', isDefault: true }
  ]));
});

// Get payment methods (mocked)
router.get('/payment-methods', extractUserId, async (req, res) => {
  res.json(successResponse([
    { id: 1, type: 'CREDIT_CARD', brand: 'VISA', last4: '4242', isDefault: true }
  ]));
});

// Get user by ID (Admin)
router.get('/:id', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, phone_number, role, enabled, created_at, updated_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json(successResponse(users[0]));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;