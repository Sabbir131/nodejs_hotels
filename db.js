const mongoose = require('mongoose');

// mongodb (server) URL for connection
const mongoURL = 'mongodb://localhost:27017/hotels';

// setup mongodb connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
// Mongoose itself maintains a default connection object representing MongoDB connection
// db object => also be used to handle events and interact with the database
const db = mongoose.connection;

// define Event Listener for database connection
db.on('connected', () => console.log('connected to Mongodb server'));

// Event Listener for error
db.on('error', (err) => console.error('Mongodb connection error', err));

// Event Listener for disconnected
db.on('disconnected', () => console.log('Mongodb disconnected'));

// export db - database connection object
module.exports = db;
