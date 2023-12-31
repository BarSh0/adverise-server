import { Router } from 'express';
import { tryCatch } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';
import authValidation from '../../middleware/authValidation';

const router = Router();

router.get('/adaccounts', authValidation, Controllers.Twitter.getAdAccounts);
router.get('/:id/accounts', authValidation, tryCatch(Controllers.Twitter.getAccounts));
router.get('/:id/funding-instruments', authValidation, tryCatch(Controllers.Twitter.getFundingInstruments));
router.get('/:id/campaigns', authValidation, tryCatch(Controllers.Twitter.getCampaigns));
router.get('/:id/audiences', authValidation, tryCatch(Controllers.Twitter.getAudiences));
router.get('/:id/audiences/:audienceId', authValidation, tryCatch(Controllers.Twitter.getAudienceById));
router.get('/:id/targeting-criteria', authValidation, tryCatch(Controllers.Twitter.getAllTargetingCriteria));

router.post('/:id/campaigns', authValidation, tryCatch(Controllers.Twitter.createNewCampaign));
router.post('/:id/simple', authValidation, tryCatch(Controllers.Twitter.simpleCreation));
router.post('/zapier', tryCatch(Controllers.Twitter.promoteTweet));
router.post('/signin', tryCatch(Controllers.Twitter.signInWithTwitter));

router.put(
  '/:id/toggle',
  authValidation,
  tryCatch(Controllers.Twitter.toggleStatus),
  tryCatch(Controllers.Automation.toggleStatus)
);

router.delete(
  '/:id',
  authValidation,
  tryCatch(Controllers.Twitter.toggleStatus),
  tryCatch(Controllers.Automation.deleteAutomation)
);

export default router;
