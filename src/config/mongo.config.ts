import mongoose, { ConnectOptions } from 'mongoose';

const mongoConnect = () => {
  mongoose.connect('mongodb://0.0.0.0:27017/adverise', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  } as ConnectOptions);

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('Connected to MongoDB database');
  });
};

export default mongoConnect;
