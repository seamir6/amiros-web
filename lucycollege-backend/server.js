// lucycollege-backend/server.js

const express = require('express');
const connectDB = require('./config/db'); // የዳታቤዝ ግንኙነትን አስመጣ
const cors = require('cors'); // CORS ፓኬጁን አስመጣ (ለcross-origin requests)
require('dotenv').config(); // .env ፋይልን ለማንበብ

// Routes አስመጣ
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes'); // Auth routesን አስመጣ
const userRoutes = require('./routes/userRoutes'); // User routesን አስመጣ
const applicationRoutes = require('./routes/applicationRoutes'); // Application routesን አስመጣ (አሁን ትክክለኛው ነው!)

const app = express();

// የዳታቤዝ ግንኙነትን አቋቁም
connectDB();

// Middleware
app.use(cors()); // CORS ን አንቃ
app.use(express.json()); // Body parser: JSON data ን ለመቀበል

// CVs ን ለማስተናገድ uploads/cvs የሚል ስታቲክ ፎልደር ያስፈልገናል
app.use('/uploads/cvs', express.static('uploads/cvs')); // ለCVs ማከማቻ static folder ነው

// Routes ን ተጠቀም
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes); // Auth Routes ን ተጠቀም
app.use('/api/users', userRoutes); // User Routes ን ተጠቀም
app.use('/api/applications', applicationRoutes); // Application Routes ን ተጠቀም (አሁን ትክክለኛው ነው!)

// Simple route for the homepage
app.get('/', (req, res) => {
  res.send('API እየሰራ ነው...'); // API is running...
});

const PORT = process.env.PORT || 3000; // Port from environment variable or 3000

// ይህ ያልተያዙ ስህተቶችን ለመያዝ ጊዜያዊ ስህተት አያያዝ middleware ነው
app.use((err, req, res, next) => {
    console.error(err.stack); // ሙሉውን የስህተት መረጃ ወደ Terminalህ ይልካል
    res.status(500).send('በserver ላይ ስህተት ተፈጥሯል!'); // Something broke on the server!
});

app.listen(PORT, () => console.log(`Server በፖርት ${PORT} ላይ እየሰራ ነው`)); // Server running on port ${PORT}