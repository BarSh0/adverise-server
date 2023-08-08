import { Automation } from '../../../database/models/automation.model';
import { IFBCampaign } from '../../../types/facebookTypes';
import { FBCampaignValidate } from '../../../types/facebookTypes/FBCampaign';
import * as adsSdk from 'facebook-nodejs-business-sdk';
import { helpersUtils } from '../../../utils/helpers.utils';

const isDevMode = process.env.NODE_ENV === 'development';

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

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
export const toggleCampaignStatus = async (
  accessToken: string,
  campaignId: string,
  automationId: string,
  status: CampaignStatus
) => {
  adsSdk.FacebookAdsApi.init(accessToken).setDebug(isDevMode);
  const campaign = new adsSdk.Campaign(campaignId);
  status = status ? CampaignStatus.ACTIVE : CampaignStatus.PAUSED;
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
