import Joi, { ObjectSchema } from 'joi';
import logger from '../../../utils/logger';

export type IAppAdCreative = {
  accountId: string;
  imageHash: string;
  adName: string;
  adHeadline: string;
  pageId: string;
  link: string;
  message: string;
};

export const AppAdCreativeSchema = Joi.object({
  accountId: Joi.string().required(),
  imageHash: Joi.string().required(),
  adName: Joi.string().required(),
  adHeadline: Joi.string().required(),
  pageId: Joi.string().required(),
  link: Joi.string().required(),
  message: Joi.string().required(),
});

export const AppAdCreativeValidate = (adCreative: IAppAdCreative) => {
  const { error } = AppAdCreativeSchema.validate(adCreative);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return AppAdCreativeSchema.validate(adCreative);
};

export const validate = <T>(schema: ObjectSchema, data: T): T => {
  const { error, value } = schema.validate(data);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return value as T;
};
