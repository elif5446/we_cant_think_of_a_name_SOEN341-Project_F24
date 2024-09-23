// Import the Express library
import express from 'express';

// Create a new 'router' (this is like a mini server that handles different requests)
const router = express.Router();

// POST request for login (this handles logins)
router.post('/login', (req, res) => {
    // Get the email and password sent from the app (frontend)
    const { email, password } = req.body;

    // Check if the email and password match (this is just an example, you will replace it with real logic)
    if (email === "test@example.com" && password === "password") {
        // If they match, send a success response back
        return res.status(200).json({ message: "Login successful!" });
    } else {
        // If they don't match, send a failure response back
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

// GET request for user data (this sends user info when requested)
router.get('/user', (req, res) => {
    // Example of user information (normally you'd fetch this from a database)
    const user = {
        name: "Test User",
        email: "test@example.com",
    };
    
    // Send this user info back to the frontend
    return res.status(200).json(user);
});

// Export the router so it can be used in other parts of the app
export default router;
