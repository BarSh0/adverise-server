import { Router } from 'express';
import { Controllers } from '../../controllers';
import { tryCatch } from '../../utils/errorsHandler';
import authValidation from '../../middleware/authValidation';

const router = Router();

router.get('/adaccounts', authValidation, tryCatch(Controllers.Facebook.getAdAccounts));
router.get('/:id/accounts', authValidation, tryCatch(Controllers.Facebook.getAccounts));
router.get('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.getCampaigns));
router.post('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.createAutomation));
router.put('/:id/toggle', authValidation, Controllers.Facebook.toggleAutomationStatus);
router.post('/webhook', tryCatch(Controllers.Facebook.promotePost));
router.get('/webhook', (req, res) => {
  res.send(req.query['hub.challenge']);
});
router.post('/signin', tryCatch(Controllers.Facebook.signInWithFacebook));

export default router;
