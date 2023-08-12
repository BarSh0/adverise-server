import Joi from 'joi';
import logger from '../../../utils/logger';

type IFBRule = {
  accountId: string;
  campaignId: string;
  adPauseTime: number;
};

const FBRuleSchema = Joi.object({
  accountId: Joi.string().required(),
  campaignId: Joi.string().required(),
  adPauseTime: Joi.number().required(),
});

const FBRuleValidate = (rule: IFBRule) => {
  const { error } = FBRuleSchema.validate(rule);
  if (error) {
    logger.error(error);
    throw new Error(error.message);
  }
  return FBRuleSchema.validate(rule);
};

export { FBRuleValidate, IFBRule };
