const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hashing
// mongoose middleware - pre (just before saving in db)
personSchema.pre('save', async function (next) {
  const person = this;

  // hash password only when it has been modified or new
  if (!person.isModified('password')) return next();

  try {
    // hash password

    // generate salt
    const salt = await bcrypt.genSalt(10);

    // hashed password generation
    const hashedPassword = await bcrypt.hash(person.password, salt);

    // override the plain password with hashed password
    person.password = hashedPassword;

    next();
  } catch (err) {
    return next(err);
  }
});

personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatched = await bcrypt.compare(candidatePassword, this.password);
    return isMatched;
  } catch (err) {
    throw err;
  }
};

// create Person model
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
