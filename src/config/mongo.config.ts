import mongoose, { ConnectOptions } from 'mongoose';
import logger from '../utils/logger';

const mongoConnect = () => {
  const devURL = process.env.LOCAL_MONGO_URL as string;
  const prodURL = process.env.PROD_MONGO_URL as string;
  const mode = process.env.NODE_ENV as string;
  const URL = mode === 'development' ? devURL : prodURL;

  return new Promise<void>((resolve, reject) => {
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    } as ConnectOptions);

    const db = mongoose.connection;

    db.on('error', (err) => {
      logger.error('Connection error:', err);
      reject(err);
    });

    db.once('open', () => {
      logger.info(`Connected to MongoDB with ${mode} mode !`);
      resolve();
    });
  });
};

export default mongoConnect;
