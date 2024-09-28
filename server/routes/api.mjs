
import Database from '../database/database.mjs'
import express from 'express';
import mongoose from 'mongoose';
import userModel from '../routes/models/user.mjs';
    //' No curly braces needed for default imports
// Notice the curly braces
 // Ensure the correct path to your user model
import bcrypt from 'bcrypt';

const router = express.Router();

// Create account route
router.post('/api/create-account', async (req, res) => {
    const { email, password, firstname, lastname, usertype } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new userModel({
            email,
            password: hashedPassword,
            firstname,
            lastname,
            usertype,
        });

        // Save the user in the database
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;
