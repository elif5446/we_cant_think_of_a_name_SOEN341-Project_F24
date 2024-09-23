import express from "express"

const router = express.Router()
router.use(express.json())

router.post("/api/testing/yes", (req, res) => {
    console.log(req.body)
    const x = req.body.username + " | " + req.body.password
    res.json({yousef: x}).status(200)
})

export default router

