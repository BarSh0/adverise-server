import Joi from 'joi';
import logger from '../../utils/logger';

export type IFBAdSet = {
  accountId: string;
  campaignId: string;
  audience: { id: string; name: string };
  objective: string;
  pixelId?: string;
};

export const FBAdSetSchema = Joi.object({
  accountId: Joi.string().required(),
  campaignId: Joi.string().required(),
  audience: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
  objective: Joi.string().required(),
  pixelId: Joi.string(),
});

export const FBAdSetValidate = (adSet: IFBAdSet) => {
  const { error } = FBAdSetSchema.validate(adSet);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return FBAdSetSchema.validate(adSet);
};
