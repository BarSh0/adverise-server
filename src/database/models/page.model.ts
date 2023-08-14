import mongoose, { Model, model, Document, Schema } from 'mongoose';
import { IAutomation } from './automation.model';
import { IUser } from './user.model';

interface IPage extends Document {
  pageId: string;
  name: string;
  picture: string;
  platform: string;
  user: mongoose.Types.ObjectId | IUser;
  accessToken?: string;
}

const PageSchema = new Schema({
  pageId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
  platform: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String },
});

const Page: Model<IPage> = model<IPage>('Page', PageSchema);

export { Page, PageSchema, IPage };
