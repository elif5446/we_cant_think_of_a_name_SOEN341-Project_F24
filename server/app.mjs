// Import Express (your server library)
import express from 'express';

// Import the API routes you just created
import apiRoutes from './routes/api.mjs';

// Create an instance of your server
const app = express();

// Tell the server to use JSON data (this helps the server read information sent to it)
app.use(express.json());

// Tell the server to use the routes defined in 'api.mjs' for any request that starts with '/api'
app.use('/api', apiRoutes);

// Tell the server to listen for requests on a specific port (usually 3000)
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
