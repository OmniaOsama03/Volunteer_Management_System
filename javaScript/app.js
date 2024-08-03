const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const eventsRoute = require('./api/roots/events');
const usersRoute = require('./api/roots/users');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/events', eventsRoute);
app.use('/users', usersRoute);

//connect through connection string + specify desired db
mongoose.connect('mongodb://localhost:27017/Events')

//create a schema
let userSchema = new mongoose.Schema
(
    {
        firstName : String,
        LastName : String,
        email : String, 
        password : String,
        isSignedIn: Boolean,
        createdEvents : Array,
        joinedEvents : Array

    }
)

const eventSchema = new mongoose.Schema
({
    name: String,
    category: String,
    title: String,
    date: Date,
    time: String,
    location: String,
    description: String,
    visibility: String
});

let EventModel = mongoose.model("event", eventSchema);
let UserModel = mongoose.model("user", userSchema);

module.exports = app;
