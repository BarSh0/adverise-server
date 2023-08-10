import { LocationType, TargetingCriteriaParams } from '../../types/twitterTypes/TargetingCriteria';
import { newTwitterAdsAPI } from './config';

// need to be by userId
export const getAllAdAccounts = async (accessToken: string, accessTokenSecret: string): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  return new Promise((resolve, reject) => {
    T.get('accounts', {}, (error: any, resp: any, body: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

export const getAllAccounts = async (
  adAccountId: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  return new Promise((resolve, reject) => {
    T.get(`accounts/${adAccountId}/promotable_users`, {}, (error: any, resp: any, body: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

export const getTargetingValue = async (
  locationType: LocationType,
  q: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `targeting_criteria/locations`;
  const params = {
    location_type: locationType,
    q: q,
  };
  return new Promise((resolve, reject) => {
    T.get(url, params, (error: any, resp: any, body: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

export const createTargetingCriteria = async (
  accountId: string,
  params: TargetingCriteriaParams,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${accountId}/targeting_criteria`;
  return new Promise((resolve, reject) => {
    T.post(url, params, function (error: any, resp: any, body: any) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

export const getAllTargetingCriteria = async (
  accountId: string,
  lineItemsIds: string[],
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${accountId}/targeting_criteria`;
  const params = {
    line_item_ids: lineItemsIds,
    count: 1000,
  };
  return new Promise((resolve, reject) => {
    T.get(url, params, function (error: any, resp: any, body: any) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

export const test = async (accountId: string): Promise<any> => {};

export const getFundingInstrumentsId = async (
  accountId: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
    const url = `accounts/${accountId}/funding_instruments`;
    T.get(url, {}, (error: any, resp: any, body: any) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

// export const createTargetingCriteria = async (accountId: string, lineItemId: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const params = {
//       line_item_id: lineItemId,
//       targeting_type: 'LOCATION',
//       targeting_value: '5122804691e5fecc', // need to get this from the location endpoint
//       operator_type: operatorType.EQ,
//     };

//     const url = `accounts/${accountId}/targeting_criteria`;

//     T.post(url, params, function (error: any, resp: any, body: any) {
//       if (error) {
//         console.error(error);
//         reject(error);
//       } else {
//         resolve(body);
//       }
//     });
//   });
// };

export const createPromotedTweet = async (
  accountId: string,
  text: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${accountId}/promoted_tweets?text=${text}`;
  return new Promise((resolve, reject) => {
    T.post(url, {}, function (error: any, resp: any, body: any) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

export const getAllAudiences = async () => {
  // try {
  //   const response = await client.v2.accounts('YOUR_ACCOUNT_ID').audiences();
  //   console.log('Audiences:', response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error retrieving audiences:', error);
  //   throw error;
  // }
};

export const getAllTweets = async () => {
  // try {
  //   const response = await client.v2.user('YOUR_USER_ID').tweets();
  //   console.log('Tweets:', response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error retrieving tweets:', error);
  //   throw error;
  // }
};

export const getTweetById = async (tweetId: string) => {
  // try {
  //   const response = await client.v2.tweets(tweetId);
  //   console.log('Tweet:', response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error('Error retrieving tweet:', error);
  //   throw error;
  // }
};
