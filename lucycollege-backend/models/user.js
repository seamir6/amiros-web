// lucycollege-backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // bcryptjs ፓኬጁን አስገባ

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // ይህ ማለት 'username' የግድ መኖር አለበት ማለት ነው
        unique: true,   // እያንዳንዱ username ልዩ መሆን አለበት
        trim: true      // የባዶ ቦታዎችን ከመጀመሪያው እና መጨረሻው ላይ ያስወግዳል
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // ኢሜል በትንሽ ፊደል (lowercase) እንዲቀመጥ
        match: [/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please add a valid email'] // ትክክለኛ የኢሜል ፎርማት ለማረጋገጥ
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'instructor', 'student'], // የተፈቀዱት roles እነዚህ ብቻ ናቸው
        default: 'user' // default role 'user' ነው
    },
    date: {
        type: Date,
        default: Date.now // የ registration ቀን default አሁን ያለውን ቀን ይሆናል
    }
}, {
    timestamps: true // createdAt እና updatedAt የሚባሉ fields በራስ-ሰር ይጨምራል
});

// Password ከመቀመጡ በፊት Hash እንዲደረግ የሚያደርግ middleware
// 'pre' hook ማለት save ከመደረጉ በፊት ይህን አድርግ ማለት ነው
UserSchema.pre('save', async function(next) {
    // password ካልተቀየረ ወይም አዲስ ካልሆነ ወደ ሚቀጥለው ሂድ
    if (!this.isModified('password')) {
        next();
    }

    // Password ን Hash አድርግ
    const salt = await bcrypt.genSalt(10); // Salt generate አድርግ (10 rounds)
    this.password = await bcrypt.hash(this.password, salt); // Password ን Hash አድርግ
    next();
});

// የተጠቃሚውን የገባውን password hashed password ጋር የሚያወዳድር method
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// UserSchema ን ወደ User ሞዴል ቀይርና ወደ ውጭ ላክ
module.exports = mongoose.model('User', UserSchema);