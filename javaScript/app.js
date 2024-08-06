const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(express.static('public'));

const eventsRoute = require('./api/roots/events');
const usersRoute = require('./api/roots/users');

const path = require('path');

// Serve static files from the root of your project
app.use(express.static(path.join(__dirname, '..')));

// Define a route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'HomePage.html'));
});

const corsOptions = {
    origin: 'http://35.224.154.82/' 
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/events', eventsRoute);
app.use('/users', usersRoute);

//connect through connection string + specify desired db
mongoose.connect('mongodb+srv://omniaosama432:kWQH4LbykAj2ZBz3@cluster0.mdkkgqx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Events')



module.exports = app;
