// lucycollege-backend/controllers/contactController.js
const Contact = require('../models/contact'); // Make sure this path is correct for your Contact model

// Controller function to get all contact messages
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}); // Fetch all contact documents from the database
        // Respond with success true and the contacts data. Ensure it's inside a 'data' field for consistency.
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        // If an error occurs, send a 500 status code with an error message
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller function to delete a contact message by its ID
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params; // Extract the ID from the request parameters
        const deletedContact = await Contact.findByIdAndDelete(id); // Find and delete the contact by ID

        if (!deletedContact) {
            // If no contact is found with the given ID, send a 404 Not Found response
            return res.status(404).json({ message: 'መልዕክቱ አልተገኘም።' });
        }
        // If deletion is successful, send a 200 OK response with a success message
        res.status(200).json({ message: 'መልዕክቱ በተሳካ ሁኔታ ተሰርዟል።' });
    } catch (error) {
        // If an error occurs during deletion, send a 500 status code with an error message
        res.status(500).json({ message: 'መልዕክቱን መሰረዝ አልቻለም።', error: error.message });
    }
};

// NEW Controller function: Mark a contact message as read/unread
exports.markContactAsRead = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the URL parameters
        // CHANGED: We now expect 'newStatus' which can be 'read' or 'unread' from the frontend
        const { newStatus } = req.body; 

        // Basic validation: Check if 'newStatus' is provided and is a valid enum value
        if (newStatus === undefined || !['read', 'unread', 'archived'].includes(newStatus)) {
            return res.status(400).json({ message: 'Invalid or missing "newStatus" in request body. Expected "read", "unread", or "archived".' });
        }

        // CHANGED: Update the 'status' field in the database
        const contact = await Contact.findByIdAndUpdate(id, { status: newStatus }, { new: true }); 

        if (!contact) {
            // If no contact is found, return a 404 Not Found error
            return res.status(404).json({ message: 'መልዕክቱ አልተገኘም።' });
        }
        // Respond with success message and the updated contact object
        res.status(200).json({ message: `መልዕክቱ እንደ${newStatus === 'read' ? 'ተነበበ' : 'አልተነበበም'} ምልክት ተደርጓል።`, contact });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error marking contact as read:', error);
        // Send a 500 status code for internal server errors
        res.status(500).json({ message: 'መልዕክቱን እንደተነበበ ምልክት ማድረግ አልቻለም።', error: error.message });
    }
};