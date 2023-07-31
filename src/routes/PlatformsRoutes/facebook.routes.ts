import { Router } from 'express';
import { AutomationStatusEnum } from '../../database/models/automation.model';
import { IPost, Post, TPost } from '../../database/models/post.model';
import { withErrorHandler } from '../../utils/errorsHandler';
import { Page } from '../../database/models/page.model';
import { Controllers } from '../../controllers';

const router = Router();

router.get('/adaccounts', withErrorHandler(Controllers.Facebook.getAdAccounts));
router.get('/:id/accounts', withErrorHandler(Controllers.Facebook.getAccounts));
router.post('/campaigns', withErrorHandler(Controllers.Facebook.getCampaigns));
router.post('/create', withErrorHandler(Controllers.Facebook.createAutomation));
router.put('/toggle/:id', withErrorHandler(Controllers.Facebook.toggleAutomationStatus));

router.post('/webhook', async (req, res, next) => {
  try {
    const value = req.body.entry[0].changes[0].value;

    const dbPage = await Page.findOne({ pageId: value.from.id }).populate('automation');
    if (!dbPage || dbPage.automation?.status !== AutomationStatusEnum.ACTIVE)
      return res.send('There is no active automation for this page');

    const dbPost = await Post.findOne({ postId: value.post_id });
    if (dbPost && dbPost.handled) return res.send('post already handled');

    const post: TPost = {
      postId: value.post_id,
      campaignId: dbPage.automation.campaign.id,
      page: dbPage._id,
      item: value.item,
      itemId: value.item_id,
      link: value.link,
      message: value.message,
    };

    const newPost = await Post.create(post);

    //add to automation

    const { accessToken } = req.body.user;
    res.send(value);
  } catch (error: any) {
    console.log(error);
    res.send(error.message);
  }
});

export default router;
