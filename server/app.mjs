import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
// Assuming you have routes defined in api.mjs
import userRoutes from '../server/routes/api.mjs';

const app = express(); // Initialize Express app

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: String,
    lastname: String,
    usertype: String,
});

const User = mongoose.model('User', userSchema);

// Create Account Endpoint
app.post('/api/create-account', async (req, res) => {
    try {
        const { email, password, firstname, lastname, usertype } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            firstname,
            lastname,
            usertype,
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Use your routes if applicable
// app.use('/api', userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// No export statement needed
export default app;
