import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './user.model';

export type AutomationStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'FAILED' | 'ARCHIVED';
export enum AutomationStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED',
}
export type AmountType = 'hours' | 'days' | 'weeks' | 'months';

interface IAutomation extends Document {
  adAccountId: string;
  platform: string;
  campaign: { id: string; name: string };
  audiences: [{ id: string; name: string }];
  dailyBudget: number;
  objective: string;
  postTypes: string[];
  page: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IUser;
  posts: mongoose.Types.ObjectId[];
  status: AutomationStatus;
  lastOperation: Date;
  rules: [
    {
      id: string;
      name: string;
      adPauseTime: number;
    }
  ];
}

const AutomationSchema = new mongoose.Schema<IAutomation>(
  {
    adAccountId: { type: String, required: true },
    platform: { type: String, required: true },
    campaign: { type: { id: String, name: String }, required: true },
    dailyBudget: { type: Number, required: true },
    objective: { type: String, required: true },
    postTypes: { type: [String], required: true },
    page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Post' }],
    status: {
      type: String,
      default: 'PAUSED',
      enum: ['PENDING', 'ACTIVE', 'PAUSED', 'FAILED', 'ARCHIVED'],
      required: true,
    },
    lastOperation: { type: Date, default: Date.now() },
    audiences: [{ type: { id: String, name: String } }],
    rules: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        adPauseTime: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Automation: Model<IAutomation> = mongoose.model<IAutomation>('Automation', AutomationSchema);

export { Automation, AutomationSchema, IAutomation };
