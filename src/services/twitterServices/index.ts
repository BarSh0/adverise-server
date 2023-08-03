import * as Campaign from './campaigns.service';
import * as LineItem from './lineItems.service';
import * as Tweet from './tweets.service';
import * as User from './user.service';
import * as Audience from './audience.service';
import {
  createTargetingCriteria,
  getAllAccounts,
  getAllAdAccounts,
  getAllAudiences,
  getAllTweets,
  getFundingInstrumentsId,
  getTargetingValue,
  getTweetById,
  getAllTargetingCriteria,
  test,
} from './twitter.service';

export const TwitterService = {
  LineItem,
  Campaign,
  Tweet,
  User,
  Audience,
  createTargetingCriteria,
  getAllTargetingCriteria,
  getTargetingValue,
  getAllAdAccounts,
  getAllAccounts,
  getAllAudiences,
  getAllTweets,
  getTweetById,
  getFundingInstrumentsId,
  test,
};
