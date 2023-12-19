import { Router } from 'express';
import authValidation from '../middleware/authValidation';
import facebookRoutes from '../library/facebook/facebook.routes';
import instagramRoutes from '../library/instagram/instagram.routes';
import twitterRoutes from '../library/twitter/twitter.routes';
import authRoutes from './auth.routes';
import automationRoutes from '../library/automation/automation.routes';
import pageRoutes from '../library/page/page.routes';
import usersRoutes from './user.routes';
import businessRoutes from '../library/business/business.routes';
import testRouter from './test.routes';

const router = Router();

router.use('/automations', authValidation, automationRoutes);
router.use('/pages', pageRoutes);
router.use('/facebook', facebookRoutes);
router.use('/instagram', instagramRoutes);
router.use('/twitter', twitterRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/business', authValidation, businessRoutes);
router.use('/test', authValidation, testRouter);

export default router;
