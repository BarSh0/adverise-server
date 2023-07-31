import Joi from 'joi';
import logger from '../../utils/logger';

export type IFBAdCreative = {
  accountId: string;
  pageId: string;
  postId?: string;
};

export const FBAdCreativeSchema = Joi.object({
  accountId: Joi.string().required(),
  pageId: Joi.string().required(),
  postId: Joi.string(),
});

export const FBAdCreativeValidate = (adCreative: IFBAdCreative) => {
  const { error } = FBAdCreativeSchema.validate(adCreative);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return FBAdCreativeSchema.validate(adCreative);
};
