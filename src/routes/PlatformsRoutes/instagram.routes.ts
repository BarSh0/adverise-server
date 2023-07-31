import { Router } from 'express';
import { withErrorHandler } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';

const router = Router();

router.get('/adaccounts', withErrorHandler(Controllers.Instagram.getAdAccounts));
router.get('/:id/accounts', withErrorHandler(Controllers.Instagram.getAccounts));
router.post('/campaigns', withErrorHandler(Controllers.Instagram.getCampaigns));
router.post('/create', withErrorHandler(Controllers.Instagram.createAutomation));
router.put('/toggle/:id', withErrorHandler(Controllers.Instagram.toggleAutomationStatus));

export default router;
