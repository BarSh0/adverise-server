import { Router } from 'express';
import { withErrorHandler } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';

const router = Router();

router.get('/adaccounts', Controllers.Twitter.getAdAccounts);
router.get('/test', Controllers.Twitter.test);
router.get('/:id/accounts', withErrorHandler(Controllers.Twitter.getAccounts));
router.get('/:id/funding-instruments', withErrorHandler(Controllers.Twitter.getFundingInstruments));
router.get('/:id/campaigns', withErrorHandler(Controllers.Twitter.getCampaigns));
router.post(
  '/:id/campaigns',
  withErrorHandler(Controllers.Twitter.createNewCampaign),
  withErrorHandler(Controllers.Automation.postAutomation)
);
router.post('/zapier', withErrorHandler(Controllers.Twitter.promoteTweet));
router.put(
  '/:id/toggle',
  withErrorHandler(Controllers.Twitter.toggleStatus),
  withErrorHandler(Controllers.Automation.toggleStatus)
);

export default router;
