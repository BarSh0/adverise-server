import { Router } from 'express';
import { Controllers } from '../../controllers';
import { withErrorHandler } from '../../utils/errorsHandler';
import userAccessValidate from '../../middleware/userAccessValidate';

const router = Router();

router.get('/adaccounts', userAccessValidate, withErrorHandler(Controllers.Facebook.getAdAccounts));
router.get('/:id/accounts', userAccessValidate, withErrorHandler(Controllers.Facebook.getAccounts));
router.get('/:id/campaigns', userAccessValidate, withErrorHandler(Controllers.Facebook.getCampaigns));
router.post('/:id/campaigns', userAccessValidate, withErrorHandler(Controllers.Facebook.createAutomation));
router.put('/:id/toggle', userAccessValidate, withErrorHandler(Controllers.Facebook.toggleAutomationStatus));
router.post('/webhook/:hub.mode/:hub.challenge/:hub.verify_token', withErrorHandler(Controllers.Facebook.promotePost));

export default router;