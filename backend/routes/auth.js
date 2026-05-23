const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({
      data: null,
      error: 'Please enter all required fields: name, email, and password.'
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        data: null,
        error: 'A user with that email already exists.'
      });
    }

    // Hash password (salt rounds >= 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      passwordHash
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateToken(savedUser._id);

    return res.status(201).json({
      data: {
        token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      data: null,
      error: 'Internal server error.'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      data: null,
      error: 'Please enter both email and password.'
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        data: null,
        error: 'Invalid credentials.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        data: null,
        error: 'Invalid credentials.'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      data: null,
      error: 'Internal server error.'
    });
  }
});

module.exports = router;
