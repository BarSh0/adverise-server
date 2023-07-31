import * as Campaign from './campaigns.service';
import * as LineItem from './lineItems.service';
import * as Tweet from './tweets.service';
import {
  createTargetingCriteria,
  getAllAccounts,
  getAllAdAccounts,
  getAllAudiences,
  getAllTweets,
  getFundingInstrumentsId,
  getTargetingValue,
  getTweetById,
  test,
} from './twitter.service';
export const TwitterService = {
  LineItem,
  Campaign,
  Tweet,
  createTargetingCriteria,
  getTargetingValue,
  getAllAdAccounts,
  getAllAccounts,
  getAllAudiences,
  getAllTweets,
  getTweetById,
  getFundingInstrumentsId,
  test,
};
