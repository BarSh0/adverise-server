import twitterCred from '../../../twitterCred';
const TwitterAdsAPI = require('twitter-ads');

const newTwitterAdsAPI = (accessToken: string, accessTokenSecret: string) => {
  return new TwitterAdsAPI({
    consumer_key: twitterCred.consumer_key,
    consumer_secret: twitterCred.consumer_secret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
    sandbox: false, // defaults to
    api_version: '12', //defaults to 2
  });
};

export default newTwitterAdsAPI;
