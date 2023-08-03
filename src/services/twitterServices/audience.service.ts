import { newTwitterAdsAPI } from './config';

export const getAllAudiences = async (accountId: string, accessToken: string, accessTokenSecret: string) => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  return new Promise((resolve, reject) => {
    T.get(`accounts/${accountId}/custom_audiences`, { count: 1000 }, (error: any, resp: any, body: any) => {
      if (error) {
        reject(error);
      }
      resolve(body.data);
    });
  });
};

export const getAudienceById = async (
  accountId: string,
  audienceId: string,
  accessToken: string,
  accessTokenSecret: string
) => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  return new Promise((resolve, reject) => {
    T.get(`accounts/${accountId}/custom_audiences/${audienceId}`, (error: any, resp: any, body: any) => {
      if (error) {
        reject(error);
      }
      resolve(body.data);
    });
  });
};
