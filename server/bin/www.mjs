import app from '../app.mjs';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;  // Default to port 3001 if process.env.PORT is not set

app.listen(PORT, () => {
  console.log(`Server started at localhost http://localhost:${PORT}`);
});
