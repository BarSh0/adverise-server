import { Router } from 'express';
import { withErrorHandler } from '../utils/errorsHandler';
import userAccessValidate from '../middleware/userAccessValidate';
import { Controllers } from '../controllers';

const router = Router();

router.post('/register', Controllers.Auth.handleRegister);

router.post('/login', withErrorHandler(Controllers.Auth.handleLogin));

router.get('/refresh', Controllers.Auth.handleRefresh);

// router.get('/logout', authController.handleLogout);

// router.post('/forgot-password', authController.handleForgotPassword);

// router.post('/reset-password', authController.handleResetPassword);

// router.post('/verify-email', authController.handleVerifyEmail);

// router.post('/resend-verification-email', authController.handleResendVerificationEmail);

router.get('/verify', userAccessValidate);

export default router;
