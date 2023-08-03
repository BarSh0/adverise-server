import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { facebookService } from '../services/facebook.service';
import logger from '../utils/logger';
import { Automation, IAutomation } from '../database/models/automation.model';
import { IFBAd, IFBAdCreative, IFBAdSet, IFBCampaign, IFBRule } from '../types/facebookTypes';
import { IPage } from '../database/models/page.model';
import { pageService } from '../services/page.service';

type IProperties = {
  dailyBudget: number;
  objective: string;
  adPauseTime: number;
};

export const getAdAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.body.user;
  const result = await facebookService.getAdAccounts(accessToken);

  res.send(result);
};

export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken } = req.body.user;
  const result = await facebookService.getPages(accessToken, id);

  res.send(result);
};

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, campaign } = req.body;
  const result = await facebookService.createCampaign(accessToken, campaign);
  res.send(result);
};

export const createAutomation = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Getting request to create a new automation with the parameters - ' + JSON.stringify(req.body));
  const page: IPage = req.body.page;
  const properties: IProperties = req.body.properties;
  const audiences = req.body.audiences;
  const { user, accountId } = req.body;
  const accessToken = user.accessToken;

  logger.info(
    `The user ${user.name} is trying to create new automation for page ${page.name} that belongs to account ${accountId}`
  );

  const newPage = await pageService.createPage(page, user._id);

  const campaign: IFBCampaign = {
    accountId: accountId,
    dailyBudget: properties.dailyBudget,
    pageName: page.name,
    objective: properties.objective,
  };

  const newCampaign = await facebookService.createCampaign(accessToken, campaign);

  const adCreative: IFBAdCreative = {
    accountId: accountId,
    pageId: page.pageId,
  };

  const newAdCreative = await facebookService.createAdCreative(accessToken, adCreative);

  const newAds = await Promise.all(
    audiences.map(async (audience: any) => {
      const adSet: IFBAdSet = {
        accountId: accountId,
        campaignId: newCampaign.id,
        audience: audience,
        objective: properties.objective,
      };

      const newAdSet = await facebookService.createAdSet(accessToken, adSet);

      const ad: IFBAd = {
        accountId: accountId,
        adSetId: newAdSet.id,
        creativeId: newAdCreative.id,
        objective: properties.objective,
      };

      const newAd = await facebookService.createAd(accessToken, ad);

      return newAd;
    })
  );

  const rule: IFBRule = {
    accountId: accountId,
    campaignId: newCampaign.id,
    adPauseTime: properties.adPauseTime,
  };

  const newRule = await facebookService.createRule(accessToken, rule);

  const automation = {
    adAccountId: accountId,
    platform: 'facebook',
    campaign: { id: newCampaign.id, name: newCampaign._data.name },
    page: new mongoose.Types.ObjectId(newPage._id),
    audiences: audiences,
    dailyBudget: properties.dailyBudget,
    objective: properties.objective,
    user: new mongoose.Types.ObjectId(user._id),
    rules: [{ id: newRule.id, name: newRule._data.name, adPauseTime: properties.adPauseTime }],
    lastOperation: new Date(),
    postTypes: ['photo', 'video', 'link'],
  };

  const pageAccessToken = await facebookService.fetchLongLivedAccessTokenForPage(page.pageId, accessToken);

  const result = await facebookService.subscribePageToWebhook(page.pageId, pageAccessToken);
  console.log(result);

  const newAutomation = await Automation.create(automation);

  res.status(200).send(newAutomation);

  // Create ad sets for page (longTermAccessToken, audiences, accountId, campaignId, pageId, dailyBudget, objective, pixelId)
  // Create rule for shut after budget exceeds (longTermAccessToken, accountId, campaignId, shutBudgetExceeds)
  // Create rule for boost query (longTermAccessToken, accountId, campaignId, boostQuery)
};

export const toggleAutomationStatus = async (req: Request, res: Response, next: NextFunction) => {
  const automationId = req.params.id;
  const { accessToken } = req.body.user;
  const { campaignId, status } = req.body;

  const result = await facebookService.toggleCampaignStatus(accessToken, campaignId, automationId, status);
  res.send({ data: result, message: 'Automation status changed successfully' });
};
