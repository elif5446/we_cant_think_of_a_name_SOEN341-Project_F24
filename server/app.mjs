import express from 'express';
import cors from "cors"
import apiRoutes from './routes/api.mjs';

const options = {
    origin: ["http://localhost:3001", "http://localhost:3000"]
}
const app = express();

app.use(cors(options))
app.use(express.json());
app.use('/api', apiRoutes);
app.use(express.static('../client/build'));

export default app;
