import axios from 'axios';
import * as adsSdk from 'facebook-nodejs-business-sdk';
import logger from '../../../utils/logger';

const isDevMode = process.env.NODE_ENV === 'development';

export const getPages = async (accessToken: string, adAccountId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const adAccount = new adsSdk.AdAccount(adAccountId);
  const fields = ['id', 'name', 'picture'];
  const params = {};
  const pages = await adAccount.getPromotePages(fields, params).catch((err) => {
    logger.error(`Error in getting pages for ad account ${adAccountId}`);
    throw err;
  });
  const pagesData = pages.map((page: any) => {
    return { pageId: page._data.id, name: page._data.name, picture: page._data.picture.data.url };
  });
  return pagesData;
};

export const subscribePageToWebhook = async (pageId: string, pageAccessToken: string) => {
  const result = await axios.post(`https://graph.facebook.com/${pageId}/subscribed_apps?subscribed_fields=feed
    &access_token=${pageAccessToken}`);

  const response = result.data;

  logger.info(`Subscribing page ${pageId} to webhook is done!`);
  return response;
};
