import express from 'express';

const router = express.Router();
const success = 200
const clientError = 400
const noAuthAccess = 401
const serverError = 500

router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === "test@example.com" && password === "password") {
            return res.status(200).json({ message: "Login successful!" });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (e) {
        res.send(e).status(serverError)
    }

});

router.get('/user', (req, res) => {
    try {
        const user = {
            name: "Test User",
            email: "test@example.com",
        };

        return res.status(200).json(user);
    } catch (e) {
        res.send(e).status(serverError)
    }

});

router.post('/createA-account', (req, res) => {

    const { email, password, firstName, lastName, userType } = req.body;
    try{
        if (email === "test@example.com" && password === "password" && firstName != null && lastName != null && (userType === "Student" || userType === "Instructor")) {
            return res.status(200).json({ message: "Login successful!" });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    }catch(e){
        res.send(e).status(serverError)
    }
    
});

export default router;
