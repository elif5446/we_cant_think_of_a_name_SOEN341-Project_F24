import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {

    const { email, password } = req.body;

    if (email === "test@example.com" && password === "password") {
        return res.status(200).json({ message: "Login successful!" });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

router.get('/user', (req, res) => {
    const user = {
        name: "Test User",
        email: "test@example.com",
    };
    
    return res.status(200).json(user);
});

export default router;
