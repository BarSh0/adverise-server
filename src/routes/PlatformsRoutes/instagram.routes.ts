import { Router } from 'express';
import { withErrorHandler } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';

const router = Router();

router.get('/adaccounts', withErrorHandler(Controllers.Instagram.getAdAccounts));
router.get('/:id/accounts', withErrorHandler(Controllers.Instagram.getAccounts));
router.post('/campaigns', withErrorHandler(Controllers.Instagram.getCampaigns));
router.post('/:id/campaigns', withErrorHandler(Controllers.Facebook.createAutomation));
router.put('/:id/toggle', withErrorHandler(Controllers.Facebook.toggleAutomationStatus));
router.post('/zapier', withErrorHandler(Controllers.Instagram.promotePost));

export default router;
