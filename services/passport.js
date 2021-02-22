const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // It has multiple property but we are only going to use Strategy property
const mongoose = require('mongoose');
const keys = require('../config/keys'); // importing keys

const User = mongoose.model('users'); // we do not need to require our mongoose User.js file, we would use this instead

passport.serializeUser((user, done) => {
    done(null, user.id); //  user.id != profile.id it is the id that the user profile have in our database. Why? if we have multiple oauth login then all of them would not have a google id, the may be facebook id or someother id and thus there could be errors.
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
	    done(null, user);	   
    });
});

passport.use(
  new GoogleStrategy(
    {
       clientID: keys.googleClientID,
       clientSecret: keys.googleClientSecret,
	   callbackURL: '/auth/google/callback',
	   proxy: true
    }, 
      async (accessToken, refreshToken, profile, done) => {
		const existingUser = await User.findOne({ googleId: profile.id })
		// existing user would be either a mongoose model instance if found else Null 
		if (existingUser) {
			// we already have a record the given profile ID
			 return done(null, existingUser); // first argument is an error object it communicates to passport that something went wrong. Therfore, Null means there  is no error here, we are totally happy, and the other argument is User record
		}
		// we don't have a user record with this ID, make a new record
		const user = await new User({ googleId: profile.id }).save()
		done(null, user); // this is an aynchronous function and thus we need to wait until it finishes
		// here the user we created vs the user inside the then callback are different model instances but of the same record. The second user instance is newer and fresher	 
    }
  )
); // passport.use is making passport ready for using GoogleStrategy. new GoogleStrategy creates a new instance of passport google strategy.
// in GoogleStrategy the third thing we specify is the route that the user is sent to after they grant permission to our application.
// refresh token would allow us to refreh token because access token automatically expires after sometimes and refresh token allows us to automatically update access token.
// the new User line only creates a new instance of user. It does not automatically save it to mongo database but only exist on mongoose. We need to call .save() function to do that.
// User.findOne is an asynchronous code, it does not return anything, what it returns is a promise
