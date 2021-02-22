// Here we will figure out which type of environment we are and return keys for that environment

if (process.env.NODE_ENV === 'production') {
    // return prod keys
    module.exports = require('./prod');
} else {
    // return dev keys
    module.exports = require('./dev');
}