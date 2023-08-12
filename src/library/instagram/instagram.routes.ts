import { Router } from 'express';
import { tryCatch } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';
import authValidation from '../../middleware/authValidation';

const router = Router();

router.get('/adaccounts', authValidation, tryCatch(Controllers.Instagram.getAdAccounts));
router.get('/:id/accounts', authValidation, tryCatch(Controllers.Instagram.getAccounts));
router.get('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.getCampaigns));
router.get('/webhook', (req, res) => res.send(req.query['hub.challenge']));

router.post('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.createAutomation));
router.post('/:id/simple', authValidation, tryCatch(Controllers.Facebook.simpleCreation));
router.post('/zapier', tryCatch(Controllers.Instagram.promotePost));

router.put('/:id/toggle', authValidation, tryCatch(Controllers.Facebook.toggleAutomationStatus));

router.delete('/:id', authValidation, tryCatch(Controllers.Facebook.deleteAutomation));

export default router;
