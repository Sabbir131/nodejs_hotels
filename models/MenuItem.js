const mongoose = require('mongoose');

// define schema: menuItemSchema
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  taste: {
    type: String,
    enum: ['sweet', 'spicy', 'sour'],
    required: true,
  },
  isDrink: {
    type: Boolean,
    default: false,
  },
  ingredients: {
    type: [String], // array of String
    default: [],
  },
  numOfSales: {
    type: Number,
    default: 0,
  },
});

// create model using schema: menuItemSchema
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
