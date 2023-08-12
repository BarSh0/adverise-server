import Twit from 'twit';
const TwitterAdsAPI = require('twitter-ads');

export const newTwitterAdsAPI = (accessToken: string, accessTokenSecret: string) => {
  return new TwitterAdsAPI({
    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
    sandbox: false, // defaults to
    api_version: '12', //defaults to 2
  });
};

export const newTwitApi = (accessToken: string, accessTokenSecret: string) => {
  return new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY as string,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
  });
};
