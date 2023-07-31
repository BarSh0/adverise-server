import express from 'express';
import cors from 'cors';
import router from './src/routes/router';
import mongoConnect from './src/config/mongo.config';
import dotenv from 'dotenv';
import './src/services';
// const { Autohook } = require('twitter-autohook');
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import session from 'express-session';
import twitterCred from './twitterCred';
import userAccessValidate from './src/middleware/userAccessValidate';

passport.use(
  new TwitterStrategy(
    {
      consumerKey: twitterCred.consumer_key,
      consumerSecret: twitterCred.consumer_secret,
      callbackURL: 'http://localhost:8080/auth/twitter/callback',
    },
    (token, tokenSecret, profile, cb) => {
      console.log('profile:', profile);
      console.log('token:', token);
      console.log('tokenSecret:', tokenSecret);
      return cb(null, { token, tokenSecret, profile });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj: any, cb) {
  cb(null, obj);
});

dotenv.config();

const app = express();

const PORT = 8080;

mongoConnect();
app.use(cors());
app.use(express.json());
app.use('/', router);
app.use(session({ secret: 'whatever', resave: true, saveUninitialized: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// app.get('/auth/twitter', passport.authenticate('twitter'));
// app.get(
//   '/auth/twitter/callback',
//   passport.authenticate('twitter', { failureRedirect: 'http://localhost:3000/connections' }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     console.log(req.body);
//     res.redirect('http://localhost:3000/connections');
//   }
// );

// const server = https.createServer(serverOptions, app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
