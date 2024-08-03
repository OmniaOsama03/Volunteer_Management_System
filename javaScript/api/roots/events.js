const express = require('express');
const router = express.Router();
const Event = require('../app');

// Create a new event
router.post('/', async (req, res) => {
    const { name, category, title, date, time, location, description, visibility } = req.body;

    // Validate request body
    if (!name || !category || !title || !date || !time || !location || !description || !visibility) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new event instance
    const newEvent = new Event({
        name,
        category,
        title,
        date,
        time,
        location,
        description,
        visibility
    });

    try {
        // Save the new event to the database
        await newEvent.save();
        // Send response with the created event
        res.status(201).json(newEvent);
    } catch (err) {
        // Handle errors (e.g., validation errors, database errors)
        res.status(400).json({ message: err.message });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events from the database
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
});

module.exports = router;
