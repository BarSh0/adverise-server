import { Router } from 'express';
import { tryCatch } from '../../utils/errorsHandler';
import { Controllers } from '../../controllers';

const router = Router();

router.get('/', tryCatch(Controllers.Business.getAllBusinesses));
router.get('/:id', tryCatch(Controllers.Business.getBusiness));
router.post('/', tryCatch(Controllers.Business.postBusiness));
router.delete('/:id', tryCatch(Controllers.Business.deleteBusiness));

const automationRoutes = router;

export default automationRoutes;
