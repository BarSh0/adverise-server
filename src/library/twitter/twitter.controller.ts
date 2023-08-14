import { NextFunction, Request, Response } from 'express';
import { Automation, AutomationStatusEnum, IAutomation } from '../../database/models/automation.model';
import { IPage, Page } from '../../database/models/page.model';
import { Post } from '../../database/models/post.model';
import { TwitterService } from './services';
import { newCampaignParams } from './services/campaigns.service';
import { EntityStatus, LineItemParams, Objective, Placements, ProductType } from './types/LineItem';
import { PromotedTweetParams } from './types/PromotedTweet';
import { OperatorType, TargetingCriteriaParams, TargetingType } from './types/TargetingCriteria';
import { User } from '../../database/models/user.model';
import jwt from 'jsonwebtoken';
import AppService from '../../services/app';
import logger from '../../utils/logger';

export const getAdAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const result = await TwitterService.Others.getAllAdAccounts(accessToken, secretToken);
  res.send({ data: result, message: `Success Get Ad Account For ${req.body.user.username}` });
};

export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const { id } = req.params;
  const accounts = await TwitterService.Others.getAllAccounts(id, accessToken, secretToken);
  const promiseArray = accounts.map(async (account: any) => {
    const accountMoreDetails = await TwitterService.User.getUserDetails(account.user_id, accessToken, secretToken);
    const accountWithDetails = {
      ...account,
      name: accountMoreDetails.name,
      picture: accountMoreDetails.profile_image_url,
    };
    return accountWithDetails;
  });
  const result = await Promise.all(promiseArray);
  res.send({ data: result, message: `Success Get Accounts For ${req.body.user.username}` });
};

export const getFundingInstruments = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const fundingInstrumentId = await TwitterService.Others.getFundingInstrumentsId(id, accessToken, secretToken);
  if (!fundingInstrumentId) throw new Error('You need to add a funding instrument to your account');
  res.send({ data: fundingInstrumentId, message: `Success Get Funding Instruments For ${req.body.user.username}` });
};

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const { id } = req.params;
  const result = await TwitterService.Campaign.getAllCampaigns(id, accessToken, secretToken);
  res.send({ data: result, message: `Success Get Campaigns For ${req.body.user.username}` });
};

export const getAudiences = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const { id } = req.params;
  const result = await TwitterService.Audience.getAllAudiences(id, accessToken, secretToken);
  res.send({ data: result, message: `Success Get Audiences For ${req.body.user.username}` });
};

export const getAudienceById = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const { id, audienceId } = req.params;
  const result = await TwitterService.Audience.getAudienceById(id, audienceId, accessToken, secretToken);
  res.send({ data: result, message: `Success Get Audience For ${req.body.user.username}` });
};

export const getAllTargetingCriteria = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken)
    throw new Error('Seems like you are not connected to twitter,\n please connect on connections page.');
  const { id } = req.params;
  const lineItems = await TwitterService.LineItem.getAllLineItems(id, accessToken, secretToken);
  const lineItemsIds = lineItems.map((lineitem: any) => lineitem.id);
  const result = await TwitterService.Others.getAllTargetingCriteria(id, lineItemsIds, accessToken, secretToken);
  const unicResult = result.reduce((acc: any, current: any) => {
    const x = acc.find((item: any) => item.targeting_value === current.targeting_value);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  res.send({ data: unicResult, message: `Success Get Targeting Criteria For ${req.body.user.username}` });
};

export const promoteTweet = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id, user_id } = req.body;
  console.log(req.body);
  const page = await Page.findOne({ pageId: user_id });
  if (!page) {
    // send mail to the buisness that the app tried to promote a tweet but the page is not connected
    throw new Error('Page not found');
  }
  const automation = await Automation.findOne({ page: page._id }).populate('user');
  if (!automation) throw new Error('Automation not found');
  if (automation.status !== AutomationStatusEnum.ACTIVE) {
    // send mail that the app tried to promote a tweet but the automation is not active
    throw new Error('Automation is not active');
  }
  const user = automation.user as any;
  const { accessToken, secretToken } = user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');

  const adAccountId = automation.adAccountId;
  const promoteTweetReq: PromotedTweetParams = {
    tweet_ids: [tweet_id],
    line_item_id: automation.campaign.id,
  };

  const newPost = new Post({
    page: page._id,
    postId: tweet_id,
    campaignId: automation.campaign.id,
    platform: 'twitter',
    automation: automation._id,
    handled: false,
    deleted: false,
    item: 'note',
  });
  await newPost.save();

  const result = await TwitterService.Tweet.addTweetToLineItem(adAccountId, promoteTweetReq, accessToken, secretToken);

  const isAccepted = result[0].approval_status === 'ACCEPTED';
  if (!isAccepted) {
    // send mail that the app tried to promote a tweet but the tweet was not accepted
    console.log(result[0]);
    throw new Error('Tweet was not accepted');
  }

  newPost.handled = true;
  await newPost.save();

  automation.lastOperation = new Date();
  automation.posts.push(newPost._id);
  await automation.save();

  res.send(result);
};

export const createNewCampaign = async (req: Request, res: Response, next: NextFunction) => {
  const { campaignName, dailyBudget, targetingValue, fundingInstrument, page, user } = req.body;
  const adAccountId = req.params.id;
  const { accessToken, secretToken } = user.platforms.twitter;

  const newCampaingReq: newCampaignParams = {
    funding_instrument_id: fundingInstrument,
    name: campaignName,
    daily_budget_amount_local_micro: dailyBudget * 1000000,
  };

  const createCampaign = TwitterService.Campaign.createCampaign;
  const newCampaign = await createCampaign(adAccountId, newCampaingReq, accessToken, secretToken);

  const newLineItemReq: LineItemParams = {
    campaign_id: newCampaign.id,
    name: campaignName,
    bid_amount_local_micro: dailyBudget * 1000000,
    product_type: ProductType.PROMOTED_TWEETS,
    objective: Objective.ENGAGEMENTS,
    placements: [Placements.ALL_ON_TWITTER],
    entity_status: EntityStatus.PAUSED,
    start_time: new Date().toISOString().slice(0, 19) + 'Z',
  };

  const createLineItem = TwitterService.LineItem.createLineItem;
  const newLineItem = await createLineItem(adAccountId, newLineItemReq, accessToken, secretToken);

  const targetsPromises = targetingValue.map((target: any) => {
    const targetingCriteriaReq: TargetingCriteriaParams = {
      line_item_id: newLineItem.id,
      operator_type: target.operator_type as OperatorType,
      targeting_type: target.targeting_type as TargetingType,
      targeting_value: target.targeting_value as string,
    };

    return TwitterService.Others.createTargetingCriteria(adAccountId, targetingCriteriaReq, accessToken, secretToken);
  });

  const targets = await Promise.all(targetsPromises);

  const updateLineItemReq = {
    entity_status: EntityStatus.ACTIVE,
  };

  const updateLineItem = TwitterService.LineItem.updateLineItem;
  const updatedLineItem = await updateLineItem(
    adAccountId,
    newLineItem.id,
    updateLineItemReq,
    accessToken,
    secretToken
  );

  const newPage = await AppService.Page.create({
    pageId: page.user_id,
    name: page.name,
    picture: page.picture,
    platform: 'twitter',
    user: user._id,
  } as IPage);

  const audiences = targets.map((target: any) => {
    return { id: target.targeting_value, name: target.name };
  });

  const newAutomation = await AppService.Automation.create({
    objective: updatedLineItem.objective,
    dailyBudget: updatedLineItem.bid_amount_local_micro,
    campaign: {
      id: updatedLineItem.id,
      name: updatedLineItem.name,
    },
    adAccountId: adAccountId,
    audiences: audiences,
    platform: 'twitter',
    page: newPage._id,
    user: user._id,
  } as IAutomation);

  logger.info(`The user ${user.username} created a new automation for the page ${page.name}`);
  res.status(200).send({ data: newAutomation, message: 'Automation created successfully' });
};

export const simpleCreation = async (req: Request, res: Response, next: NextFunction) => {
  const { campaign, page, user } = req.body;
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const adAccountId = req.params.id;

  const params = {
    campaign_ids: [campaign.id],
  };

  const lineItem = await TwitterService.LineItem.get(adAccountId, params, accessToken, secretToken);
  console.log(lineItem);

  const newPage = new Page({
    pageId: page.user_id,
    name: page.name,
    picture: page.picture,
    user: user._id,
    platform: 'twitter',
  });

  const automation = new Automation({
    objective: 'SIMPLE',
    user: user._id,
    dailyBudget: campaign.daily_budget_amount_local_micro,
    campaign: {
      id: lineItem[0].id,
      name: campaign.name,
    },
    adAccountId: adAccountId,
    page: newPage._id,
    platform: 'twitter',
  });

  await automation.save();
  await newPage.save();

  res.send({ data: automation, message: `Success Create Automation For ${req.body.user.username}` });
};

export const toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new Error('You need to connect your twitter account');
  const campaignStatus = status ? EntityStatus.ACTIVE : EntityStatus.PAUSED;
  const automation = await Automation.findById(id);
  if (!automation) throw new Error('Automation not found');

  const lineItem = await TwitterService.LineItem.getLineItemById(
    automation.adAccountId,
    automation.campaign.id,
    accessToken,
    secretToken
  );
  if (!lineItem) {
    automation.status = AutomationStatusEnum.FAILED;
    await automation.save();
    throw new Error('LineItem not found');
  }

  const updateCampaignReq = {
    entity_status: campaignStatus,
  };

  const updateCampaign = await TwitterService.Campaign.updateCampaign(
    automation.adAccountId,
    lineItem.campaign_id,
    updateCampaignReq,
    accessToken,
    secretToken
  );

  if (!updateCampaign) {
    automation.status = AutomationStatusEnum.FAILED;
    await automation.save();
    throw new Error('Campaign not found');
  }

  next();
};

export const signInWithTwitter = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { accessToken: oauthAccessToken, secret: oauthTokenSecret } = req.body;
  const { displayName, photoURL } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    user.platforms.twitter.accessToken = oauthAccessToken;
    user.platforms.twitter.secretToken = oauthTokenSecret;
    user.platforms.twitter.isConnect = true;
    user.picture ? null : (user.picture = photoURL);
    await user.save();

    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    const accessToken = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: '30d' });
    res.send({ data: accessToken, message: `Welcome Back ${user.username}` });
    return;
  }

  console.log(user);

  const newUser = new User({
    username: displayName,
    email,
    password: 'twitter',
    picture: photoURL,
    platforms: {
      twitter: {
        isConnect: true,
        accessToken: oauthAccessToken,
        secretToken: oauthTokenSecret,
      },
    },
  });
  await newUser.save();
  const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
  const accessToken = jwt.sign({ id: newUser._id }, jwtSecretKey, { expiresIn: '30d' });

  console.log(newUser);
  res.send({ data: accessToken, message: `Welcome ${newUser.username}` });
};
