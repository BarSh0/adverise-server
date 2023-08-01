import { Router } from 'express';
import userAccessValidate from '../middleware/userAccessValidate';
import { facebookService } from '../services/facebook.service';
import logger from '../utils/logger';
import adAccountsRoutes from './ad-accounts.routes';
import authRoutes from './auth.routes';
import automationRoutes from './automation.routes';
import pageRoutes from './page.routes';
import facebookRoutes from './PlatformsRoutes/facebook.routes';
import instagramRoutes from './PlatformsRoutes/instagram.routes';
import twitterRoutes from './PlatformsRoutes/twitter.routes';
import usersRoutes from './user.routes';

const router = Router();

router.use('/ad-accounts', adAccountsRoutes);
router.use('/automations', userAccessValidate, automationRoutes);
router.use('/pages', pageRoutes);
router.use('/facebook', userAccessValidate, facebookRoutes);
router.use('/instagram', userAccessValidate, instagramRoutes);
router.use('/twitter', twitterRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.get('/twitter-webhook', async (req, res) => {
  console.log(req);
  res.send('test');
});
router.get('/webhook', async (req, res) => {
  console.log(req.body);
  res.send(req.body);
});
router.put('/test', async (req, res) => {
  try {
    const userId = req.header('Authorization');
    const { accessToken, campaignId, automationId, status } = req.body;
    if (!accessToken) throw new Error('No access token provided');
    const result = await facebookService.toggleCampaignStatus(accessToken, campaignId, automationId, status);
    res.send(result);
  } catch (error) {
    logger.error(error);
    res.send(error);
  }
});

export default router;
