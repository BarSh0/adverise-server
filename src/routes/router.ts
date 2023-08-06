import { Router } from 'express';
import userAccessValidate from '../middleware/userAccessValidate';
import facebookRoutes from './PlatformsRoutes/facebook.routes';
import instagramRoutes from './PlatformsRoutes/instagram.routes';
import twitterRoutes from './PlatformsRoutes/twitter.routes';
import authRoutes from './auth.routes';
import automationRoutes from './automation.routes';
import pageRoutes from './page.routes';
import usersRoutes from './user.routes';

const router = Router();

router.use('/automations', userAccessValidate, automationRoutes);
router.use('/pages', pageRoutes);
router.use('/facebook', facebookRoutes);
router.use('/instagram', instagramRoutes);
router.use('/twitter', twitterRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
