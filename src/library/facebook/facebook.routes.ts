import { Router } from 'express';
import { Controllers } from '../../controllers';
import { tryCatch } from '../../utils/errorsHandler';
import authValidation from '../../middleware/authValidation';
import { FBServices } from './services';

const router = Router();

router.get('/adaccounts', authValidation, tryCatch(Controllers.Facebook.getAdAccounts));
router.get('/:id/accounts', authValidation, tryCatch(Controllers.Facebook.getAccounts));
router.get('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.getCampaigns));
router.get('/webhook', (req, res) => res.send(req.query['hub.challenge']));

router.post('/:id/campaigns', authValidation, tryCatch(Controllers.Facebook.createAutomation));
router.post('/:id/simple', authValidation, tryCatch(Controllers.Facebook.simpleCreation));
router.post('/signin', tryCatch(Controllers.Facebook.signInWithFacebook));
router.post('/webhook', tryCatch(Controllers.Facebook.promotePost));
router.post('/test', authValidation, async (req, res) => {
  const accessToken =
    'EAAe9FnaGY5gBOw56YbUiNcwwd6qkkDhjCMLDUUYCC3ZCuaoFLaPYlFkzn6KSQ5F6UiiAT4aGKwRoPfbqAKqyq1mlAP1g2qHrAFaTVv5jF3ZBBDDjhUPGoQJSTcED0OJ9sNulycMqPvUSF6esPmTQThggSOoxOci3v48sAPZBDPkelNZBKznM4OGwCteEgwZDZD';
  const { pageId } = req.body;
  const post = await FBServices.Others.getLastPostId(accessToken, pageId);
  res.send(post);
});

router.put('/:id/toggle', authValidation, Controllers.Facebook.toggleAutomationStatus);

router.delete('/:id', authValidation, tryCatch(Controllers.Facebook.deleteAutomation));

export default router;
