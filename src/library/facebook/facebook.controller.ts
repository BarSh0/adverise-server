import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import gmailConfig from '../../config/gmail.config';
import { Post, TPost } from '../../database/models/post.model';
import { IUser, User } from '../../database/models/user.model';
import AppService from '../../services/app';
import { gmailService } from '../../services/gmail.service';
import Utils from '../../utils';
import logger from '../../utils/logger';
import { Automation, AutomationStatusEnum } from '../automation/automation.model';
import { Business } from '../business/business.model';
import { IPage, Page } from '../page/page.model';
import { FBServices } from './services';
import { CampaignStatus } from './services/campaign.service';
import { IFBAd, IFBAdSet, IFBCampaign, IFBRule } from './types';
import { IAppAdCreative } from './types/AppAdCreative';

type AdData = {
  adName?: string;
  adHeadline?: string;
  adMedia?: string;
  adCopy?: string;
  adURL?: string;
  adUTM?: string;
};

export const getAdAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');
  const adAccounts = await FBServices.Others.getAdAccounts(accessToken);
  res.send({ data: adAccounts, message: 'Ad accounts fetched successfully' });
};

export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');
  const result = await FBServices.Page.getPages(accessToken, id);
  res.send({ data: result, message: 'Accounts fetched successfully' });
};

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');
  const result = await FBServices.Campaign.getAll(accessToken, id);
  res.send({ data: result, message: 'Campaigns fetched successfully' });
};

export const getPageCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { account, page } = req.params;
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');
  const result = await FBServices.Campaign.getAllPageCampaigns(accessToken, account, page);
  res.send({ data: result, message: 'Campaigns fetched successfully' });
};

export const createAutomation = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Getting request to create a new automation with the parameters - ' + JSON.stringify(req.body));
  const page: IPage = req.body.page;
  const { budget, objective, amount, of } = req.body;
  const { user, adAccount, audience } = req.body;
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');

  const adPauseTime = Utils.Helpers.amountOfHoursCalc(amount, of);
  const pageAccessToken = await FBServices.Tokens.fetchLongLivedAccessTokenForPage(page.pageId, accessToken);

  const newPage = new Page({
    ...page,
    platform: 'facebook',
    user: new mongoose.Types.ObjectId(user._id),
    accessToken: pageAccessToken,
  });

  const campaign: IFBCampaign = {
    accountId: adAccount.id,
    dailyBudget: budget * 100,
    pageName: page.name,
    objective,
  };

  const newCampaign = await FBServices.Campaign.createCampaign(accessToken, campaign);
  const lastPostId = await FBServices.Others.getLastPostId(pageAccessToken, page.pageId);

  const adCreative = {
    name: `Easy2Ad - ${Date.now()}`,
    object_story_id: lastPostId,
  };

  const newAdCreative = await FBServices.Others.createAdCreative(accessToken, adAccount.id, adCreative);

  await Promise.all(
    audience.map(async (audience: any) => {
      const adSet: IFBAdSet = {
        accountId: adAccount.id,
        campaignId: newCampaign.id,
        audience: audience,
        objective,
      };

      const newAdSet = await FBServices.adSet.create(accessToken, adSet);

      const ad: IFBAd = {
        accountId: adAccount.id,
        adSetId: newAdSet.id,
        creativeId: newAdCreative.id,
        objective,
      };

      const newAd = await FBServices.Others.createAd(accessToken, ad);

      return newAd;
    })
  );

  const rule: IFBRule = {
    accountId: adAccount.id,
    campaignId: newCampaign.id,
    adPauseTime,
  };

  const newRule = await FBServices.Others.createRule(accessToken, rule);

  const automation = {
    adAccountId: adAccount.id,
    platform: 'facebook',
    campaign: { id: newCampaign.id, name: newCampaign._data.name },
    page: new mongoose.Types.ObjectId(newPage._id),
    audiences: audience,
    dailyBudget: budget * 100,
    objective,
    user: new mongoose.Types.ObjectId(user._id),
    rules: [{ id: newRule.id, name: newRule._data.name, adPauseTime }],
    lastOperation: new Date(),
    postTypes: ['photo', 'video', 'link'],
  };

  await FBServices.Page.subscribePageToWebhook(page.pageId, pageAccessToken);
  const newAutomation = await Automation.create(automation);
  await newPage.save();

  res.status(200).send({ data: newAutomation, message: 'Automation created successfully' });
};

export const simpleCreation = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Getting request to create a new automation with the parameters - ' + JSON.stringify(req.body));
  const page: IPage = req.body.page;
  const { campaign } = req.body;
  const { user } = req.body;
  const { id } = req.params;
  const { accessToken } = user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');

  const newPage = new Page({
    ...page,
    platform: 'facebook',
    user: new mongoose.Types.ObjectId(user._id),
  });

  await newPage.save();

  const thisCampaign = await FBServices.Campaign.get(accessToken, campaign.id);

  const automation = {
    adAccountId: id,
    platform: 'facebook',
    campaign: { id: campaign.id, name: campaign.name },
    page: new mongoose.Types.ObjectId(newPage._id),
    audiences: thisCampaign.adsets,
    dailyBudget: thisCampaign.daily_budget,
    objective: thisCampaign.objective,
    user: new mongoose.Types.ObjectId(user._id),
    lastOperation: new Date(),
    postTypes: ['photo', 'video', 'link'],
  };

  const pageAccessToken = await FBServices.Tokens.fetchLongLivedAccessTokenForPage(page.pageId, accessToken);
  await FBServices.Page.subscribePageToWebhook(page.pageId, pageAccessToken);
  const newAutomation = await Automation.create(automation);

  res.status(200).send({ data: newAutomation, message: 'Automation created successfully' });
};

export const toggleAutomationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const automationId = req.params.id;
    let { status } = req.body;
    const { accessToken } = req.body.user.platforms.facebook;
    const automation = await Automation.findById(automationId);
    if (!automation) throw new Error('automation not found');
    const campaignId = automation.campaign.id;
    status = status ? AutomationStatusEnum.ACTIVE : AutomationStatusEnum.PAUSED;
    const result = await FBServices.Campaign.toggleStatus(accessToken, campaignId, automationId, status);
    res.send({ data: result, message: 'Automation status changed successfully' });
  } catch (error: any) {
    const automationId = req.params.id;
    const automation = await Automation.findById(automationId);
    if (!automation) throw new Error('automation not found');
    automation.status = AutomationStatusEnum.FAILED;
    await automation.save();
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

export const promotePost = async (req: Request, res: Response, next: NextFunction) => {
  const value = req.body.entry[0].changes[0].value;
  const page = await Page.findOne({ pageId: value.from.id });
  if (!page) return res.send();

  if (value.verb !== 'add') return res.send();
  if (value.item !== 'photo') return res.send();
  if (!value.published || value.published === 'false') return res.send();
  logger.info(`Get request to promote post ${value.post_id} from page ${value.from.name}` + JSON.stringify(req.body));

  const automation = await Automation.findOne({ page: page._id }).populate('user');
  if (!automation) throw new Error(`Automation of page ${value.from.id} not found`);
  if (automation.status !== AutomationStatusEnum.ACTIVE)
    throw new Error(`Automation of page ${value.from.id} is not active`);
  const user = automation.user as IUser;
  const { accessToken } = user.platforms.facebook;

  const dbPost = await Post.findOne({ postId: value.post_id });
  if (dbPost && dbPost.handled) throw new Error(`Post ${value.post_id} already handled`);

  let newPost;

  if (!dbPost) {
    const post: TPost = {
      postId: value.post_id,
      campaignId: automation.campaign.id,
      page: automation.page._id,
      item: value.item,
      itemId: value.item_id,
      link: value.link,
      message: value.message,
    };

    newPost = await Post.create(post);
    await newPost.save();

    automation.posts.push(newPost._id);
    await automation.save();
  } else {
    newPost = dbPost;
  }

  const isValid = await FBServices.Tokens.validateAccessToken(accessToken);
  if (!isValid) {
    gmailService.sendMailWithLink(
      gmailConfig.receiver,
      'Easy2Ad - Facebook Automation Error',
      `Access token of user ${user.email} is not valid`,
      'click here to reactivate the access token',
      `https://adverise.netlify.app/connections`
    );
    throw new Error('Access token is not valid');
  }

  const isNeedDupliaction = await FBServices.Others.isNeedDupliaction(accessToken, automation.campaign.id);

  if (isNeedDupliaction) {
    console.log(`Duplicating campaign ${automation.campaign.id}`);

    const duplicateCampaignReq: IFBCampaign = {
      campaignId: automation.campaign.id,
      accountId: automation.adAccountId,
      pageName: page.name,
      objective: automation.objective,
      dailyBudget: automation.dailyBudget,
    };

    const newCampaign = await FBServices.Campaign.duplicateCampaign(accessToken, duplicateCampaignReq);
    automation.campaign.id = newCampaign.id;
    automation.campaign.name = newCampaign._data.name;
    await automation.save();

    const adSets = await FBServices.adSet.get(accessToken, automation.campaign.id);
    const adSetsPromises = adSets.map(async (adSet: any) => {
      await FBServices.adSet.duplicate(accessToken, adSet.id, adSet);
    });

    await Promise.all(adSetsPromises);

    const rulesPromises = automation.rules.map(async (rule: any) => {
      const newRule = await FBServices.Others.updateRule(
        accessToken,
        automation.adAccountId,
        automation.campaign.id,
        rule
      );
      rule.id = newRule.id;
      rule.name = newRule._data.name;
      await automation.save();
    });

    await Promise.all(rulesPromises);
  }

  const adSets = await FBServices.adSet.get(accessToken, automation.campaign.id);
  const adCreativeReq = {
    name: `Easy2Ad - ${Date.now()}`,
    object_story_id: newPost.postId,
  };

  const adCreative = await FBServices.Others.createAdCreative(accessToken, automation.adAccountId, adCreativeReq);

  logger.info(`Updating ad sets with creative ${adCreative.id}`);

  const newAdsPromises = adSets.map(async (adSet: any) => {
    const newAd = await FBServices.Others.createAd(accessToken, {
      accountId: automation.adAccountId,
      adSetId: adSet.id,
      creativeId: adCreative.id,
      objective: automation.objective,
    });
    return newAd;
  });

  await Promise.all(newAdsPromises);

  newPost.handled = true;
  await newPost.save();
  automation.lastOperation = new Date();
  await automation.save();

  logger.info(`Post ${value.post_id} promoted successfully`);

  res.send({ data: newPost, message: 'Post promoted successfully' });
};

export const signInWithFacebook = async (req: Request, res: Response, next: NextFunction) => {
  const { email, accessToken: fbAccessToken, displayName: username, photoURL } = req.body;
  const password = Utils.Helpers.generateRandomPassword();
  const user = (await User.findOne({ email })) || new User({ username, email, password });
  user.platforms.facebook.isConnect = true;
  user.platforms.facebook.accessToken = fbAccessToken;
  user.picture = photoURL;
  user.markModified('platforms.facebook');
  await user.save();
  const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
  const accessToken = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: '30d' });
  logger.info(`User ${user.username}[${user._id}] signed in successfully`);
  res.send({ data: accessToken, message: `Welcome Back ${user.username}` });
};

export const deleteAutomation = async (req: Request, res: Response, next: NextFunction) => {
  const { id: automationId } = req.params;
  const { accessToken } = req.body.user.platforms.facebook;
  const { campaign, page } = await AppService.Automation.get({ _id: automationId });
  await FBServices.Campaign.toggleStatus(accessToken, campaign.id, automationId, CampaignStatus.PAUSED);
  await AppService.Page.remove(page._id);
  await AppService.Automation.remove(automationId);
  res.send({ message: 'Automation deleted successfully' });
};

export const postAd = async (req: Request, res: Response, next: NextFunction) => {
  const adData: AdData = req.body.adData;
  if (!adData.adMedia) throw new Error('Ad media is required');
  const { id } = req.params;
  const { accessToken } = req.body.user.platforms.facebook;
  const business = await Business.findById(id);
  if (!business) throw new Error('Business not found');
  const page = await AppService.Page.get(business.page);
  if (!page) throw new Error('Page not found');
  const imageBase64: string = await Utils.Helpers.imageUrlToBase64(adData.adMedia);
  const image = await FBServices.Others.uploadImage(accessToken, business.businessId, imageBase64);

  const creative = await FBServices.Others.createAdCreativeWithImage(accessToken, {
    accountId: business.businessId,
    imageHash: image,
    adName: adData.adName,
    adHeadline: adData.adHeadline,
    pageId: page.pageId,
    link: adData.adURL,
    message: adData.adCopy,
  } as IAppAdCreative);

  const ad = await FBServices.Others.createAd(accessToken, {
    accountId: business.businessId,
    adSetId: business.adSetId,
    creativeId: creative.id,
    objective: 'POST_ENGAGEMENT',
  } as IFBAd);
  res.status(200).send({ data: ad, message: 'New Ad Created Successfully' });
};
