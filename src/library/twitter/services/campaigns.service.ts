import { newTwitterAdsAPI } from './config';

enum BudgetOptimization {
  CAMPAIGN = 'CAMPAIGN',
  LINE_ITEM = 'LINE_ITEM',
}

enum EntityStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DRAFT = 'DRAFT',
}

export type newCampaignParams = {
  funding_instrument_id: string;
  name: string;
  budget_optimization?: BudgetOptimization;
  entity_status?: EntityStatus;
  daily_budget_amount_local_micro: number;
  purchase_order_number?: string;
  standard_delivery?: boolean;
  total_budget_amount_local_micro?: number;
};

export const getCampaignById = async (
  campaignId: string,
  accountId: string,
  accessToken: string,
  accessTokenSecret: string
) => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  return new Promise((resolve, reject) => {
    T.get(`accounts/${accountId}/campaigns/${campaignId}`, {}, function (error: any, resp: any, body: any) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

export const getAllCampaigns = async (adAccountId: string, accessToken: string, accessTokenSecret: string) => {
  const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
  return new Promise((resolve, reject) => {
    T.get(`accounts/${adAccountId}/campaigns`, {}, function (error: any, resp: any, body: any) {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body.data);
      }
    });
  });
};

export const duplicate = async (
  accountId: string,
  campaignId: string,
  params: any,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
    const url = `accounts/${accountId}/campaigns/${campaignId}/duplicate`;
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

export const createCampaign = async (
  accountId: string,
  req: newCampaignParams,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
    const params = {
      name: req.name,
      entity_status: req.entity_status || 'PAUSED',
      funding_instrument_id: req.funding_instrument_id,
      daily_budget_amount_local_micro: req.daily_budget_amount_local_micro,
      currency: 'USD',
    };

    const url = `accounts/${accountId}/campaigns`;

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

export const updateCampaign = async (
  accountId: string,
  campaignId: string,
  params: any,
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const T = newTwitterAdsAPI(accessToken, accessTokenSecret);
    const url = `accounts/${accountId}/campaigns/${campaignId}`;
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
