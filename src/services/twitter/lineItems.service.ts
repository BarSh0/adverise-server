import { LineItemParams } from '../../types/twitterTypes/LineItem';
import {newTwitterAdsAPI} from './config';

export const getLineItemById = async (
  adAccountId: string,
  lineItemId: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${adAccountId}/line_items/${lineItemId}`;
  const params = {};
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

export const getAllLineItems = async (
  adAccountId: string,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${adAccountId}/line_items`;
  const params = {};
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

export const createLineItem = async (
  accountId: string,
  params: LineItemParams,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${accountId}/line_items`;
  return new Promise((resolve, reject) => {
    T.post(url, params, function (error: any, resp: any, body: any) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

export const updateLineItem = async (
  accountId: string,
  lineItemId: string,
  params: any,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  const url = `accounts/${accountId}/line_items/${lineItemId}`;
  return new Promise((resolve, reject) => {
    T.put(url, params, function (error: any, resp: any, body: any) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};
