import * as adsSdk from 'facebook-nodejs-business-sdk';
import { Automation } from '../database/models/automation.model';
import { FBAdValidate, IFBAd } from '../types/facebookTypes/FBAd';
import { FBAdCreativeValidate, IFBAdCreative } from '../types/facebookTypes/FBAdCreative';
import { FBAdSetValidate, IFBAdSet } from '../types/facebookTypes/FBAdSet';
import { FBCampaignValidate, IFBCampaign } from '../types/facebookTypes/FBCampaign';
import { FBRuleValidate, IFBRule } from '../types/facebookTypes/FBRule';
import { helpersUtils } from '../utils/helpers.utils';
import logger from '../utils/logger';
import axios from 'axios';

const getAdAccounts = async (accessToken: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
  const account = new adsSdk.User('me');

  const fields = ['id', 'name', 'saved_audiences'];
  const params = {};
  let adAccounts = await account.getAdAccounts(fields, params).catch((err) => {
    logger.error(`Error in getting ad accounts`);
    throw err;
  });
  logger.info(`Getting ad accounts`);

  const result = adAccounts.map((account: any) => account._data);

  return result;
};

const getAudiencesOfAdAccount = async (accessToken: string, adAccountId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
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

const getPages = async (accessToken: string, adAccountId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
  const adAccount = new adsSdk.AdAccount(adAccountId);
  const fields = ['id', 'name', 'picture'];
  const params = {};
  const pages = await adAccount.getPromotePages(fields, params).catch((err) => {
    logger.error(`Error in getting pages for ad account ${adAccountId}`);
    throw err;
  });
  logger.info(`Getting pages for ad account ${adAccountId}`);
  const pagesData = pages.map((page: any) => {
    return { pageId: page._data.id, name: page._data.name, picture: page._data.picture.data.url };
  });
  return pagesData;
};

const createCampaign = async (accessToken: string, campaign: IFBCampaign) => {
  FBCampaignValidate(campaign);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
  const AdAccount = adsSdk.AdAccount;
  const account = new AdAccount(campaign.accountId);

  const campaignName = 'Adverise - ' + campaign.pageName + ' - Facebook Posts';

  let fields = ['id, name'];
  let params = {
    name: campaignName,
    objective: campaign.objective,
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    special_ad_categories: 'NONE',
    status: 'PAUSED',
    daily_budget: campaign.dailyBudget,
  };

  const createdCampaign = await account.createCampaign(fields, params).catch((err) => {
    logger.error(`Error in creating campaign for page ${campaign.pageName} of the account: ${campaign.accountId}`);
    throw err;
  });
  logger.info(`Creating campaign for page ${campaign.pageName} of the account: ${campaign.accountId}`);

  return createdCampaign;
};

const createAdCreative = async (accessToken: string, adCreative: IFBAdCreative) => {
  FBAdCreativeValidate(adCreative);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
  const account = new adsSdk.AdAccount(adCreative.accountId);

  let fields = ['id'];
  let params = {
    name: 'Advertise - Facebook Post',
    object_story_spec: {
      page_id: adCreative.pageId,
      link_data: {
        call_to_action: {
          type: 'LEARN_MORE',
        },
        link: 'https://www.facebook.com/' + adCreative.pageId + '/posts/' + adCreative.postId,
        message: 'Advertise your business on Facebook',
      },
    },
  };

  const createdAdCreative = await account.createAdCreative(fields, params).catch((err) => {
    logger.error(`Error in creating ad creative for page ${adCreative.pageId} of the account: ${adCreative.accountId}`);
    throw err;
  });
  logger.info(`Creating ad creative for page ${adCreative.pageId} of the account: ${adCreative.accountId}`);

  return createdAdCreative;
};

const createAdSet = async (accessToken: string, adSet: IFBAdSet) => {
  FBAdSetValidate(adSet);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
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
    logger.error(`Error in creating ad set for audience ${adSet.audience.name} of the account: ${adSet.accountId}`);
    throw err;
  });
  logger.info(`Creating ad set for audience ${adSet.audience.name} of the account: ${adSet.accountId}`);

  return createdAdSet;
};

const createAd = async (accessToken: string, ad: IFBAd) => {
  FBAdValidate(ad);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
  const account = new adsSdk.AdAccount(ad.accountId);

  let fields = ['id'];
  let params = {
    name: 'Adverise -' + helpersUtils.getCurrentDate(),
    adset_id: ad.adSetId,
    creative: { creative_id: ad.creativeId },
    status: 'PAUSED',
  };

  const createdAd = await account.createAd(fields, params).catch((err) => {
    logger.error(`Error in creating ad for ad set ${ad.adSetId} of the account: ${ad.accountId}`);
    throw err;
  });
  logger.info(`Creating ad for ad set ${ad.adSetId} of the account: ${ad.accountId}`);

  return createdAd;
};

const createRule = async (accessToken: string, rule: IFBRule) => {
  FBRuleValidate(rule);
  logger.info(`Creating rule for campaign ${rule.campaignId} of the account: ${rule.accountId}`);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
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
  logger.info(`Creating rule for campaign ${rule.campaignId} of the account: ${rule.accountId}`);

  return createdRule;
};

enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

const toggleCampaignStatus = async (
  accessToken: string,
  campaignId: string,
  automationId: string,
  status: CampaignStatus
) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
  const campaign = new adsSdk.Campaign(campaignId);
  const updatedCampaign = await campaign.update([], { status: status }).catch(async (err) => {
    await Automation.findByIdAndUpdate(automationId, { status: 'FAILED' });
    logger.error(`Error in updating campaign ${campaignId} status to ${status}`);
    throw err;
  });
  const updatedAutomation = await Automation.findByIdAndUpdate(automationId, { status: 'ACTIVE' });
  console.log(updatedAutomation);
  logger.info(`Updating campaign ${campaignId} status to ${status}`);
  return updatedAutomation;
};

const fetchLongLivedAccessToken = async (accessToken: string) => {
  const result = axios.get('https://graph.facebook.com/oauth/access_token', {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: process.env.FB_APP_ID,
      client_secret: process.env.FB_APP_SECRET,
      fb_exchange_token: accessToken,
    },
  });

  const longLivedAccessToken = (await result).data.access_token;

  return longLivedAccessToken;
};

const fetchLongLivedAccessTokenForPage = async (pageId: string, accessToken: string) => {
  const result = axios.get(`https://graph.facebook.com/${pageId}`, {
    params: {
      fields: 'access_token',
      access_token: accessToken,
    },
  });

  const longLivedAccessToken = (await result).data.access_token;

  return longLivedAccessToken;
};

const subscribePageToWebhook = async (pageId: string, pageAccessToken: string) => {
  const result = await axios.post(`https://graph.facebook.com/${pageId}/subscribed_apps?subscribed_fields=feed
  &access_token=${pageAccessToken}`);

  const response = (await result).data;

  return response;
};

const duplicateCampaign = async (accessToken: string, campaign: IFBCampaign) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
  const Campaign = new adsSdk.Campaign(campaign.campaignId);
  const fields = ['id'];
  const params = {
    name: 'Adverise - ' + campaign.pageName + ' - Facebook Posts' + helpersUtils.getCurrentDate(),
    status: 'PAUSED',
  };

  const newCampaign = await Campaign.createCopy(fields, params).catch((err) => {
    logger.error(`Error in duplicating campaign ${campaign.campaignId}`);
    throw err;
  });
  logger.info(`Duplicating campaign ${campaign.campaignId}`);

  return newCampaign;
};

// const duplicateAdSet = async (accessToken: string, adSet: IFBAdSet) => {
//   adsSdk.FacebookAdsApi.init(accessToken).setDebug(true);
//   const AdSet = new adsSdk.AdSet(adSet.);
//   const fields = ['id'];
//   const params = {
//     name: adSet.audience.name,
//     status: 'PAUSED',
//     campaign_id: adSet.campaignId,
//   }
// }

export const facebookService = {
  createCampaign,
  getPages,
  createAdCreative,
  createAdSet,
  createAd,
  createRule,
  toggleCampaignStatus,
  getAdAccounts,
  fetchLongLivedAccessToken,
  fetchLongLivedAccessTokenForPage,
  subscribePageToWebhook,
  duplicateCampaign,
};
