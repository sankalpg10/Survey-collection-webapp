const passport = require('passport'); // this is the node module and not our passport.js file

module.exports = app => {
    app.get(
        '/auth/google', 
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/surveys');
        }
    );

    app.get(
        '/api/logout', 
        (req, res) => {
            req.logout();
            res.redirect("/");
        }
    );

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

};
// whenever user comes to this route we hand him over to passport # internally string 'google' is identifier of the GoogleStrategy we created
// Scope specifies the google servers what things we need from the users profiles information

 // handle the case when user visits /auth/google/callback
/* this time around the code would be there in the url and passport would see it and attempt to fetch information
instead of authenticating user*/


// req.logout is a function that takes user id and kills the cookie