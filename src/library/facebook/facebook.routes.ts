import { Router } from 'express';
import { Controllers } from '../../controllers';
import { tryCatch } from '../../utils/errorsHandler';
import authValidation from '../../middleware/authValidation';

const router = Router();

router.get('/adaccounts', authValidation, tryCatch(Controllers.Facebook.getAdAccounts));
router.get('/:id/accounts', authValidation, tryCatch(Controllers.Facebook.getAccounts));
router.get('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.getCampaigns));
router.get('/:account/:page/campaigns', authValidation, tryCatch(Controllers.Facebook.getPageCampaigns));
router.get('/webhook', (req, res) => res.send(req.query['hub.challenge']));
router.post('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.createAutomation));
router.post('/:id/simple', authValidation, tryCatch(Controllers.Facebook.simpleCreation));
router.post('/:id/ads', authValidation, tryCatch(Controllers.Facebook.postAd));
router.post('/signin', tryCatch(Controllers.Facebook.signInWithFacebook));
router.post('/webhook', tryCatch(Controllers.Facebook.promotePost));
router.put('/:id/toggle', authValidation, Controllers.Facebook.toggleAutomationStatus);
router.delete('/:id', authValidation, tryCatch(Controllers.Facebook.deleteAutomation));

export default router;
