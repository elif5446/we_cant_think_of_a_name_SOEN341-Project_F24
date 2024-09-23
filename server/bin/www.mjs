import app from "../app.mjs";
import * as dotenv from "dotenv"

dotenv.config()
const PORT = process.env.PORT
app.listen(PORT, function() {
    console.log("Server started at localhost http://localhost:" + PORT)
})