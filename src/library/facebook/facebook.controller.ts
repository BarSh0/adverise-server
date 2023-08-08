import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Automation, AutomationStatusEnum } from '../../database/models/automation.model';
import { IPage, Page } from '../../database/models/page.model';
import { IFBAd, IFBAdCreative, IFBAdSet, IFBCampaign, IFBRule } from '../../types/facebookTypes';
import { helpersUtils } from '../../utils/helpers.utils';
import logger from '../../utils/logger';
import { facebookService } from '../../services/facebook';
import { IUser, User } from '../../database/models/user.model';
import { Post, TPost } from '../../database/models/post.model';
import * as adsSdk from 'facebook-nodejs-business-sdk';
import jwt from 'jsonwebtoken';

export const getAdAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');
  const result = await facebookService.Others.getAdAccounts(accessToken);
  res.send({ data: result, message: 'Ad accounts fetched successfully' });
};

export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');
  const result = await facebookService.Page.getPages(accessToken, id);
  res.send({ data: result, message: 'Accounts fetched successfully' });
};

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { campaign } = req.body;
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');
  const result = await facebookService.Campaign.createCampaign(accessToken, campaign);
  res.send({ data: result, message: 'Campaigns fetched successfully' });
};

export const createAutomation = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('Getting request to create a new automation with the parameters - ' + JSON.stringify(req.body));
  const page: IPage = req.body.page;
  const { budget, objective, amount, of } = req.body;
  const { user, adAccount, audience } = req.body;
  const { accessToken } = req.body.user.platforms.facebook;
  if (!accessToken) throw new Error('Access token is missing');

  const adPauseTime = helpersUtils.amountOfHoursCalc(amount, of);

  logger.info(
    `The user ${user.name} is trying to create new automation for page ${page.name} that belongs to account ${adAccount.id}`
  );

  const newPage = new Page({
    ...page,
    platform: 'facebook',
    user: new mongoose.Types.ObjectId(user._id),
  });

  await newPage.save();

  const campaign: IFBCampaign = {
    accountId: adAccount.id,
    dailyBudget: budget * 100,
    pageName: page.name,
    objective,
  };

  const newCampaign = await facebookService.Campaign.createCampaign(accessToken, campaign);

  const adCreative: IFBAdCreative = {
    accountId: adAccount.id,
    pageId: page.pageId,
  };

  const newAdCreative = await facebookService.Others.createAdCreative(accessToken, adCreative);

  const newAds = await Promise.all(
    audience.map(async (audience: any) => {
      const adSet: IFBAdSet = {
        accountId: adAccount.id,
        campaignId: newCampaign.id,
        audience: audience,
        objective,
      };

      const newAdSet = await facebookService.adSet.create(accessToken, adSet);

      const ad: IFBAd = {
        accountId: adAccount.id,
        adSetId: newAdSet.id,
        creativeId: newAdCreative.id,
        objective,
      };

      const newAd = await facebookService.Others.createAd(accessToken, ad);

      return newAd;
    })
  );

  const rule: IFBRule = {
    accountId: adAccount.id,
    campaignId: newCampaign.id,
    adPauseTime,
  };

  const newRule = await facebookService.Others.createRule(accessToken, rule);

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

  const pageAccessToken = await facebookService.Tokens.fetchLongLivedAccessTokenForPage(page.pageId, accessToken);
  await facebookService.Page.subscribePageToWebhook(page.pageId, pageAccessToken);
  const newAutomation = await Automation.create(automation);

  res.status(200).send(newAutomation);
};

export const toggleAutomationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const automationId = req.params.id;
    const { status } = req.body;
    const { accessToken } = req.body.user.platforms.facebook;
    if (!accessToken) throw new Error('Access token is missing');

    const automation = await Automation.findById(automationId);
    if (!automation) throw new Error('automation not found');
    const campaignId = automation.campaign.id;

    const result = await facebookService.Campaign.toggleCampaignStatus(accessToken, campaignId, automationId, status);
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

  if (value.verb !== 'add') {
    res.send();
    return;
  }

  console.log(`Get request to promote post ${value.post_id} from page ${value.from.name}`);

  const page = await Page.findOne({ pageId: value.from.id });
  if (!page) {
    res.send();
    return;
  }
  const automation = await Automation.findOne({ page: page._id }).populate('user');
  if (!automation) throw new Error('automation not found');
  if (automation.status !== AutomationStatusEnum.ACTIVE) throw new Error('automation is not active');
  const user = automation.user as IUser;
  const { accessToken } = user.platforms.facebook;
  if (!accessToken) throw new Error('access token not found');

  const dbPost = await Post.findOne({ postId: value.post_id });
  if (dbPost && dbPost.handled) throw new Error('post already handled');

  const post: TPost = {
    postId: value.post_id,
    campaignId: automation.campaign.id,
    page: automation.page._id,
    item: value.item,
    itemId: value.item_id,
    link: value.link,
    message: value.message,
  };

  const newPost = await Post.create(post);
  await newPost.save();

  automation.posts.push(newPost._id);
  await automation.save();

  //verify access token

  const isNeedDupliaction = await facebookService.Others.isNeedDupliaction(accessToken, automation.campaign.id);

  if (isNeedDupliaction) {
    console.log(`Duplicating campaign ${automation.campaign.id}`);

    const duplicateCampaignReq: IFBCampaign = {
      accountId: automation.adAccountId,
      pageName: page.name,
      objective: automation.objective,
      dailyBudget: automation.dailyBudget,
    };

    const newCampaign = await facebookService.Campaign.duplicateCampaign(accessToken, duplicateCampaignReq);
    automation.campaign.id = newCampaign.id;
    automation.campaign.name = newCampaign._data.name;
    await automation.save();

    const adSets = await facebookService.adSet.get(accessToken, automation.campaign.id);
    const adSetsPromises = adSets.map(async (adSet: any) => {
      await facebookService.adSet.duplicate(accessToken, adSet.id, adSet);
    });

    await Promise.all(adSetsPromises);

    const rulesPromises = automation.rules.map(async (rule: any) => {
      const newRule = await facebookService.Others.updateRule(
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

    res.send({ data: newCampaign, message: 'Post promoted successfully' });
    return;
  }

  const adSets = await facebookService.adSet.get(accessToken, automation.campaign.id);
  const adCreativeReq: IFBAdCreative = {
    accountId: automation.adAccountId,
    pageId: page.pageId,
    postId: newPost.postId,
  };

  const adCreative = await facebookService.Others.createAdCreative(accessToken, adCreativeReq);

  console.log(`Updating ad sets with creative ${adCreative.id}`);

  const adSetsPromises = adSets.map(async (adSet: any) => {
    const temp = new adsSdk.AdSet(adSet.id);
    return temp.update([], { creative: { creative_id: adCreative.id } });
  });

  await Promise.all(adSetsPromises);

  newPost.handled = true;
  await newPost.save();

  console.log(`Post ${newPost.postId} promoted successfully`);

  res.send({ data: newPost, message: 'Post promoted successfully' });
};

export const signInWithFacebook = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { accessToken: fbAccessToken } = req.body;
  const { displayName, photoURL } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    user.platforms.facebook.accessToken = fbAccessToken;
    user.platforms.facebook.isConnect = true;
    user.picture ? null : (user.picture = photoURL);
    await user.save();

    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    const accessToken = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: '30d' });
    res.send({ data: accessToken, message: `Welcome Back ${user.username}` });
    return;
  }

  const newUser = new User({
    username: displayName,
    email,
    password: 'facebook',
    picture: photoURL,
    platforms: {
      facebook: {
        isConnect: true,
        accessToken: fbAccessToken,
      },
    },
  });
  await newUser.save();
  const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
  const accessToken = jwt.sign({ id: newUser._id }, jwtSecretKey, { expiresIn: '30d' });

  res.send({ data: accessToken, message: `Welcome ${newUser.username}` });
};
