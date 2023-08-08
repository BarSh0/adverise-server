import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoConnect from './src/config/mongo.config';
import router from './src/routes/router';
import swagger from './src/utils/swagger';
import logger from './src/utils/logger';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

mongoConnect().then(() => {
  app.use(cors());
  app.use(express.json());
  app.use('/', router);

  /**
   * @openapi
   * /:
   *  get:
   *   description: Use to test the server
   *  responses:
   *   200:
   *   description: A successful response
   */
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    swagger(app, PORT);
  });
});
