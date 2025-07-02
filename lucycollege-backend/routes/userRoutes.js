// lucycollege-backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user'); // 'user' በትናንሽ ፊደል መሆኑን አረጋግጥ!
const { protect, authorize } = require('../middleware/authMiddleware'); // protect እና authorize middleware ዎችን አስመጣ

// @desc    Get current logged in user's profile
// @route   GET /api/users/profile
// @access  Private (ማንኛውም Login ያደረገ user)
router.get('/profile', protect, asyncHandler(async (req, res) => {
    res.status(200).json({ user: req.user });
}));

// @desc    Get sensitive admin information (example)
// @route   GET /api/users/admin_info
// @access  Private (Admin ብቻ)
router.get('/admin_info', protect, authorize(['admin']), asyncHandler(async (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to the Admin-only zone!',
        adminData: {
            totalUsers: await User.countDocuments(),
            activeAdmins: await User.countDocuments({ role: 'admin' }),
            secretReport: 'This is a top-secret admin report.'
        },
        loggedInAdmin: req.user.email
    });
}));

module.exports = router;