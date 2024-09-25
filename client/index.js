// index.js

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline-sync');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
        // Start your application logic
        mainMenu();
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// Define your User schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    usertype: {
        type: String,
        enum: ['student', 'instructor'],
        default: 'student',
    },
});

const User = mongoose.model('User', UserSchema);

// Main menu function
function mainMenu() {
    console.log('\n--- Peer Assessment System ---\n');
    console.log('1. Add User');
    console.log('2. Exit');

    const choice = readline.question('\nEnter your choice: ');

    switch (choice) {
        case '1':
            addUser();
            break;
        case '2':
            console.log('Exiting...');
            mongoose.disconnect();
            process.exit(0);
        default:
            console.log('Invalid choice, please try again.');
            mainMenu();
    }
}

// Function to add a user
async function addUser() {
    try {
        const email = readline.question('Enter email: ');
        const firstname = readline.question('Enter first name: ');
        const lastname = readline.question('Enter last name: ');
        const password = readline.question('Enter password: ', { hideEchoBack: true });
        const usertype = readline.question('Enter user type (student/instructor): ');

        // Basic input validation
        if (!email || !firstname || !lastname || !password || !usertype) {
            console.log('All fields are required.');
            return mainMenu();
        }

        if (!['student', 'instructor'].includes(usertype.toLowerCase())) {
            console.log('Invalid user type. Must be "student" or "instructor".');
            return mainMenu();
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already in use.');
            return mainMenu();
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            email,
            firstname,
            lastname,
            password: hashedPassword,
            usertype: usertype.toLowerCase(),
        });

        // Save the user to the database
        await newUser.save();
        console.log('User added successfully!');
    } catch (err) {
        console.error('Error adding user:', err.message);
    } finally {
        // Return to the main menu
        mainMenu();
    }
}
