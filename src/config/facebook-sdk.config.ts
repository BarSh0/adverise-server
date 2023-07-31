import logger from '../utils/logger';

const adsSdk = require('facebook-nodejs-business-sdk');

const AdAccount = adsSdk.AdAccount;
const Campaign = adsSdk.Campaign;

const access_token =
  'EAAe9FnaGY5gBAJBANWDrCkj5zrvs8ecsCZB0aodXvLxIAHPmtZA6y9U7A7EhMqVJjJveLXLBRN6i7Y9V4zDmgjqvB2uD3DZAdz0NCSONFZAqmB7jny3n5E5liMwJTZAw8YJJZBwgvYZBKHWkb9kl0r12E5vTHGqZCm4gNAbUcC4Me8WfTrWPe6VvGpjX6TvtCpOu4ytw1fbaxg3L7ItZBYSXxZBDai3ifVcnftZAiZBA80sxVuhXJdI7sjd1';
const app_secret = '70ba87b9755fc1820f4a7ea9e68e1636';
const app_id = '2178229012423576';
const id = 'act_387500915456303';

const api = adsSdk.FacebookAdsApi.init(access_token);
const showDebugingInfo = true;
if (showDebugingInfo) {
  api.setDebug(true);
}

const logApiCallResult = (apiCallName: any, data: any) => {
  console.log(apiCallName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data));
  }
};

export const testApi = async () => {
  try {
    let fields: any[] = [];
    let params = {
      name: 'My Campaign',
      objective: 'LINK_CLICKS',
      status: 'PAUSED',
      special_ad_categories: 'NONE',
    };

    const campaigns = new AdAccount(id).createCampaign(fields, params);
    logApiCallResult('campaigns api call complete.', campaigns);
    console.log('campaigns:', await campaigns);
  } catch (error) {
    logger.error(error);
  }
};
