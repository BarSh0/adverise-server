import Joi from 'joi';
import logger from '../../../utils/logger';

export type IFBCampaign = {
  campaignId?: string;
  accountId: string;
  dailyBudget: number;
  pageName: string;
  objective: string;
};

export const FBCampaignSchema = Joi.object({
  accountId: Joi.string().required(),
  dailyBudget: Joi.number().required(),
  pageName: Joi.string().required(),
  objective: Joi.string().required(),
});

export const FBCampaignValidate = (campaign: IFBCampaign) => {
  const { error } = FBCampaignSchema.validate(campaign);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return FBCampaignSchema.validate(campaign);
};
