// sets up Passport with a local authentication strategy, using a Person model for user data. - Auth.js file

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person'); // Adjust the path as needed

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // logging
      // console.log('Received credentials:', username, password);

      const user = await Person.findOne({ username });

      if (!user) return done(null, false, { message: 'Incorrect username.' });

      // const isPasswordMatch = user.password === password ? true : false;

      // compared user given password with stored password in db
      const isPasswordMatch = await user.comparePassword(password);

      // logging - error finding purpose
      // console.log('isPasswordMatch:', isPasswordMatch);

      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport; // Export configured passport
