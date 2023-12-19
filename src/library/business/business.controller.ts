import { Request, Response } from 'express';
import AppService from '../../services/app';
import logger from '../../utils/logger';
import { FBServices } from '../facebook/services';
import { IFBAdSet } from '../facebook/types';
import { Page } from '../page/page.model';
import { Business } from './business.model';

export const getAllBusinesses = async (req: Request, res: Response) => {
  const businesses = await Business.find({ user: req.body.user._id }).populate('page');
  res.status(200).send({ data: businesses, message: 'Business fetched successfully' });
};

export const getBusiness = async (req: Request, res: Response) => {
  const { id } = req.params;
  const business = await Business.findById({ _id: id, user: req.body.user._id }).populate('page');
  res.status(200).send({ data: business, message: 'Business fetched successfully' });
};

export const postBusiness = async (req: Request, res: Response) => {
  const { adAccount, campaign, audience, page, user } = req.body;
  const { accessToken } = req.body.user.platforms.facebook;
  page.user = user._id;
  page.platform = 'facebook';

  const existingPage = await Page.findOne({ pageId: page.pageId });

  if (existingPage) {
    existingPage.picture = page.picture;
    existingPage.save();
    const newBusiness = new Business({
      businessId: adAccount.id,
      name: adAccount.name,
      page: existingPage._id,
      user: user._id,
      campaign,
      audience,
    });

    const newAdSet = await FBServices.adSet.create(accessToken, {
      accountId: adAccount.id,
      campaignId: campaign.id,
      audience: audience,
      objective: 'POST_ENGAGEMENT',
    } as IFBAdSet);

    newBusiness.adSetId = newAdSet.id;

    await newBusiness.save();
    logger.info(`The user ${user.username} created a new business for the page ${page.name}`);
    return res.status(200).send({ data: newBusiness, message: 'Business created successfully' });
  }

  const newPage = await AppService.Page.create(page);
  await newPage.save();
  const newBusiness = new Business({
    businessId: adAccount.id,
    name: adAccount.name,
    page: newPage._id,
    user: user._id,
    campaign,
    audience,
  });

  const newAdSet = await FBServices.adSet.create(accessToken, {
    accountId: adAccount.id,
    campaignId: campaign.id,
    audience: audience,
    objective: 'POST_ENGAGEMENT',
  } as IFBAdSet);

  newBusiness.adSetId = newAdSet.id;

  await newBusiness.save();
  logger.info(`The user ${user.username} created a new business for the page ${page.name}`);
  res.status(200).send({ data: newBusiness, message: 'Business created successfully' });
};

export const deleteBusiness = async (req: Request, res: Response) => {
  const { id } = req.params;
  const business = await Business.findByIdAndDelete(id);
  if (!business) throw new Error('Business not found');
  logger.info(`The user ${req.body.user.username} deleted the business ${id}`);
  res.status(200).send({ data: business, message: 'Business deleted successfully' });
};
