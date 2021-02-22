const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // to enable cookies we have to use cookie-session
const passport = require('passport'); // passport will keep track of user authentication state by using cookies
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');


mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.use(
    cookieSession({
	maxAge: 30 * 24 * 60 * 60 * 1000,
	keys: [keys.cookieKey] 
    })
); // how long can this cookie can exist in browser before it expires in milliseconds
// used to sign or encrypt our cookie

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets like our main.js file, or main.css file!
    app.use(express.static('client/build')); // if not request matches before this then look into client/build directory for the matching file and if you find it send it

    // Express will serve up Index.html file if it doesn''t recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}

const PORT = process.env.PORT || 5000 // It is used to inject what are called environment variables
app.listen(PORT);
