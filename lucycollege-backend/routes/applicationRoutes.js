// lucycollege-backend/routes/applicationRoutes.js

const express = require('express');
const asyncHandler = require('express-async-handler'); // Still needed for overall error handling
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ፋይሎችን ለመሰረዝ አስመጣን

const Application = require('../models/Application'); // Application Model ን አስመጣን
const { protect } = require('../middleware/authMiddleware'); // CHANGED: protect middleware ን አስመጣ
const applicationController = require('../controllers/applicationController'); // CHANGED: applicationController ን አስመጣ

const router = express.Router();

// Set up storage for uploaded CVs (This remains the same)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/cvs/';
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter to allow only PDF and DOCX (This remains the same)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('PDF እና DOCX ፋይሎች ብቻ ይፈቀዳሉ!'), false); 
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB የፋይል መጠን ገደብ
    fileFilter: fileFilter
});


// @desc    አዲስ የስራ ማመልከቻ አስገባ
// @route   POST /api/applications
// @access  Public
router.post(
    '/',
    upload.single('cvUpload'), // 'cvUpload' ከform ውስጥ ያለው የinput field ስም ነው
    applicationController.submitApplication // CHANGED: Call the controller function
);

// @desc    ሁሉንም ማመልከቻዎች አግኝ (ለአድሚን)
// @route   GET /api/applications
// @access  Private (Admin only)
router.get(
    '/',
    protect, // CHANGED: Add protect middleware
    applicationController.getAllApplications // CHANGED: Call the controller function
);

// @desc    ማመልከቻን ሰርዝ (ለአድሚን)
// @route   DELETE /api/applications/:id
// @access  Private (Admin only)
router.delete(
    '/:id',
    protect, // CHANGED: Add protect middleware
    applicationController.deleteApplication // CHANGED: Call the controller function
);

module.exports = router;