import Joi from 'joi';
import logger from '../../utils/logger';

type IFBAd = {
  accountId: string;
  adSetId: string;
  creativeId: string;
  objective: string;
};

const FBAdSchema = Joi.object({
  accountId: Joi.string().required(),
  adSetId: Joi.string().required(),
  creativeId: Joi.string().required(),
  objective: Joi.string().required(),
});

const FBAdValidate = (ad: IFBAd) => {
  const { error } = FBAdSchema.validate(ad);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return FBAdSchema.validate(ad);
};

export { FBAdValidate, IFBAd };
