// lucycollege-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User ሞዴልን እናስገባለን
const asyncHandler = require('express-async-handler'); // ይህንን መስመር ጨምር!

// ሚስጥራዊ ቁልፍ ከ .env ፋይል እንዲመጣ እናረጋግጣለን
// .env ፋይልህ ውስጥ JWT_SECRET እንዳለህ አረጋግጥ!
require('dotenv').config();

// Authentication Middleware (የተጠቃሚውን ማንነት ማረጋገጥ)
const protect = asyncHandler(async (req, res, next) => { // 'asyncHandler' እዚህ ጋር ጨምረናል!
    let token;

    // Token ው በ headers ውስጥ መኖሩን እናረጋግጣለን
    // 'Authorization' header 'Bearer TOKEN_STRING' በሚለው ቅርጸት መሆኑን እንፈትሻለን
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token ን ከ "Bearer TOKEN_STRING" የሚለው ውስጥ እንወስዳለን (TOKEN_STRING ብቻ)
            token = req.headers.authorization.split(' ')[1];

            // Token ን እንፈትሻለን (verify) - ትክክለኛነቱን እና ጊዜው ያለፈበት መሆኑን
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // የተጠቃሚውን መረጃ (ፓስወርድ ሳይጨምር) ከ ዳታቤዝ ላይ እንፈልጋለን
            // .select('-password') ማለት ፓስወርዱን አታምጣ ማለት ነው
            // req.user ውስጥ ተጠቃሚው id, email, role ወዘተ እንዲኖረው እናደርጋለን
            // ይህ መረጃ በ authorize middleware እና route handlers ውስጥ ጥቅም ላይ ይውላል
            req.user = await User.findById(decoded.id).select('-password'); 

            // ወደ ሚቀጥለው middleware function ወይም route handler እንዲቀጥል እናደርጋለን
            next();
        } catch (error) {
            console.error('Token verification error:', error); // ስህተቱን በ Terminal ለማየት
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Token ው ከሌለ (header ውስጥ ካልተገኘ)
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
});

// Authorization Middleware (የተጠቃሚውን መብት ማረጋገጥ)
const authorize = (roles) => { // 'roles' የሚጠበቁ የ roles array ነው (ለምሳሌ: ['admin'], ['student', 'instructor'])
    return (req, res, next) => {
        // req.user የሚመጣው ከ 'protect' middleware ነው
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Not authorized, user role not found' });
        }

        // የተጠቃሚው role በምንፈልጋቸው roles ውስጥ መኖሩን እንፈትሻለን
        if (!roles.includes(req.user.role)) {
            // ተጠቃሚው Login ቢያደርግም የሚፈለገውን ተግባር ለመስራት መብት የለውም
            return res.status(403).json({ message: `Not authorized, ${req.user.role} role cannot access this resource` });
        }

        // ሁሉም ነገር ትክክል ከሆነ ወደ ሚቀጥለው ሂድ
        next();
    };
};

// እነዚህን middleware functions ለሌሎች ፋይሎች እንድትጠቀምባቸው እንልካለን
module.exports = { protect, authorize };