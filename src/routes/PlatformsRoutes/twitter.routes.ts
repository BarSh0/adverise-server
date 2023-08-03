import { Router } from 'express';
import { withErrorHandler } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';
import userAccessValidate from '../../middleware/userAccessValidate';

const router = Router();

router.get('/adaccounts', userAccessValidate, Controllers.Twitter.getAdAccounts);
router.get('/test', userAccessValidate, Controllers.Twitter.test);
router.get('/:id/accounts', userAccessValidate, withErrorHandler(Controllers.Twitter.getAccounts));
router.get('/:id/funding-instruments', userAccessValidate, withErrorHandler(Controllers.Twitter.getFundingInstruments));
router.get('/:id/campaigns', userAccessValidate, withErrorHandler(Controllers.Twitter.getCampaigns));
router.get('/:id/audiences', userAccessValidate, withErrorHandler(Controllers.Twitter.getAudiences));
router.get('/:id/audiences/:audienceId', userAccessValidate, withErrorHandler(Controllers.Twitter.getAudienceById));
router.get('/:id/targeting-criteria', userAccessValidate, withErrorHandler(Controllers.Twitter.getAllTargetingCriteria));
router.post(
  '/:id/campaigns',
  userAccessValidate,
  withErrorHandler(Controllers.Twitter.createNewCampaign),
  withErrorHandler(Controllers.Automation.postAutomation)
);
router.post('/zapier', withErrorHandler(Controllers.Twitter.promoteTweet));
router.put(
  '/:id/toggle',
  userAccessValidate,
  withErrorHandler(Controllers.Twitter.toggleStatus),
  withErrorHandler(Controllers.Automation.toggleStatus)
);
router.post('/signin', withErrorHandler(Controllers.Twitter.signInWithTwitter));

export default router;
