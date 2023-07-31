import { Router } from 'express';
import { withErrorHandler } from '../utils/errorsHandler';
import { Controllers } from '../controllers';

const router = Router();

router.get('/', withErrorHandler(Controllers.Automation.getAllAutomations));
router.get('/:id', withErrorHandler(Controllers.Automation.getAutomation));
router.get('/page/:id', withErrorHandler(Controllers.Automation.getAutomationsByPage));
router.post('/', withErrorHandler(Controllers.Automation.postAutomation));
router.delete('/:id', withErrorHandler(Controllers.Automation.deleteAutomation));

const automationRoutes = router;

export default automationRoutes;
