import express from 'express';

import apiRoutes from './routes/api.mjs';

const app = express();

app.use(express.json());

app.use('/api', apiRoutes);
app.use(express.static('../client/build'));

export default app;
