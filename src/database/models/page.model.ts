import mongoose, { Model, model, Document, Schema } from 'mongoose';
import { IAutomation } from './automation.model';

interface IPage extends Document {
  pageId: string;
  name: string;
  picture: string;
  platform: string;
  user: mongoose.Types.ObjectId;
  automation: IAutomation;
}

const PageSchema = new Schema({
  pageId: { type: String, required: true },
  name: { type: String, required: true },
  automation: { type: mongoose.Schema.Types.ObjectId, ref: 'Automation' },
  picture: { type: String },
  platform: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Page: Model<IPage> = model<IPage>('Page', PageSchema);

export { Page, PageSchema, IPage };
