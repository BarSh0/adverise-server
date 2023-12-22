import * as adsSdk from 'facebook-nodejs-business-sdk';
import { FBServices } from '.';
import { FBAdValidate, IFBAd } from '../types/FBAd';
import { FBAdCreativeValidate, IFBAdCreative } from '../types/FBAdCreative';
import { FBRuleValidate, IFBRule } from '../types/FBRule';
import logger from '../../../utils/logger';
import { IAppAdCreative } from '../types/AppAdCreative';
import Utils from '../../../utils';

const isDevMode = process.env.NODE_ENV === 'development';

export const getAdAccounts = async (accessToken: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.User('me');

  const fields = ['id', 'name', 'saved_audiences.limit(1000)'];
  const params = { limit: 500 };
  let adAccounts = await account.getAdAccounts(fields, params).catch((err) => {
    logger.error(`Error in getting ad accounts`);
    throw err;
  });
  const result = adAccounts.map((account: any) => account._data);
  return result;
};

export const getAudiencesOfAdAccount = async (accessToken: string, adAccountId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const adAccount = new adsSdk.AdAccount(adAccountId);
  const fields = ['id', 'name'];
  const params = {};
  const audiences = await adAccount.getCustomAudiences(fields, params).catch((err) => {
    logger.error(`Error in getting audiences for ad account ${adAccountId}`);
    throw err;
  });
  logger.info(`Getting audiences for ad account ${adAccountId}`);
  return audiences;
};

export const createAdCreative = async (accessToken: string, accountId: string, params: any) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.AdAccount(accountId);
  let fields = ['id', 'object_story_id'];

  const createdAdCreative = await account.createAdCreative(fields, params).catch((err) => {
    logger.error(`Error in creating ad creative for  account: ${accountId}`);
    throw err;
  });
  logger.info(`Creating ad creative for  account: ${accountId}`);

  return createdAdCreative;
};

export const getLastPostId = async (accessToken: string, pageId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const page = new adsSdk.Page(pageId);

  const fields = ['message', 'created_time', 'id'];
  const params = { limit: 1 };
  const post = await page.getPosts(fields, params).catch((err) => {
    logger.error(`Error in getting last post for page ${pageId}`);
    throw err;
  });

  logger.info(`Getting last post for page ${pageId}`);
  return post;
  // return post[0].id;
};

export const createAd = async (accessToken: string, ad: IFBAd) => {
  FBAdValidate(ad);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.AdAccount(ad.accountId);

  let fields = ['id'];
  let params = {
    name: 'Easy2Ad -' + Utils.Helpers.getCurrentDate(),
    adset_id: ad.adSetId,
    creative: { creative_id: ad.creativeId },
    status: isDevMode ? 'PAUSED' : 'ACTIVE',
  } as any;

  const adPixels = await account.getAdsPixels(['id']).catch((err) => {
    console.log('error in fetching ads pixels of adaccount - ' + ad.accountId);
    console.log(err);

    throw err;
  });

  if (adPixels.length > 0) {
    params['tracking_specs'] = [
      {
        'action.type': ['offsite_conversion'],
        fb_pixel: [adPixels[0].id],
      },
    ];
  }

  const createdAd = await account.createAd(fields, params).catch((err) => {
    logger.error(`Error in creating ad for ad set ${ad.adSetId} of the account: ${ad.accountId}`);
    throw err;
  });
  logger.info(`Creating ad for ad set ${ad.adSetId} of the account: ${ad.accountId} is done!`);

  return createdAd;
};

export const createRule = async (accessToken: string, rule: IFBRule) => {
  FBRuleValidate(rule);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.AdAccount(rule.accountId);

  const ruleName = 'Advertise Rule For Facebook';

  let fields = ['id', 'name'];
  let params = {
    name: ruleName,
    execution_spec: { execution_type: 'PAUSE' },
    schedule_spec: { schedule_type: 'SEMI_HOURLY' },
    evaluation_spec: {
      evaluation_type: 'SCHEDULE',
      filters: [
        { field: 'hours_since_creation', value: rule.adPauseTime, operator: 'GREATER_THAN' },
        { field: 'campaign.id', value: [rule.campaignId], operator: 'IN' },
        { field: 'entity_type', value: 'AD', operator: 'EQUAL' },
        { field: 'time_preset', value: 'LIFETIME', operator: 'EQUAL' },
      ],
    },
  };

  const createdRule = await account.createAdRulesLibrary(fields, params).catch((err) => {
    logger.error(`Error in creating rule for campaign ${rule.campaignId} of the account: ${rule.accountId}`);
    throw err;
  });
  logger.info(`Creating rule for campaign ${rule.campaignId} of the account: ${rule.accountId} is done!`);

  return createdRule;
};

export const updateRule = async (accessToken: string, accountId: string, campaignId: string, rule: any) => {
  FBRuleValidate(rule);
  logger.info(`Updating rule for campaign ${campaignId} of the account: ${accountId}`);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.AdAccount(accountId);

  const ruleName = 'Advertise Rule For Facebook';

  let fields = ['id', 'name'];
  let params = {
    name: ruleName,
    execution_spec: { execution_type: 'PAUSE' },
    schedule_spec: { schedule_type: 'SEMI_HOURLY' },
    evaluation_spec: {
      evaluation_type: 'SCHEDULE',
      filters: [
        { field: 'hours_since_creation', value: rule.adPauseTime, operator: 'GREATER_THAN' },
        { field: 'campaign.id', value: [campaignId], operator: 'IN' },
        { field: 'entity_type', value: 'AD', operator: 'EQUAL' },
        { field: 'time_preset', value: 'LIFETIME', operator: 'EQUAL' },
      ],
    },
  };

  const createdRule = await account.createAdRulesLibrary(fields, params).catch((err) => {
    logger.error(`Error in updating rule for campaign ${campaignId} of the account: ${accountId}`);
    throw err;
  });
  logger.info(`Updating rule for campaign ${campaignId} of the account: ${accountId} is done!`);

  return createdRule;
};

export const verifyAccessToken = async (accessToken: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.AdAccount('act_101540088953467');
  const fields = ['id'];
  const params = {};
  const result = await account.read(fields, params).catch((err) => {
    logger.error(`Error in verifying access token`);
    throw err;
  });
  logger.info(`Verifying access token`);
  return result;
};

export const isNeedDupliaction = async (accessToken: string, campaignId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const adSets = await FBServices.adSet.get(accessToken, campaignId);
  const adsPromises = adSets.map(async (adSet: any) => {
    const temp = new adsSdk.AdSet(adSet.id);
    const ads = await temp.getAds(['id'], { limit: 50 });
    return ads.length >= 50;
  });
  const results = await Promise.all(adsPromises);

  return results.some((result) => result);
};

export const uploadImage = async (accessToken: string, accountId: string, image: any) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.AdAccount(accountId);
  const fields = ['id'];
  const params = {
    bytes: image,
  };
  const result = await account.createAdImage(fields, params).catch((err) => {
    logger.error(`Error in uploading image for account: ${accountId}`);
    throw err;
  });
  logger.info(`Uploading image for account: ${accountId} is done!`);
  return result._data.images.bytes.hash;
};

export const createAdCreativeWithImage = async (accessToken: string, adCreative: IAppAdCreative) => {
  // FBAdCreativeValidate(adCreative);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const account = new adsSdk.AdAccount(adCreative.accountId);
  const fields = ['id', 'object_story_id'];
  const params = {
    name: adCreative.adName,
    object_story_spec: {
      page_id: adCreative.pageId,
      link_data: {
        message: adCreative.message,
        link: adCreative.link,
        image_hash: adCreative.imageHash,
        name: adCreative.adHeadline,
      },
    },
  };
  const result = await account.createAdCreative(fields, params).catch((err) => {
    logger.error(`Error in creating ad creative for account: ${adCreative.accountId}`);
    throw err;
  });
  logger.info(`Creating ad creative for account: ${adCreative.accountId} is done!`);
  return result;
};
