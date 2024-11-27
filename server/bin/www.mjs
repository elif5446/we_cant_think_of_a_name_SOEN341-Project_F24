/* global process */
import app from '../app.mjs';
import * as dotenv from 'dotenv';
import Database from "../database/database.mjs"

// fetching
dotenv.config();
// connecting to port 3001 (default)
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    //creating singleton instance
    const database = new Database()
    //connecting to the database
    await database.connect()
  } catch (e) {
    //exiting if the connection fails
    console.log(e)
    process.exit()
  }

  // starting the server on port 3001
  app.listen(PORT, () => {
    console.log(`Server started at localhost http://localhost:${PORT}`);
  });
})();