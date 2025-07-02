// lucycollege-backend/models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    // 'date' field can be removed if you only rely on 'createdAt' from timestamps
    // For consistency, let's keep it for now, but 'createdAt' is preferred for display
    date: { 
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'archived'], 
        default: 'unread' 
    }
}, {
    timestamps: true // This is crucial for preventing duplicates and managing creation/update dates
});

module.exports = mongoose.model('Contact', ContactSchema);