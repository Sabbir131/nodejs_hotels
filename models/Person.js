const { uniqueId } = require('lodash');
const mongoose = require('mongoose');

// define person Schema/Model
// field: type (data type), validation so on
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  profession: {
    type: String,
    enum: ['chef', 'waiter', 'manager'], // profession must be one of these predefined string values
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
  },
});

// create Person model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
