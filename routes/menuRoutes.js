const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// POST to MenuItem Endpoints
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newMenuItem = new MenuItem(data);

    // save it
    const response = await newMenuItem.save();

    console.log('A new menu item is saved successfully');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET menu item
router.get('/', async (req, res) => {
  try {
    const data = await MenuItem.find();

    console.log('Menu Item sent successfully');
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Parameterized Routes for '/menuitem' endpoint

// GET records based on taste
router.get('/:taste', async (req, res) => {
  try {
    const taste = req.params.taste;

    if (taste === 'spicy' || taste === 'sour' || taste === 'sweet') {
      const data = await MenuItem.find({ taste: taste }); // find given taste's records

      console.log('Menu Item sent successfully');
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Invalid taste' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// export router
module.exports = router;
