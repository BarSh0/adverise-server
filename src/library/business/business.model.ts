import mongoose, { Document, Model, Schema, model } from 'mongoose';
import { IUser } from '../../database/models/user.model';
import { IPage } from '../page/page.model';

interface IBusiness extends Document {
  businessId: string;
  name: string;
  page: mongoose.Types.ObjectId | IPage;
  user: mongoose.Types.ObjectId | IUser;
  campaign: { id: string; name: string };
  audience: { id: string; name: string };
  adSetId: string;
}

const BusinessSchema = new Schema({
  businessId: { type: String, required: true },
  name: { type: String, required: true },
  page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaign: { id: String, name: String },
  audience: { id: String, name: String },
  adSetId: { type: String, required: true },
});

const Business: Model<IBusiness> = model<IBusiness>('Business', BusinessSchema);

export { Business, BusinessSchema, IBusiness };
