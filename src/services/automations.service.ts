import { testApi } from '../config/facebook-sdk.config';

const toggleStatus = async (id: string) => {};

const createCampaign = async () => {
  await testApi();
};

export const automationService = {
  toggleStatus,
  createCampaign,
};


