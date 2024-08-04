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
router.post('/', async (req, res, next) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
 
// GET route to fetch all events
router.get('/', async (req, res, next) => {
    try 
    {
        const events = await Event.find();

        res.status(200).json(events);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
 
//GET route to filter events based on category, date, location, &
router.get('/filter', async (req, res) => {

    const category = req.query.category;
    const date = req.query.date;
    const location = req.query.location;
    const visibility = req.query.visibility;
    
    // Building the filter query
    let filterQuery = {};

    if (category) 
    {
        filterQuery.category = category;
    }

    if (date) 
    {
        filterQuery.date = new Date(date); 
    }

    if (location) 
    {
        filterQuery.location = location; 
    }

    if (visibility) 
    {
        filterQuery.visibility = visibility;
    }

    // Find events based on the filterQuery
    Event.find(filterQuery)
        .then(events => 
        {
            res.status(200).json(events); // Return the events array, even if empty
        })
        .catch(error => 
        {
            res.status(500).json({ error: 'An error occurred while fetching events.' });
        });
});

// GET route to search based on title
router.get('/search', (req, res) => 
{

    const searchTerm = req.query.title ? req.query.title : '';

    if(searchTerm == '') //return all events
    {
        Event.find().then(events => 
        {
            res.status(200).json(events);
                
        }).catch(error => 
        {
            res.status(500).json({ message: 'Error fetching events', error });
        });
        
    }else
    {
        Event.find({ title: searchTerm }).then(events => 
        {
            res.status(200).json(events);
            
        }).catch(error => 
        {
            res.status(500).json({ message: 'Error fetching events', error });
        });
}
    
});

module.exports = router;
