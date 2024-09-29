import express from 'express';
import Database from '../database/database.mjs'

const router = express.Router()
const database = new Database()
const success = 200
const clientError = 400
const noAuthAccess = 401
const serverError = 500

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await database.getUser(email, password)
        if (result.result === "success") {
            return res.status(success).json({ message: "Login Successful!", user: result.user});
        } else if (result.result === "fail") {
            return res.status(noAuthAccess).json({ message: "Invalid Credentials" });
        } else {
            return res.status(clientError).json({ message: "User Not Found" });
        }
    } catch (e) {
        res.send(e).status(serverError)
    }

});

// router.get('/user', (req, res) => {
//     try {
//         const user = {
//             name: "Test User",
//             email: "test@example.com",
//         };

//         return res.status(200).json(user);
//     } catch (e) {
//         res.send(e).status(serverError)
//     }

// });

router.post('/create-account', async (req, res) => {
    try{
        const { email, password, firstName, lastName, userType } = req.body;

        await database.createUser(email, firstName, lastName, password, userType)
        return res.status(success).json({ message: "Login successful!" });
        // return res.status(401).json({ message: "Invalid credentials" });
    }catch(e){
        res.send(e).status(serverError)
    }
    
});

export default router;
