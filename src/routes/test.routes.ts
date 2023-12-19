import { Router } from 'express';
import axios from 'axios';
import authValidation from '../middleware/authValidation';
import { FBServices } from '../library/facebook/services';
import { IFBAd } from '../library/facebook/types';
import { Business } from '../library/business/business.model';
import { IPage } from '../library/page/page.model';
import AppService from '../services/app';
import { IAppAdCreative } from '../library/facebook/types/AppAdCreative';

const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64data = Buffer.from(response.data, 'binary').toString('base64');
    return base64data;
  } catch (error) {
    throw error;
  }
};

const router = Router();

type AdData = {
  adName?: string;
  adHeadline?: string;
  adMedia?: string;
  adCopy?: string;
  adURL?: string;
  adUTM?: string;
};

router.post('/:id', async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

export default router;
