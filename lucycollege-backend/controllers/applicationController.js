// lucycollege-backend/controllers/applicationController.js

const asyncHandler = require('express-async-handler');
const Application = require('../models/Application'); // Application Model ን አስመጣን
const fs = require('fs'); // ፋይሎችን ለመሰረዝ አስመጣን
const path = require('path'); // የፋይል መንገዶችን ለማስተናገድ

// @desc    አዲስ የስራ ማመልከቻ አስገባ
// @route   POST /api/applications
// @access  Public
// (Note: This function is slightly different from applicationRoutes.js's direct POST)
exports.submitApplication = asyncHandler(async (req, res) => {
    const { fullName, gender, age, email, phone, position, education, experience, coverLetter, applicantNotes } = req.body;

    // req.file comes from multer middleware, which should be handled in the route
    const cvUploadPath = req.file ? req.file.path : null; 

    // የCV ፋይል መጫኑን አረጋግጥ
    if (!cvUploadPath) {
        res.status(400);
        throw new Error('እባክዎ የCV ፋይል ያስገቡ።'); // Please upload a CV file.
    }

    // ቀላል የመረጃ ማረጋገጫ
    if (!fullName || !gender || !age || !email || !position || !education || !experience) {
        // አስፈላጊ መረጃዎች ከጎደሉ የተሰቀለውን ፋይል ሰርዝ
        if (cvUploadPath && fs.existsSync(cvUploadPath)) {
            fs.unlink(cvUploadPath, (err) => {
                if (err) console.error("ፋይል ሲሰረዝ ስህተት ተፈጥሯል:", err); // Error deleting file
            });
        }
        res.status(400);
        throw new Error('እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ (ሙሉ ስም፣ ጾታ፣ ዕድሜ፣ ኢሜል፣ የስራ መደብ፣ ትምህርት፣ ልምድ)።'); // Please fill in all required fields
    }

    try {
        const newApplication = await Application.create({
            fullName,
            gender,
            age,
            email,
            phone,
            position,
            education,
            experience,
            cvUpload: cvUploadPath, // የተሰቀለውን CV ፋይል መንገድ አስቀምጥ
            coverLetter,
            applicantNotes
        });

        res.status(201).json({
            success: true,
            message: 'የስራ ማመልከቻው በተሳካ ሁኔታ ገብቷል!', // Job application submitted successfully!
            data: newApplication
        });
    } catch (error) {
        console.error("የማመልከቻ ማስገቢያ ስህተት:", error); // Application submission error
        // በዳታቤዝ ላይ ስህተት ከተፈጠረ የተሰቀለውን ፋይል ሰርዝ
        if (cvUploadPath && fs.existsSync(cvUploadPath)) {
            fs.unlink(cvUploadPath, (err) => {
                if (err) console.error("ከዳታቤዝ ስህተት በኋላ ፋይል ሲሰረዝ ስህተት ተፈጥሯል:", err); // Error deleting file after DB error
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: 'ማመልከቻውን ሲያስገቡ የserver ስህተት ተፈጥሯል።' }); // Server error during application submission.
    }
});


// @desc    ሁሉንም ማመልከቻዎች አግኝ (ለአድሚን)
// @route   GET /api/applications
// @access  Private (Admin only)
exports.getAllApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({}).sort({ createdAt: -1 }); // በአዲሱ ቅደም ተከተል
    res.status(200).json({
        success: true,
        count: applications.length,
        data: applications
    });
});

// @desc    ማመልከቻን ሰርዝ (ለአድሚን)
// @route   DELETE /api/applications/:id
// @access  Private (Admin only)
exports.deleteApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
        res.status(404);
        throw new Error('የስራ ማመልከቻው አልተገኘም።'); // Job application not found.
    }

    // CV ፋይሉ ካለ ከserver ላይም ሰርዝ
    if (application.cvUpload && fs.existsSync(application.cvUpload)) {
        fs.unlink(application.cvUpload, (err) => {
            if (err) console.error("CV ፋይል ሲሰረዝ ስህተት ተፈጥሯል:", err); // Error deleting CV file
        });
    }

    await application.deleteOne(); // Change deleteOne() as findByIdAndDelete() will not return the document to unlink before delete

    res.status(200).json({
        success: true,
        message: 'የስራ ማመልከቻው በተሳካ ሁኔታ ተሰርዟል።' // Job application deleted successfully!
    });
});