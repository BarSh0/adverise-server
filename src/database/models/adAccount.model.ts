import mongoose from 'mongoose';
import { IAutomation } from './automation.model';
import { IPage } from './page.model';

export interface IAdAccount extends mongoose.Document {
  adAccountId: string;
  platform: string;
  name: string;
  accessToken: string;
  pages: IPage[];
  automations: IAutomation[];
}

const AdAccount = new mongoose.Schema({
  adAccountId: String,
  platform: String,
  name: String,
  accessToken: String,
  pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
  automations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Automation' }],
});

export default mongoose.model('AdAccount', AdAccount);
