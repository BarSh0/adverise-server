import { PromotedTweetParams } from '../types/PromotedTweet';
import { newTwitterAdsAPI } from './config';

export const addTweetToLineItem = async (
  adAccountId: string,
  req: PromotedTweetParams,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${adAccountId}/promoted_tweets`;
  const params = {
    line_item_id: req.line_item_id,
    tweet_ids: req.tweet_ids,
  };
  return new Promise((resolve, reject) => {
    T.post(url, params, (error: any, resp: any, body: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};
