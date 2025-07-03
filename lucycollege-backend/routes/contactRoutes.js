// lucycollege-backend/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Contact Model ን አስመጣ
// CHANGED: Import the protect middleware from authMiddleware.js
const { protect } = require('../middleware/authMiddleware'); 
// CHANGED: Import the contactController
const contactController = require('../controllers/contactController');

// Route 1: POST /api/contact - አዲስ የመገናኛ መልዕክት አስገባ (No protection here, anyone can send a message)
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // ቀላል validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save(); // መልዕክቱን ወደ ዳታቤዝ አስቀምጥ
    res.status(201).json({ message: 'Contact message sent successfully!', contact: newContact });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route 2: GET /api/contact - ሁሉንም የመገናኛ መልዕክቶች አምጣ (Protected)
// CHANGED: Added 'protect' middleware
router.get('/', protect, contactController.getAllContacts); // Using controller function now

// CHANGED: Removed the old PUT /:id/mark-as-read route as we're using PATCH now.

// Route 3: PATCH /api/contact/:id - መልዕክትን እንደተነበበ ምልክት ለማድረግ (Protected)
// CHANGED: Corrected route path to '/:id' and used 'protect' middleware.
// This route now uses the controller function from contactController.js
router.patch('/:id', protect, contactController.markContactAsRead);

// Route 4: DELETE /api/contact/:id - መልዕክት ለመሰረዝ (Protected)
// CHANGED: Added 'protect' middleware
router.delete('/:id', protect, contactController.deleteContact); // Using controller function now

module.exports = router;