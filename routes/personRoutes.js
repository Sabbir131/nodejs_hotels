const express = require('express');
const Person = require('../models/Person');
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('../jwt');

// POST data at /person api endpoint
router.post('/signup', async (req, res) => {
  try {
    const data = req.body; // req.body contains parsed person data

    // create a new person document (row) using Mongoose model
    const newPerson = new Person(data);

    // save new person in the database
    const response = await newPerson.save();

    console.log('Data saved'); // for serser-side confirmation

    // token generation process

    const payload = {
      id: response.id,
      username: response.username,
    };

    console.log(JSON.stringify(payload));

    // const token = generateToken(response.username);
    const token = generateToken(payload);

    console.log('Token: ', token);

    res.status(200).json({ response, token }); // for client's confirmation
  } catch (err) {
    console.log(err); // for server-side
    res.status(500).json({ error: 'Internal Server Error' }); // for client-side
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // check user in db
    const user = await Person.findOne({ username });

    // if user does not exist or password don't match
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // now, generate token
    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = generateToken(payload);

    // return token as response
    return res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Customized page according to user / user related content serve
// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log('User Data: ', userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET the Person Collection
router.get('/', jwtAuthMiddleware, async (req, res) => {
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
