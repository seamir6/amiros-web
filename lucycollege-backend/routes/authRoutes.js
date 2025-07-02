// lucycollege-backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // ይህን መስመር በትክክል መኖሩን አረጋግጥ

// Generate JWT Token (ይህንን function በትክክል መኖሩን አረጋግጥ)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token valid for 1 hour
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please enter all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User with that email already exists');
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        res.status(400);
        throw new Error('User with that username already exists');
    }

    const user = await User.create({
        username,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            message: 'User registered successfully',
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), // ይህን መስመር ከ comment መውጣቱን አረጋግጥ
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// @desc    User Login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), // ይህን መስመር ከ comment መውጣቱን አረጋግጥ
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));

module.exports = router;