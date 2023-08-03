import { NextFunction, Request, Response } from 'express';
import { AppError } from '../classes/AppError';
import { Automation, AutomationStatusEnum } from '../database/models/automation.model';
import { Page } from '../database/models/page.model';
import { Post } from '../database/models/post.model';
import { TwitterService } from '../services/twitterServices';
import { newCampaignParams } from '../services/twitterServices/campaigns.service';
import { EntityStatus, LineItemParams, Objective, Placements, ProductType } from '../types/twitterTypes/LineItem';
import { PromotedTweetParams } from '../types/twitterTypes/PromotedTweet';
import { OperatorType, TargetingCriteriaParams, TargetingType } from '../types/twitterTypes/TargetingCriteria';
import { User } from '../database/models/user.model';
import jwt from 'jsonwebtoken';

export const getAdAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const result = await TwitterService.getAllAdAccounts(accessToken, secretToken);
  // try {
  //   const accounts = await Promise.all(
  //     body.data.map(async (account: any) => {
  //       const adGroups = await getAllLineItems(account.id);
  //       return new AppAdAccount(account.id, account.name, { data: adGroups });
  //     })
  //   );
  //   console.log(accounts);
  //   resolve(accounts);
  // } catch (err) {
  //   console.error('Error:', err);
  //   reject(err);
  // }
  res.send(result);
};

export const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const { id } = req.params;
  const accounts = await TwitterService.getAllAccounts(id, accessToken, secretToken);
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
  res.send(result);
};

export const getFundingInstruments = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const fundingInstrumentId = await TwitterService.getFundingInstrumentsId(id, accessToken, secretToken);
  if (!fundingInstrumentId) throw new AppError(400, 'You need to add a funding instrument to your account');
  res.send(fundingInstrumentId);
};

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const { id } = req.params;
  const result = await TwitterService.Campaign.getAllCampaigns(id, accessToken, secretToken);
  res.send(result);
};

export const getAudiences = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const { id } = req.params;
  const result = await TwitterService.Audience.getAllAudiences(id, accessToken, secretToken);
  res.send(result);
};

export const getAudienceById = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const { id, audienceId } = req.params;
  const result = await TwitterService.Audience.getAudienceById(id, audienceId, accessToken, secretToken);
  res.send(result);
};

export const getAllTargetingCriteria = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const { id } = req.params;
  const lineItems = await TwitterService.LineItem.getAllLineItems(id, accessToken, secretToken);
  const lineItemsIds = lineItems.map((lineitem: any) => lineitem.id);
  const result = await TwitterService.getAllTargetingCriteria(id, lineItemsIds, accessToken, secretToken);
  res.send(result);
};

export const promoteTweet = async (req: Request, res: Response, next: NextFunction) => {
  const { tweet_id, user_id } = req.body;
  console.log(req.body);
  const page = await Page.findOne({ pageId: user_id });
  if (!page) {
    // send mail to the buisness that the app tried to promote a tweet but the page is not connected
    throw new AppError(404, 'Page not found');
  }
  const automation = await Automation.findOne({ page: page._id }).populate('user');
  if (!automation) throw new AppError(404, 'Automation not found');
  if (automation.status !== AutomationStatusEnum.ACTIVE) {
    // send mail that the app tried to promote a tweet but the automation is not active
    throw new AppError(400, 'Automation is not active');
  }
  const user = automation.user as any;
  const { accessToken, secretToken } = user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');

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
    throw new AppError(400, 'Tweet was not accepted');
  }

  newPost.handled = true;
  await newPost.save();

  automation.lastOperation = new Date();
  automation.posts.push(newPost._id);
  await automation.save();

  res.send(result);
};

export const createNewCampaign = async (req: Request, res: Response, next: NextFunction) => {
  const { campaignName, dailyBudget, targetingValue, fundingInstrument, page } = req.body;
  const adAccountId = req.params.id;
  const promotedUserId = req.body.page.user_id;
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');

  const newCampaingReq: newCampaignParams = {
    funding_instrument_id: fundingInstrument,
    name: campaignName,
    daily_budget_amount_local_micro: dailyBudget * 100,
  };

  const newCampaign = await TwitterService.Campaign.createCampaign(
    adAccountId,
    newCampaingReq,
    accessToken,
    secretToken
  );

  const newLineItemReq: LineItemParams = {
    campaign_id: newCampaign.id,
    name: campaignName,
    bid_amount_local_micro: dailyBudget * 100,
    product_type: ProductType.PROMOTED_TWEETS,
    objective: Objective.ENGAGEMENTS,
    placements: [Placements.ALL_ON_TWITTER],
    entity_status: EntityStatus.PAUSED,
    start_time: new Date().toISOString().slice(0, 19) + 'Z',
  };

  const newLineItem = await TwitterService.LineItem.createLineItem(
    adAccountId,
    newLineItemReq,
    accessToken,
    secretToken
  );

  const targetingCriteriaReq: TargetingCriteriaParams = {
    line_item_id: newLineItem.id,
    operator_type: OperatorType.EQ,
    targeting_type: TargetingType.LOCATION,
    targeting_value: targetingValue,
  };

  const targetingCriteria = await TwitterService.createTargetingCriteria(
    adAccountId,
    targetingCriteriaReq,
    accessToken,
    secretToken
  );

  const updateLineItemReq = {
    entity_status: EntityStatus.ACTIVE,
  };

  const updateLineItem = await TwitterService.LineItem.updateLineItem(
    adAccountId,
    newLineItem.id,
    updateLineItemReq,
    accessToken,
    secretToken
  );

  const newPage = {
    pageId: page.user_id,
    name: page.name,
    picture: page.picture,
    platform: 'twitter',
  };

  const automation = {
    objective: updateLineItem.objective,
    dailyBudget: updateLineItem.bid_amount_local_micro,
    campaign: {
      id: updateLineItem.id,
      name: updateLineItem.name,
    },
    adAccountId: adAccountId,
    audiences: [{ id: targetingCriteria.targeting_value, name: targetingCriteria.name }],
    platform: 'twitter',
  };

  req.body.page = newPage;
  req.body.automation = automation;
  next();
};

export const toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const { accessToken, secretToken } = req.body.user.platforms.twitter;
  if (!accessToken || !secretToken) throw new AppError(400, 'You need to connect your twitter account');
  const campaignStatus = status ? EntityStatus.ACTIVE : EntityStatus.PAUSED;
  const automation = await Automation.findById(id);
  if (!automation) throw new AppError(404, 'Automation not found');
  const lineItem = await TwitterService.LineItem.getLineItemById(
    automation.adAccountId,
    automation.campaign.id,
    accessToken,
    secretToken
  );
  if (!lineItem) {
    automation.status = AutomationStatusEnum.FAILED;
    await automation.save();
    throw new AppError(404, 'LineItem not found');
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
    throw new AppError(404, 'Campaign not found');
  }

  next();
};

export const test = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.body;
  const userId = '756201191646691328';
  const result = await TwitterService.test(userId);
  res.send(result);
};

export const signInWithTwitter = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { oauthAccessToken, oauthTokenSecret } = req.body;
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        'platforms.twitter.accessToken': oauthAccessToken,
        'platforms.twitter.secretToken': oauthTokenSecret,
      },
    },
    { new: true }
  );
  if (user) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
    const accessToken = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: '30d' });
    res.send({ data: accessToken, message: `Welcome Back ${user.username}` });
    return;
  }

  const { displayName, photoUrl } = req.body;
  const newUser = new User({
    username: displayName,
    email,
    password: 'twitter',
    picture: photoUrl,
    platforms: {
      twitter: {
        accessToken: oauthAccessToken,
        secretToken: oauthTokenSecret,
      },
    },
  });
  await newUser.save();
  const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
  const accessToken = jwt.sign({ id: newUser._id }, jwtSecretKey, { expiresIn: '30d' });

  res.send({ data: accessToken, message: `Welcome ${newUser.username}` });
};
