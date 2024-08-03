const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const eventsRoute = require('./api/roots/events');
const usersRoute = require('./api/roots/users');

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

let UserModel = mongoose.model("user", userSchema);

module.exports = app;
