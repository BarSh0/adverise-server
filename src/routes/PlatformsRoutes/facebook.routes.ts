import { Router } from 'express';
import { Controllers } from '../../controllers';
import { withErrorHandler } from '../../utils/errorsHandler';

const router = Router();

router.get('/adaccounts', withErrorHandler(Controllers.Facebook.getAdAccounts));
router.get('/:id/accounts', withErrorHandler(Controllers.Facebook.getAccounts));
router.get('/:id/campaigns', withErrorHandler(Controllers.Facebook.getCampaigns));
router.post('/:id/campaigns', withErrorHandler(Controllers.Facebook.createAutomation));
router.put('/:id/toggle', withErrorHandler(Controllers.Facebook.toggleAutomationStatus));
router.post('/webhook', withErrorHandler(Controllers.Facebook.promotePost));

const name = 'Facebook';
const controller = Controllers[name];
console.log(controller)

export default router;
