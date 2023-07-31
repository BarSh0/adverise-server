import mongoose from 'mongoose';
import { IAutomation } from './automation.model';
import { IPage } from './page.model';

export interface IPlatform extends mongoose.Document {
  platformId: string;
  name: string;
  accessTokens: string;
  pages: IPage[];
  automations: IAutomation[];
}
const Platform = new mongoose.Schema({
  platformId: String,
  name: String,
  accessTokens: String,
  pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
  automations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Automation' }],
});

export default mongoose.model('Platform', Platform);
