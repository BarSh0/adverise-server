import { Router } from 'express';
import { tryCatch } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';
import authValidation from '../../middleware/authValidation';

const router = Router();

router.get('/adaccounts', authValidation, tryCatch(Controllers.Instagram.getAdAccounts));
router.get('/:id/accounts', authValidation, tryCatch(Controllers.Instagram.getAccounts));
router.post('/campaigns', authValidation, tryCatch(Controllers.Instagram.getCampaigns));
router.post('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.createAutomation));
router.put('/:id/toggle', authValidation, tryCatch(Controllers.Facebook.toggleAutomationStatus));
router.post('/zapier', tryCatch(Controllers.Instagram.promotePost));
router.get('/webhook', (req, res) => {
  res.send(req.query['hub.challenge']);
});

export default router;
