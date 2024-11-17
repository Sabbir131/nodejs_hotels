const express = require('express');
const app = express();

// db connection
const db = require('./db');

// body parser middleware
const bodyParser = require('body-parser');

// import the router files
const personRoutes = require('./routes/personRoutes.js');
const menuRoutes = require('./routes/menuRoutes.js');

// dotenv
require('dotenv').config();

// PORT
const PORT = process.env.PORT || 3000;


// middlewares
app.use(bodyParser.json()); // parse json data into js object

app.use('/person', personRoutes); // redirect to personRoutes endpoints
app.use('/menuitem', menuRoutes); // redirect to menuRoutes

// GET homepage
app.get('/', function (req, res) {
  res.send('Welcome to Hotel');
});


// PORT to listen for this server
app.listen(PORT, () => console.log('Server started...'));
