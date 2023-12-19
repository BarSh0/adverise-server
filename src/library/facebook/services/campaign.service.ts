import { Automation } from '../../automation/automation.model';
import { IFBCampaign } from '../types';
import { FBCampaignValidate } from '../types/FBCampaign';
import * as adsSdk from 'facebook-nodejs-business-sdk';
import { helpersUtils } from '../../../utils/helpers.utils';

const isDevMode = process.env.NODE_ENV === 'development';

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

export const getAll = async (accessToken: string, accountId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const AdAccount = adsSdk.AdAccount;
  const account = new AdAccount(accountId);
  const fields = ['id', 'name', 'objective', 'daily_budget'];
  const params = {};
  const campaigns = await account.getCampaigns(fields, params).catch((err) => {
    console.error(`Error in fetching campaigns of the account: ${accountId}`);
    throw err;
  });
  console.info(`Fetching campaigns of the account: ${accountId} is done!`);
  return campaigns;
};

export const getAllPageCampaigns = async (accessToken: string, accountId: string, pageId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const page = new adsSdk.Page(pageId);
  const account = new adsSdk.AdAccount(accountId);

  const fields = ['id', 'name', 'objective', 'daily_budget', 'status'];
  const params = {};
  const campaigns = await account.getCampaigns(fields, params).catch((err) => {
    console.error(`Error in fetching campaigns of the page: ${pageId}`);
    throw err;
  });
  console.info(`Fetching campaigns of the page: ${pageId} is done!`);

  const pageCampaigns = campaigns.map((campaign) => campaign._data);

  return pageCampaigns;
};

export const get = async (accessToken: string, campaignId: string) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const campaign = new adsSdk.Campaign(campaignId);
  const fields = ['id', 'name', 'objective', 'daily_budget'];
  const params = {};

  const fetchedCampaign = await campaign.get(fields, params).catch((err) => {
    console.error(`Error in fetching campaign ${campaignId}`);
    throw err;
  });

  const adsets = await campaign.getAdSets(['id', 'name'], params).catch((err) => {
    console.error(`Error in fetching adsets of campaign ${campaignId}`);
    throw err;
  });

  adsets.map((adset) => {
    return adset._data;
  });

  const result = {
    ...fetchedCampaign._data,
    adsets: adsets,
  };

  console.info(`Fetching campaign ${campaignId} is done!`);
  return result;
};

export const createCampaign = async (accessToken: string, campaign: IFBCampaign) => {
  FBCampaignValidate(campaign);
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
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
    console.error(`Error in creating campaign for page ${campaign.pageName} of the account: ${campaign.accountId}`);
    throw err;
  });
  console.info(`Creation of campaign for page ${campaign.pageName} of the account: ${campaign.accountId} is done!`);

  return createdCampaign;
};
export const toggleStatus = async (
  accessToken: string,
  campaignId: string,
  automationId: string,
  status: CampaignStatus
) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const campaign = new adsSdk.Campaign(campaignId);
  await campaign.update([], { status }).catch(async (err) => {
    await Automation.findByIdAndUpdate(automationId, { status: 'FAILED' });
    console.error(`Error in updating campaign ${campaignId} status to ${status}`);
    throw err;
  });
  const updatedAutomation = await Automation.findByIdAndUpdate(automationId, { status });
  console.info(`Updating campaign ${campaignId} status to ${status}`);
  return updatedAutomation;
};
export const duplicateCampaign = async (accessToken: string, campaign: IFBCampaign) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const Campaign = new adsSdk.Campaign(campaign.campaignId);
  const fields = ['id'];
  const params = {
    name: 'Adverise - ' + campaign.pageName + ' - Facebook Posts' + helpersUtils.getCurrentDate(),
    status: 'ACTIVE',
  };

  const newCampaign = await Campaign.createCopy(fields, params).catch((err) => {
    console.error(`Error in duplicating campaign ${campaign.campaignId}`);
    throw err;
  });
  console.info(`Duplicating campaign ${campaign.campaignId} is done!`);

  return newCampaign;
};
