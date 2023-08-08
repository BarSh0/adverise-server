import * as adsSdk from 'facebook-nodejs-business-sdk';
import { FBAdSetValidate, IFBAdSet } from '../../../types/facebookTypes/FBAdSet';

const isDevMode = process.env.NODE_ENV === 'development';

export const get = async (accessToken: string, campaignId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const campaign = new adsSdk.Campaign(campaignId);
  const adSets = await campaign.getAdSets(['id', 'name']).catch((err) => {
    console.error(`Error in getting ad sets for campaign ${campaignId}`);
    throw err;
  });
  console.info(`Getting ad sets for campaign ${campaignId}`);
  return adSets;
};

export const create = async (accessToken: string, adSet: IFBAdSet) => {
  FBAdSetValidate(adSet);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const audience = new adsSdk.SavedAudience(adSet.audience.id);

  const targetRes = await audience.read(['id', 'targeting']);
  const targeting = targetRes._data.targeting;

  targeting['publisher_platforms'] = ['facebook'];
  targeting['facebook_positions'] = ['feed'];

  const account = new adsSdk.AdAccount(adSet.accountId);

  let fields = ['id'];
  let params = {
    name: adSet.audience.name,
    campaign_id: adSet.campaignId,
    optimization_goal: 'POST_ENGAGEMENT',
    billing_event: 'IMPRESSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    targeting: targeting,
    status: 'PAUSED',
  };

  const createdAdSet = await account.createAdSet(fields, params).catch((err) => {
    console.error(`Error in creating ad set for audience ${adSet.audience.name} of the account: ${adSet.accountId}`);
    throw err;
  });
  console.info(`Creation of Ad set for audience ${adSet.audience.name} of the account: ${adSet.accountId} is done!`);

  return createdAdSet;
};

export const duplicate = async (accessToken: string, adSetId: string, adSet: IFBAdSet) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const AdSet = new adsSdk.AdSet(adSetId);
  const fields = ['id'];
  const params = {
    'rename_options[rename_strategy]': 'KEEP_STRUCTURE',
    status: 'ACTIVE',
    campaign_id: adSet.campaignId,
  };

  const newAdSet = await AdSet.createCopy(fields, params).catch((err) => {
    console.error(`Error in duplicating ad set ${adSetId}`);
    throw err;
  });
  console.info(`Duplicating of ad set ${adSetId} is done!`);

  return newAdSet;
};
