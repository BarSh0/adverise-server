import { Router } from 'express';
import { tryCatch } from '../utils/errorsHandler';
import authValidation from '../middleware/authValidation';
import { Controllers } from '../controllers';

const router = Router();

router.post('/register', tryCatch(Controllers.Auth.handleRegister));
router.post('/login', tryCatch(Controllers.Auth.handleLogin));
router.get('/refresh', tryCatch(Controllers.Auth.handleRefresh));
router.get('/verify', authValidation);

export default router;
