const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();



app.use(express.static('public'));

const eventsRoute = require('./api/roots/events');
const usersRoute = require('./api/roots/users');

const corsOptions = {
    origin: 'https://eventlink-431700.df.r.appspot.com' 
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
