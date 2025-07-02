// lucycollege-backend/models/Application.js

const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'እባክዎ ሙሉ ስም ያስገቡ'], // Please add full name
            trim: true
        },
        gender: {
            type: String,
            required: [true, 'እባክዎ ጾታ ይምረጡ'] // Please select gender
        },
        age: {
            type: Number,
            required: [true, 'እባክዎ ዕድሜ ያስገቡ'], // Please add age
            min: [18, 'ዕድሜ ቢያንስ 18 መሆን አለበት'], // Age must be at least 18
            max: [65, 'ዕድሜ ከ65 መብለጥ የለበትም'] // Age cannot exceed 65
        },
        email: {
            type: String,
            required: [true, 'እባክዎ የኢሜል አድራሻ ያስገቡ'], // Please add an email address
            unique: false, // ለትግበራዎች ኢሜል ልዩ መሆን የለበትም (አንድ ሰው ለብዙ ስራዎች ሊያመለክት ይችላል)
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'እባክዎ ትክክለኛ ኢሜል ያስገቡ' // Please add a valid email
            ]
        },
        phone: {
            type: String,
            required: false, // ስልክ ቁጥር እንደ አማራጭ ነው
            match: [/^\+2519\d{8}$/, 'እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ቅርጸት (+2519xxxxxxxx) ይጠቀሙ'] // Please use a valid Ethiopian phone number format
        },
        position: {
            type: String,
            required: [true, 'እባክዎ የሚያመለክቱበትን የስራ መደብ ያስገቡ'] // Please add the position you are applying for
        },
        education: {
            type: String,
            required: [true, 'እባክዎ የትምህርት ደረጃዎን ያስገቡ'] // Please add your education level
        },
        experience: {
            type: String,
            required: [true, 'እባክዎ የስራ ልምድዎን ያስገቡ'] // Please add your work experience
        },
        cvUpload: { // የሰቀለውን CV ፋይል መንገድ ለማስቀመጥ ነው
            type: String,
            required: [true, 'እባክዎ CVዎን ያስገቡ'] // Please upload your CV
        },
        coverLetter: {
            type: String,
            required: false, // የሽፋን ደብዳቤ እንደ አማራጭ ነው
            maxlength: [2000, 'የሽፋን ደብዳቤ ከ2000 ቁምፊዎች በላይ መሆን የለበትም'] // Cover letter cannot be more than 2000 characters
        },
        applicantNotes: {
            type: String,
            required: false,
            maxlength: [1000, 'ተጨማሪ ማስታወሻዎች ከ1000 ቁምፊዎች በላይ መሆን የለባቸውም'] // Applicant notes cannot be more than 1000 characters
        }
    },
    {
        timestamps: true // createdAt እና updatedAt መስኮች በራስ-ሰር ይታከላሉ
    }
);

module.exports = mongoose.model('Application', applicationSchema);