// Load environment variables from .env file
require('dotenv').config();

const mongoose = require('mongoose');

// Get the MongoDB URI from .env
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error: ', err));


const User = require('./models/User');

// Create a new user (replace usertype with student or instructor)
const newUser = new User({
    email: 'jmadhojkssdfasddunw@gmail.com',
    firstname: 'Johndss',
    lastname: 'Dossde',
    password: 'jondss',
    usertype: 'instructor',
});

newUser.save()
    .then(user => console.log('User Created: ', user))
    .catch(err => console.log('Error Creating User: ', err));
