import express from 'express';
import cors from 'cors';
import indexRoute from './routes/index.js';

const app = express();

// To handle incoming requests and their data
app.use(cors());
app.use(express.json());

app.use(indexRoute);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
