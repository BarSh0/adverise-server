import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoConnect from './src/config/mongo.config';
import router from './src/routes/router';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

mongoConnect().then(() => {
  app.use(cors());
  app.use(express.json());
  app.use('/', router);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
