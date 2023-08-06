import { Router } from 'express';
import { withErrorHandler } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';
import userAccessValidate from '../../middleware/userAccessValidate';

const router = Router();

router.get('/adaccounts', userAccessValidate, withErrorHandler(Controllers.Instagram.getAdAccounts));
router.get('/:id/accounts', userAccessValidate, withErrorHandler(Controllers.Instagram.getAccounts));
router.post('/campaigns', userAccessValidate, withErrorHandler(Controllers.Instagram.getCampaigns));
router.post('/:id/campaigns', userAccessValidate, withErrorHandler(Controllers.Facebook.createAutomation));
router.put('/:id/toggle', userAccessValidate, withErrorHandler(Controllers.Facebook.toggleAutomationStatus));
router.post('/zapier', withErrorHandler(Controllers.Instagram.promotePost));

export default router;
