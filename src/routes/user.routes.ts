import { Router } from 'express';
import { Controllers } from '../controllers';
import userAccessValidate from '../middleware/userAccessValidate';
import { withErrorHandler } from '../utils/errorsHandler';

const router = Router();

router.get('/me', userAccessValidate, withErrorHandler(Controllers.User.getMe));
router.put('/me', userAccessValidate, withErrorHandler(Controllers.User.updateMe));

const usersRoutes = router;

export default usersRoutes;
