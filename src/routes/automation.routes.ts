import { Router } from 'express';
import { tryCatch } from '../utils/errorsHandler';
import { Controllers } from '../controllers';

const router = Router();

router.get('/', tryCatch(Controllers.Automation.getAllAutomations));
router.get('/:id', tryCatch(Controllers.Automation.getAutomation));
router.post('/', tryCatch(Controllers.Automation.postAutomation));
router.delete('/:id', tryCatch(Controllers.Automation.deleteAutomation));
router.delete(
  '/twitter/:id',
  tryCatch(Controllers.Twitter.toggleStatus),
  tryCatch(Controllers.Automation.deleteAutomation)
);

const automationRoutes = router;

export default automationRoutes;
