import logger from './logger';
import * as adsSdk from 'facebook-nodejs-business-sdk';

const isDevMode = process.env.NODE_ENV === 'development';

const getLastPostId = async (accessToken: string, pageId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const page = new adsSdk.Page(pageId);

  const fields = ['message', 'created_time', 'id'];
  const params = { limit: 1 };
  const post = await page.getPosts(fields, params).catch((err) => {
    logger.error(`Error in getting last post for page ${pageId}`);
    throw err;
  });

  logger.info(`Getting last post for page ${pageId}`);
  return post[0].id;
};

export const facebookUtils = {
  getLastPostId,
};
