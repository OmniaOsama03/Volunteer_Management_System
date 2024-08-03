const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Events', {

});

// Define the Event schema and model
const eventSchema = new mongoose.Schema({
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

app.use(cors());
app.use(bodyParser.json());

// Define the /createEvent endpoint
app.post('/createEvent', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).send('Event created successfully');
    } catch (error) {
        res.status(500).send('Error creating event: ' + error.message);
    }
});

// Define the /getEvents endpoint
app.get('/getEvents', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).send('Error fetching events: ' + error.message);
    }
});

// Start the server
const PORT = process.env.PORT || 8008;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
