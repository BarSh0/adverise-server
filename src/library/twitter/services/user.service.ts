import { newTwitApi } from './config';

export const getUserDetails = async (userId: string, accessToken: string, secretToken: string): Promise<any> => {
  const twit = newTwitApi(accessToken, secretToken);
  return new Promise((resolve, reject) => {
    twit.get('users/show', { user_id: userId }, (err, data, response) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

export const getLastTweetId = async (userId: string, accessToken: string, accessTokenSecret: string): Promise<any> => {
  const twit = newTwitApi(accessToken, accessTokenSecret);
  return new Promise((resolve, reject) => {
    twit.get('statuses/user_timeline', { screen_name: userId, count: 1 }, (err, data: any, response) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
