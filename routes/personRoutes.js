const express = require('express');
const Person = require('../models/Person');
const router = express.Router();

// POST data at /person api endpoint
router.post('/', async (req, res) => {
  try {
    const data = req.body; // req.body contains parsed person data

    // create a new person document (row) using Mongoose model
    const newPerson = new Person(data);

    // save new person in the database
    const response = await newPerson.save();

    console.log('Data saved'); // for serser-side confirmation

    res.status(200).json(response); // for client's confirmation
  } catch (err) {
    console.log(err); // for server-side
    res.status(500).json({ error: 'Internal Server Error' }); // for client-side
  }
});

// GET the Person Collection
router.get('/', async (req, res) => {
  try {
    const data = await Person.find();

    console.log('Data sent successfully');

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Parameterized URL path - path parameters of endpoint '/person'

// GET each profession's persons data
router.get('/:professionType', async (req, res) => {
  try {
    const professionType = req.params.professionType; // extract professionType from URL

    if (
      professionType === 'chef' ||
      professionType === 'manager' ||
      professionType === 'waiter'
    ) {
      const response = await Person.find({ profession: professionType });
      console.log('response fetched successfully');
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Invalid profession type' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT => update documents/records
router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedPersonData = req.body;

    // find document by unique object id (_id) set by mongodb
    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, // return updated new document
        runValidators: true, // run mongoose validation
      }
    );

    // 3 cases may happen here: Success, Failure (err), null (if given false id not present in collection in db)

    // null => nothing returned - given wrong id that doesn't exist
    if (!response) {
      return res.status(404).json({ error: 'Person not Found' });
    }

    console.log('Data updated');
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE document/record
router.delete('/:id', async (req, res) => {
  try {
    const personId = req.params.id; // extract person's id from URL parameter

    // assuming the given person (id) document exists in colleciton
    const response = await Person.findByIdAndDelete(personId);

    // client's fault
    // nothing returned - given wrong id that doesn't exist
    if (!response) {
      return res.status(404).json({ error: 'Person not Found' });
    }

    console.log('Data deleted');
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (err) {
    // no one's fault. if anything breaks or automatically error happens for some reason.
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// export router
module.exports = router;
