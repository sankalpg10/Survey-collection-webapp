const mongoose = require('mongoose');
const { Schema } = mongoose;
// above line and this line -> 'const Schema = mongoose.Schema' -> are the doing same thing; // this is code destructuring

const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
});

mongoose.model('users', userSchema);
