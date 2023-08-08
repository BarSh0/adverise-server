import { Router } from 'express';
import { Controllers } from '../controllers';
import authValidation from '../middleware/authValidation';
import { tryCatch } from '../utils/errorsHandler';

const router = Router();

router.get('/me', authValidation, tryCatch(Controllers.User.getMe));
router.put('/me', authValidation, tryCatch(Controllers.User.updateMe));

const usersRoutes = router;

export default usersRoutes;
