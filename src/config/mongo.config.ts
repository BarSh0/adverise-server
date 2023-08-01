import mongoose, { ConnectOptions } from 'mongoose';

const mongoConnect = () => {
  const devURL = process.env.LOCAL_MONGO_URL as string;
  const prodURL = process.env.PROD_MONGO_URL as string;
  const mode = process.env.NODE_ENV as string;
  const URL = mode === 'development' ? devURL : prodURL;
  console.log(process.env.NODE_ENV);

  return new Promise<void>((resolve, reject) => {
    mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    } as ConnectOptions);

    const db = mongoose.connection;

    db.on('error', (err) => {
      console.error('Connection error:', err);
      reject(err);
    });

    db.once('open', () => {
      console.log(`Connected to MongoDB with ${mode} mode !`);
      resolve();
    });
  });
};

export default mongoConnect;
