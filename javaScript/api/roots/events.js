const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
 
// Define Event schema and model
const eventSchema = new mongoose.Schema(
{
    name: String,
    category: String,
    title: String,
    date: Date,
    time: String,
    location: String,
    description: String,
    visibility: String
});
 
const Event = mongoose.model('Event', eventSchema);
 
// POST route to create an event
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
 
// GET route to fetch all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
 
module.exports = router;
