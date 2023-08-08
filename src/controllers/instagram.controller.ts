import { NextFunction, Request, Response } from 'express';
import IGService from '../services/instagram';
import { Post, TPost } from '../database/models/post.model';
import { Page } from '../database/models/page.model';
import { Automation } from '../database/models/automation.model';
import { facebookService } from '../library/facebook/services';
import { IFBAdCreative, IFBCampaign } from '../types/facebookTypes';
import * as adsSdk from 'facebook-nodejs-business-sdk';
import { IUser } from '../database/models/user.model';

export const getAdAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.body.user.platforms.instagram;
  const IGadAccounts = await IGService.AdAccount.get(accessToken);
  res.send(IGadAccounts);
};
export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken } = req.body.user.platforms.instagram;
  const result = await IGService.Page.get(accessToken, id);

  res.send(result);
};
export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
};
export const createAutomation = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
};
export const toggleAutomationStatus = async (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
};

export const promotePost = async (req: Request, res: Response, next: NextFunction) => {
  const { instagram_secret, post_id, page_id } = req.body;
  if (!instagram_secret || !post_id || !page_id) {
    //mail to manager about missing required value in zapier
    throw new Error('missing required value in zapier');
  }

  const dbPost = await Post.findOne({ postId: post_id });
  if (dbPost && dbPost.handled) throw new Error('post already handled');

  const page = await Page.findOne({ pageId: page_id });
  if (!page) throw new Error('page not found');
  const automation = await Automation.findOne({ page: page._id }).populate('user');
  if (!automation) throw new Error('automation not found');

  const user = automation.user as IUser;
  const { accessToken } = user.platforms.instagram;
  const post: TPost = {
    postId: post_id,
    campaignId: automation.campaign.id,
    page: page._id,
    item: 'photo',
    handled: false,
  };

  const newPost = new Post(post);
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

  const adSetsPromises = adSets.map(async (adSet: any) => {
    const temp = new adsSdk.AdSet(adSet.id);
    return temp.update([], { creative: { creative_id: adCreative.id } });
  });

  await Promise.all(adSetsPromises);

  newPost.handled = true;
  await newPost.save();

  res.send({ data: newPost, message: 'Post promoted successfully' });
};
