import app from '../app.mjs';
import * as dotenv from 'dotenv';
import Database from "../database/database.mjs"

dotenv.config();
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

  app.listen(PORT, () => {
    console.log(`Server started at localhost http://localhost:${PORT}`);
  });
})();