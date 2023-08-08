import { Router } from 'express';
import authValidation from '../middleware/authValidation';
import facebookRoutes from '../library/facebook/facebook.routes';
import instagramRoutes from './PlatformsRoutes/instagram.routes';
import twitterRoutes from './PlatformsRoutes/twitter.routes';
import authRoutes from './auth.routes';
import automationRoutes from './automation.routes';
import pageRoutes from './page.routes';
import usersRoutes from './user.routes';

const router = Router();

router.use('/automations', authValidation, automationRoutes);
router.use('/pages', pageRoutes);
router.use('/facebook', facebookRoutes);
router.use('/instagram', instagramRoutes);
router.use('/twitter', twitterRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
